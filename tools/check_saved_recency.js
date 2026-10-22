// Playwright CLI smoke test; use an isolated profile, never the owner's local lists.
async (page) => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const checks = [];
  const errors = [];
  const check = (ok, name) => { if (!ok) throw new Error(name); checks.push(name); };
  const onError = error => errors.push(error.message);
  const analytics = /google-analytics|googletagmanager|cloudflareinsights/;
  const suppress = route => route.fulfill({ body: '', contentType: 'application/javascript' });
  const gameStub = route => route.fulfill({ body: '<title>QA launch</title>', contentType: 'text/html' });
  const order = () => page.locator('#favoritesGrid [data-game-id]').evaluateAll(cards => cards.map(card => card.dataset.gameId).join(','));
  const view = name => page.locator('.view-link[data-view="' + name + '"]').click();
  let other;
  let popup;
  let layouts = 0;
  page.on('pageerror', onError);
  await context.route(analytics, suppress);
  await context.route('https://ringzzle.com/**', gameStub);
  try {
    await page.goto(root + '/');
    await page.evaluate(() => {
      localStorage.setItem('likedGames', '["ringzzle","blockzzle","daysudoku"]');
      localStorage.setItem('recentGames', '["blockzzle","ringzzle"]');
      localStorage.setItem('savedGameOrder', '"newest"');
    });
    await page.goto(root + '/?view=saved');
    check(await order() === 'daysudoku,blockzzle,ringzzle', 'default newest-saved preserved');
    await page.locator('#savedOrder').selectOption('recent');
    check(await order() === 'blockzzle,ringzzle,daysudoku', 'recently opened saved games first');
    check(await page.evaluate(() => localStorage.getItem('likedGames')) === '["ringzzle","blockzzle","daysudoku"]', 'sort does not rewrite saves');
    check(await page.evaluate(() => localStorage.getItem('recentGames')) === '["blockzzle","ringzzle"]', 'sort does not rewrite history');
    check(await page.evaluate(() => localStorage.getItem('savedGameOrder')) === '"recent"', 'choice persisted');
    await page.reload();
    check(await order() === 'blockzzle,ringzzle,daysudoku' && await page.locator('#savedOrder').inputValue() === 'recent', 'choice and order survive reload');
    await page.locator('.filter-btn[data-filter="browser"]').click();
    await page.locator('#searchInput').fill('Ringzzle');
    check(await order() === 'ringzzle' && await page.locator('#savedOrder').inputValue() === 'recent', 'filters retain recency preference');
    await page.locator('#searchClear').click();
    check(await order() === 'blockzzle,ringzzle,daysudoku', 'clearing search restores recency');
    await view('discover');
    check(await order() === 'daysudoku,blockzzle', 'compact preview remains newest two saves');
    check(await page.locator('#savedOrderControl').isHidden(), 'no sorting controls on main');
    await view('recent');
    check(await page.locator('#savedOrderControl').isHidden(), 'no added controls in Recent');
    await view('saved');
    await page.locator('#favoritesGrid [data-game-id="blockzzle"] .fav-btn').click();
    check(await order() === 'ringzzle,daysudoku', 'remove keeps remaining recency order');
    await page.locator('#toastUndo').click();
    check(await order() === 'blockzzle,ringzzle,daysudoku', 'Undo restores game at history position');
    await page.locator('#clearSavedBtn').click();
    check(await page.locator('#savedOrder').inputValue() === 'recent' && await page.locator('#emptyState').isVisible(), 'empty Saved retains preference');
    await page.locator('#toastUndo').click();
    check(await order() === 'blockzzle,ringzzle,daysudoku', 'clear Undo restores recency');

    other = await context.newPage();
    await other.goto(root + '/');
    await other.evaluate(() => localStorage.setItem('recentGames', '["daysudoku","ringzzle"]'));
    await page.waitForFunction(() => document.querySelector('#favoritesGrid .game-card')?.dataset.gameId === 'daysudoku');
    check(await order() === 'daysudoku,ringzzle,blockzzle', 'another tab updates recent ranking');
    const opened = page.waitForEvent('popup');
    await page.locator('#favoritesGrid [data-game-id="ringzzle"] .play-link').click();
    popup = await opened;
    await popup.waitForLoadState('domcontentloaded');
    check(popup.url() === 'https://ringzzle.com/play/', 'native Play target unchanged');
    await popup.close(); popup = undefined;
    await page.waitForFunction(() => document.querySelector('#favoritesGrid .game-card')?.dataset.gameId === 'ringzzle');
    check(await order() === 'ringzzle,daysudoku,blockzzle', 'opening a saved game moves it first');
    await view('recent');
    await page.locator('#clearRecentBtn').click();
    await view('saved');
    check(await order() === 'blockzzle,daysudoku,ringzzle', 'no history falls back to newest saved');
    await page.locator('#toastUndo').click();
    check(await order() === 'ringzzle,daysudoku,blockzzle', 'history Undo restores recency ordering');
    await other.evaluate(() => localStorage.setItem('savedGameOrder', '"name"'));
    await page.waitForFunction(() => document.getElementById('savedOrder').value === 'name');
    check(await order() === 'blockzzle,daysudoku,ringzzle', 'alphabetical sorting still synchronizes');
    await other.evaluate(() => localStorage.setItem('savedGameOrder', '"recent"'));
    await page.waitForFunction(() => document.getElementById('savedOrder').value === 'recent');
    check(await order() === 'ringzzle,daysudoku,blockzzle', 'recency choice synchronizes across tabs');
    await other.evaluate(() => localStorage.setItem('recentGames', 'not-json'));
    await page.waitForFunction(() => document.getElementById('recentCount').textContent === '0');
    check(await order() === 'blockzzle,daysudoku,ringzzle', 'malformed history uses saved order');
    const legacy = await page.locator('.source-section [data-game-id="daysudoku"]').getAttribute('data-legacy-id');
    await other.evaluate(legacy => localStorage.setItem('recentGames', JSON.stringify(['missing-game', legacy, legacy, 'ringzzle'])), legacy);
    await page.waitForFunction(() => document.getElementById('recentCount').textContent === '2');
    check(await order() === 'daysudoku,ringzzle,blockzzle', 'history normalizes legacy duplicates and unavailable IDs');
    await other.evaluate(() => localStorage.setItem('savedGameOrder', '"unknown"'));
    await page.waitForFunction(() => document.getElementById('savedOrder').value === 'newest');
    check(await order() === 'blockzzle,daysudoku,ringzzle', 'invalid preference falls back safely');
    await page.evaluate(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, value) {
        if (key === 'savedGameOrder') throw new DOMException('QA quota', 'QuotaExceededError');
        return original.call(this, key, value);
      };
    });
    await page.locator('#savedOrder').selectOption('recent');
    check(await order() === 'daysudoku,ringzzle,blockzzle', 'temporary choice works when storage fails');
    check(await page.locator('#toastMessage').textContent() === 'Sort order changed for this visit', 'temporary choice honest feedback');
    const nextTheme = await page.locator('html').getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    await other.evaluate(theme => localStorage.setItem('theme', theme), nextTheme);
    await page.waitForFunction(theme => document.documentElement.dataset.theme === theme, nextTheme);
    check(await page.locator('#savedOrder').inputValue() === 'recent', 'unrelated tab change preserves temporary recency choice');

    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        check(await page.locator('#savedOrder').evaluate(el => {
          const r = el.getBoundingClientRect();
          return r.height >= 44 && r.left >= 0 && r.right <= innerWidth && document.documentElement.scrollWidth <= innerWidth;
        }), width + '/' + theme + ' native select fits');
        await page.locator('#savedOrder').focus();
        check(await page.locator('#savedOrder').evaluate(el => el === document.activeElement), width + '/' + theme + ' select focusable');
        layouts++;
      }
    }
    check(errors.length === 0, 'no application runtime errors');
    return { engine: context.browser().browserType().name(), passed: checks.length, layouts, checks };
  } finally {
    if (popup) await popup.close();
    if (other) await other.close();
    page.off('pageerror', onError);
    await context.unroute(analytics, suppress);
    await context.unroute('https://ringzzle.com/**', gameStub);
  }
}
