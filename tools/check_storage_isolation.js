// Run with Playwright CLI in an isolated browser profile, never the owner's storage.
async (page) => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const checks = [];
  const errors = [];
  const check = (ok, name) => { if (!ok) throw new Error(name); checks.push(name); };
  const onError = error => errors.push(error.message);
  const analytics = /google-analytics|googletagmanager|cloudflareinsights/;
  const suppress = route => route.fulfill({ body: '', contentType: 'application/javascript' });
  const view = name => page.locator('.view-link[data-view="' + name + '"]').click();
  const ids = grid => page.locator('#' + grid + ' [data-game-id]').evaluateAll(cards => cards.map(card => card.dataset.gameId).sort().join(','));
  let other;
  let layouts = 0;
  page.on('pageerror', onError);
  await context.route(analytics, suppress);
  try {
    await page.goto(root + '/');
    await page.evaluate(() => {
      localStorage.setItem('likedGames', '["blockzzle","ringzzle"]');
      localStorage.setItem('recentGames', '["daysudoku","ringzzle"]');
      localStorage.setItem('savedGameOrder', '"newest"');
      localStorage.setItem('theme', 'dark');
    });
    await page.reload();
    other = await context.newPage();
    await other.goto(root + '/');
    await page.evaluate(() => {
      const original = Storage.prototype.setItem;
      window.failedKeys = ['likedGames', 'recentGames', 'savedGameOrder'];
      Storage.prototype.setItem = function(key, value) {
        if (this === localStorage && window.failedKeys.includes(key)) throw new DOMException('QA quota', 'QuotaExceededError');
        return original.call(this, key, value);
      };
      window.storageEvents = 0;
      window.addEventListener('storage', () => window.storageEvents++);
    });
    const change = async (key, value) => {
      const before = await page.evaluate(() => window.storageEvents);
      await other.evaluate(([key, value]) => {
        if (key === null) localStorage.clear();
        else if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      }, [key, value]);
      await page.waitForFunction(before => window.storageEvents > before, before);
    };
    await page.locator('.source-section [data-game-id="daysudoku"] .fav-btn').click();
    check((await page.locator('#toastMessage').textContent()).includes('visit'), 'temporary save honestly labeled');
    await page.locator('.source-section [data-game-id="ringzzle"] .fav-btn').click();
    await view('saved');
    check(await ids('favoritesGrid') === 'blockzzle,daysudoku', 'temporary add and remove visible');
    await page.locator('#savedOrder').selectOption('name');
    await view('recent');
    await page.locator('#recentGrid [data-game-id="ringzzle"] .recent-remove').click();
    check(await ids('recentGrid') === 'daysudoku', 'temporary recent removal visible');

    await change('theme', 'light');
    check(await page.locator('#savedCount').textContent() === '2', 'unrelated theme preserves temporary saved count');
    check(await ids('recentGrid') === 'daysudoku', 'unrelated theme preserves temporary recent removal');
    check(await page.locator('html').getAttribute('data-theme') === 'light', 'theme still synchronizes');
    await view('saved');
    check(await ids('favoritesGrid') === 'blockzzle,daysudoku', 'unrelated theme preserves temporary saved IDs');
    check(await page.locator('#savedOrder').inputValue() === 'name', 'unrelated theme preserves temporary sort');

    await change('recentGames', '["blockzzle"]');
    check(await ids('favoritesGrid') === 'blockzzle,daysudoku', 'recent update leaves temporary saves intact');
    check(await page.locator('#savedOrder').inputValue() === 'name', 'recent update leaves temporary sort intact');
    await view('recent');
    check(await ids('recentGrid') === 'blockzzle', 'same-key recent write is authoritative');
    await view('saved');
    await change('savedGameOrder', '"name"');
    await change('savedGameOrder', '"newest"');
    check(await page.locator('#savedOrder').inputValue() === 'newest', 'same-key sort write is authoritative');
    check(await ids('favoritesGrid') === 'blockzzle,daysudoku', 'sort updates leave temporary saves intact');
    await change('unrelatedPreference', 'changed');
    check(await ids('favoritesGrid') === 'blockzzle,daysudoku', 'unknown keys leave temporary saves intact');
    await page.evaluate(() => window.dispatchEvent(new StorageEvent('storage', { key: 'likedGames', storageArea: sessionStorage })));
    check(await ids('favoritesGrid') === 'blockzzle,daysudoku', 'sessionStorage event ignored');
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
    check(await ids('favoritesGrid') === 'blockzzle,daysudoku', 'bfcache refresh preserves temporary saves');

    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), width + '/' + theme + ' no overflow');
        check(await ids('favoritesGrid') === 'blockzzle,daysudoku', width + '/' + theme + ' temporary games retained');
        layouts++;
      }
    }
    await change('likedGames', '["ringzzle"]');
    check(await ids('favoritesGrid') === 'ringzzle', 'same-key saved write replaces temporary state');
    await change('likedGames', null);
    check(await page.locator('#savedCount').textContent() === '0', 'explicit saved removal respected');
    await view('discover');
    await page.locator('.source-section [data-game-id="daysudoku"] .fav-btn').click();
    await view('saved');
    check(await ids('favoritesGrid') === 'daysudoku', 'new temporary save after removal works');
    await change(null, null);
    check(await page.locator('#savedCount').textContent() === '0' && await page.locator('#recentCount').textContent() === '0', 'explicit localStorage clear respected');
    await view('discover');
    await page.locator('.source-section [data-game-id="daysudoku"] .fav-btn').click();
    await page.evaluate(() => window.failedKeys = []);
    await page.locator('.source-section [data-game-id="blockzzle"] .fav-btn').click();
    check(await page.evaluate(() => localStorage.getItem('likedGames')) === '["daysudoku","blockzzle"]', 'next successful save persists temporary collection too');
    await page.reload();
    await view('saved');
    check(await ids('favoritesGrid') === 'blockzzle,daysudoku', 'recovered saves survive reload');
    check(errors.length === 0, 'no application runtime errors');
    return { engine: context.browser().browserType().name(), passed: checks.length, layouts, checks };
  } finally {
    if (other) await other.close();
    page.off('pageerror', onError);
    await context.unroute(analytics, suppress);
  }
}
