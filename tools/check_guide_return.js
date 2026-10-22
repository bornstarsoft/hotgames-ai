// Run with Playwright CLI run-code in an isolated session already on the target origin.
async (page) => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const games = {
    daysudoku: 'https://daysudoku.com/',
    blockzzle: 'https://blockzzle.com/play/',
    ringzzle: 'https://ringzzle.com/play/',
  };
  const checks = [];
  const errors = [];
  const check = (ok, name) => {
    if (!ok) throw new Error(name);
    checks.push(name);
  };
  const onError = error => errors.push(error.message);
  page.on('pageerror', onError);
  const suppressAnalytics = route => route.fulfill({ body: '', contentType: 'application/javascript' });
  const analytics = /google-analytics|googletagmanager|cloudflareinsights/;
  await context.route(analytics, suppressAnalytics);
  let layouts = 0;
  let other;
  let noJS;
  let blocked;
  try {
    for (const [id, url] of Object.entries(games)) {
      await page.goto(root + '/games/' + id + '/');
      await page.evaluate(() => {
        localStorage.setItem('likedGames', JSON.stringify(['2048']));
        localStorage.setItem('recentGames', JSON.stringify(['keep-recent']));
      });
      await page.reload();
      const controls = page.locator('[data-save-game="' + id + '"]');
      const end = page.locator('nav.game-guide-actions');
      check(await controls.count() === 2, id + ' two save controls');
      check(await end.count() === 1, id + ' single end action row');
      check(await end.locator('.guide-play').getAttribute('href') === url, id + ' exact Play target');
      check(await end.locator('.guide-play').getAttribute('target') === '_blank', id + ' native new tab');
      check(await end.locator('.guide-play').getAttribute('rel') === 'noopener', id + ' safe crawlable link');
      check(await end.locator('a[href="/?view=saved"]').count() === 1, id + ' Saved link');
      check(await page.locator('#when-you-get-stuck').count() === 1, id + ' unique useful section');
      check(await page.locator('#more-puzzle-games').count() === 1, id + ' existing recommendations retained');
      const previousSection = id === 'daysudoku' ? '#who-it-is-for' : '#leaderboard';
      check(await page.locator(previousSection + ' + p').textContent() !== '', id + ' existing final section retained');
      await page.locator('.guide-contents summary').click();
      await page.locator('.guide-contents a[href="#when-you-get-stuck"]').click();
      check(new URL(page.url()).hash === '#when-you-get-stuck', id + ' contents navigation');
      check(await page.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('recentGames')))) === '["keep-recent"]', id + ' reading not recorded as play');

      await controls.last().click();
      check(await controls.evaluateAll(items => items.every(item => item.getAttribute('aria-pressed') === 'true')), id + ' bottom save updates both');
      check(await page.evaluate(() => JSON.parse(localStorage.getItem('likedGames')).includes('2048')), id + ' other saves retained');
      await controls.first().click();
      check(await controls.evaluateAll(items => items.every(item => item.getAttribute('aria-pressed') === 'false')), id + ' top remove updates both');
      await page.locator('#guideSaveUndo').click();
      check(await controls.evaluateAll(items => items.every(item => item.getAttribute('aria-pressed') === 'true')), id + ' top Undo restores both');
      check(await controls.first().evaluate(item => item === document.activeElement), id + ' top Undo focus');
      await controls.last().click();
      await page.locator('#guideSaveUndo').click();
      check(await controls.last().evaluate(item => item === document.activeElement), id + ' bottom Undo focus');
      await page.reload();
      check(await controls.evaluateAll(items => items.every(item => item.getAttribute('aria-pressed') === 'true')), id + ' saved after reload');
      check(await page.evaluate(() => localStorage.getItem('recentGames')) === '["keep-recent"]', id + ' saving not recorded as play');

      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const theme of ['light', 'dark']) {
          await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
          await end.scrollIntoViewIfNeeded();
          check(await end.evaluate(nav => {
            const bounds = nav.getBoundingClientRect();
            const children = [...nav.querySelectorAll('a,button')].map(el => el.getBoundingClientRect());
            return document.documentElement.scrollWidth <= innerWidth &&
              children.every(r => r.height >= 44 && r.width >= 44 && r.left >= bounds.left && r.right <= bounds.right + 1) &&
              children.every((a, i) => children.every((b, j) => i === j || a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top));
          }), id + ' end controls fit ' + width + '/' + theme);
          layouts++;
        }
      }
      check(await page.locator('.puzzle-image').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), id + ' illustration loaded');

      // Do not create real game visits or scores during outbound-link verification.
      const mockGame = route => route.fulfill({ body: '<title>QA destination</title>', contentType: 'text/html' });
      await context.route(url, mockGame);
      const opened = page.waitForEvent('popup');
      await end.locator('.guide-play').click();
      const popup = await opened;
      await popup.waitForLoadState('domcontentloaded');
      check(popup.url() === url, id + ' native Play opens destination');
      await popup.close();
      await context.unroute(url, mockGame);
      check(await page.evaluate(game => JSON.parse(localStorage.getItem('recentGames'))[0] === game, id), id + ' Play records recent');
      await end.locator('a[href="/?view=saved"]').click();
      check(await page.locator('#favoritesGrid [data-game-id="' + id + '"]').count() === 1, id + ' saved game reachable');
    }

    await page.goto(root + '/games/daysudoku/');
    other = await context.newPage();
    await other.goto(root + '/games/daysudoku/');
    await other.evaluate(() => localStorage.setItem('likedGames', '["daysudoku","blockzzle"]'));
    await page.waitForFunction(() => [...document.querySelectorAll('[data-save-game]')].every(el => el.getAttribute('aria-pressed') === 'true'));
    check(true, 'cross-tab addition updates both');
    await other.evaluate(() => localStorage.setItem('likedGames', '["blockzzle"]'));
    await page.waitForFunction(() => [...document.querySelectorAll('[data-save-game]')].every(el => el.getAttribute('aria-pressed') === 'false'));
    check(true, 'cross-tab removal updates both');
    await other.close();
    other = undefined;
    await page.evaluate(() => localStorage.setItem('likedGames', '["https//daysudoku.com/","blockzzle"]'));
    await page.reload();
    check(await page.locator('[data-save-game]').evaluateAll(items => items.every(item => item.getAttribute('aria-pressed') === 'true')), 'legacy saved alias updates both');
    await page.evaluate(() => localStorage.setItem('likedGames', '{malformed'));
    await page.reload();
    check(await page.locator('[data-save-game]').evaluateAll(items => items.every(item => item.getAttribute('aria-pressed') === 'false')), 'malformed storage does not show false save');

    noJS = await context.browser().newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
    const plain = await noJS.newPage();
    for (const [id, url] of Object.entries(games)) {
      await plain.goto(root + '/games/' + id + '/');
      check(await plain.locator('nav.game-guide-actions .guide-play').isVisible(), id + ' Play visible without JS');
      check(await plain.locator('nav.game-guide-actions .guide-play').getAttribute('href') === url, id + ' no-JS Play exact');
      check(await plain.locator('[data-save-game]').evaluateAll(items => items.every(el => getComputedStyle(el).display === 'none')), id + ' no dead save controls without JS');
      check(await plain.locator('#when-you-get-stuck').isVisible(), id + ' content visible without JS');
    }
    await noJS.close();
    noJS = undefined;

    blocked = await context.browser().newContext({ viewport: { width: 390, height: 844 } });
    await blocked.route(analytics, suppressAnalytics);
    await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
    const privatePage = await blocked.newPage();
    await privatePage.goto(root + '/games/daysudoku/');
    await privatePage.locator('nav.game-guide-actions [data-save-game]').click();
    check(await privatePage.locator('#guideSaveStatus').textContent() === 'Saving is unavailable in this browser.', 'blocked storage has honest feedback');
    check(await privatePage.locator('[data-save-game]').evaluateAll(items => items.every(el => el.getAttribute('aria-pressed') === 'false')), 'blocked storage does not mark saved');
    await blocked.close();
    blocked = undefined;
    await page.goto(root + '/games/daysudoku/#what-key9-means');
    check(await page.locator('#what-key9-means').count() === 1, 'old fragment preserved');
    check(await page.locator('.game-guide-content a[href="https://daysudoku.com/sudoku-mistakes/"]').count() === 1, 'existing learning link retained');
    await page.goto(root + '/');
    check(await page.locator('.source-section .game-card').count() === 24, 'homepage catalog unchanged');
    check(await page.locator('nav.game-guide-actions,#when-you-get-stuck').count() === 0, 'no homepage additions');
    check(errors.length === 0, 'no application runtime errors');
    return { engine: context.browser().browserType().name(), passed: checks.length, layouts, checks };
  } finally {
    if (other) await other.close();
    if (noJS) await noJS.close();
    if (blocked) await blocked.close();
    page.off('pageerror', onError);
    await context.unroute(analytics, suppressAnalytics);
  }
}
