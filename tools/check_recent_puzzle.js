// Playwright CLI run-code; separate QA profile, with external Play mocked.
async (page) => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const analytics = /google-analytics|googletagmanager|cloudflareinsights/;
  const suppress = route => route.fulfill({ body: '', contentType: 'application/javascript' });
  const play = 'https://ringzzle.com/play/';
  const mockPlay = route => route.fulfill({ body: '<title>QA destination</title>', contentType: 'text/html' });
  const errors = [];
  const onError = error => errors.push(error.message);
  let passed = 0;
  let layouts = 0;
  let other;
  let isolated;
  let popup;
  const check = (ok, label) => { if (!ok) throw new Error(label); passed++; };
  const row = page.locator('#recentPuzzle');
  const link = page.locator('#recentPuzzleLink');
  const seed = raw => page.evaluate(raw => {
    if (raw === null) localStorage.removeItem('recentGames');
    else localStorage.setItem('recentGames', raw);
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  }, raw);
  const href = id => '/games/' + id + '/#move-check-1';
  page.on('pageerror', onError);
  await context.route(analytics, suppress);
  await context.route(play, mockPlay);
  try {
    await page.goto(root + '/');
    const legacy = await page.locator('.source-section [data-game-id="daysudoku"]').getAttribute('data-legacy-id');
    await page.evaluate(() => {
      localStorage.setItem('likedGames', '["blockzzle"]');
      localStorage.removeItem('recentGames');
    });
    await page.goto(root + '/games/');
    check(await row.count() === 1 && !await row.isVisible(), 'empty history has no visible shortcut');
    for (const raw of ['{broken', '{}', '["unknown",null,42,"__proto__"]']) {
      await seed(raw);
      check(!await row.isVisible() && !await link.getAttribute('href'), 'invalid or unsupported history stays hidden');
    }
    await seed(JSON.stringify(['unknown', legacy, 'ringzzle', 'ringzzle']));
    check(await link.getAttribute('href') === href('daysudoku'), 'first supported legacy ID wins');
    check(await link.textContent() === 'Practice DaySudoku', 'specific practice destination label');
    check(await page.evaluate(() => localStorage.getItem('likedGames')) === '["blockzzle"]', 'saved games untouched');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        check(await link.evaluate(el => {
          const r = el.getBoundingClientRect();
          const p = el.parentElement.getBoundingClientRect();
          return r.width >= 44 && r.height >= 44 && r.left >= p.left && r.right <= p.right + 1
            && document.documentElement.scrollWidth <= innerWidth;
        }), width + '/' + theme + ' tap target fits');
        layouts++;
      }
    }
    const prior = await page.evaluate(() => localStorage.getItem('recentGames'));
    await link.focus(); await link.press('Enter');
    check(new URL(page.url()).hash === '#move-check-1' && await page.locator('h3#move-check-1').count() === 1, 'native practice fragment opens');
    check(await page.locator('.move-check[open]').count() === 0, 'practice answers remain closed');
    check(await page.evaluate(() => localStorage.getItem('recentGames')) === prior, 'reading practice does not count as play');
    await page.goBack();
    check(await link.getAttribute('href') === href('daysudoku'), 'Back retains useful destination');

    other = await context.newPage();
    await other.goto(root + '/games/');
    await other.evaluate(() => localStorage.setItem('recentGames', '["blockzzle","ringzzle"]'));
    await page.waitForFunction(() => document.getElementById('recentPuzzleLink').getAttribute('href') === '/games/blockzzle/#move-check-1');
    check(await link.textContent() === 'Practice Blockzzle', 'actual storage change updates shortcut');
    await page.evaluate(() => {
      localStorage.setItem('recentGames', '["ringzzle"]');
      window.dispatchEvent(new StorageEvent('storage', { key: 'recentGames', storageArea: sessionStorage }));
      window.dispatchEvent(new StorageEvent('storage', { key: 'likedGames', storageArea: localStorage }));
    });
    check(await link.getAttribute('href') === href('blockzzle'), 'session storage and unrelated events ignored');
    await seed('["ringzzle"]');
    check(await link.getAttribute('href') === href('ringzzle'), 'restored page reads current history');
    await link.focus();
    await other.evaluate(() => localStorage.removeItem('recentGames'));
    await row.waitFor({ state: 'hidden' });
    check(await page.locator('.guide-jumps a[href="#puzzles"]').evaluate(el => el === document.activeElement), 'clearing focused shortcut returns focus to stable link');
    check(!await link.getAttribute('href'), 'removed history leaves no stale href');

    const opened = page.waitForEvent('popup');
    await page.locator('.puzzle-card-actions a[href="' + play + '"]').click();
    popup = await opened;
    await popup.waitForLoadState();
    check(popup.url() === play, 'existing Play uses unchanged external URL');
    await popup.close(); popup = undefined;
    check(await link.getAttribute('href') === href('ringzzle'), 'same-tab Play immediately refreshes shortcut');
    check(await page.evaluate(() => localStorage.getItem('recentGames')) === '["ringzzle"]', 'existing history records Play only');

    for (const mode of ['blocked', 'no-js']) {
      isolated = await context.browser().newContext({ javaScriptEnabled: mode !== 'no-js' });
      await isolated.route(analytics, suppress);
      if (mode === 'blocked') await isolated.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
      });
      const probe = await isolated.newPage();
      probe.on('pageerror', onError);
      await probe.goto(root + '/games/');
      check(!await probe.locator('#recentPuzzle').isVisible(), mode + ' has no dead shortcut');
      check(await probe.locator('.puzzle-card-actions a[href="' + play + '"]').isVisible(), mode + ' keeps native Play');
      await isolated.close(); isolated = undefined;
    }
    check(errors.length === 0, 'no application runtime errors');
    return { engine: context.browser().browserType().name(), passed, layouts };
  } finally {
    if (popup) await popup.close();
    if (other) await other.close();
    if (isolated) await isolated.close();
    page.off('pageerror', onError);
    await context.unroute(analytics, suppress);
    await context.unroute(play, mockPlay);
  }
}
