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

    // Help links must not turn reading into a recorded game launch.
    await page.goto(root + '/');
    const extraId = await page.locator('.source-section .game-card:not([data-guide-help])').first().getAttribute('data-game-id');
    const ids = [...Object.keys(games), extraId];
    await page.evaluate(ids => {
      localStorage.setItem('likedGames', JSON.stringify(ids));
      localStorage.setItem('recentGames', JSON.stringify(ids));
      localStorage.setItem('savedGameOrder', 'name');
    }, ids);
    const preserved = JSON.stringify(ids);
    for (const view of ['saved', 'recent']) {
      const grid = view === 'saved' ? '#favoritesGrid' : '#recentGrid';
      await page.goto(root + '/?view=' + view);
      check(await page.locator(grid + ' .detail-link[href$="#when-you-get-stuck"]').count() === 3, view + ' three help links');
      check(await page.locator(grid + ' [data-game-id="' + extraId + '"] a[href$="#when-you-get-stuck"]').count() === 0, view + ' no invented help for other games');
      for (const id of Object.keys(games)) {
        const url = root + '/?view=' + view + '&cat=puzzle&q=' + id;
        await page.goto(url);
        const link = page.locator(grid + ' [data-game-id="' + id + '"] .detail-link');
        check(await link.textContent() === 'Puzzle help', view + '/' + id + ' clear label');
        check(await link.evaluate(a => a.href) === root + '/games/' + id + '/#when-you-get-stuck', view + '/' + id + ' exact help destination');
        check((await link.getAttribute('aria-label')).endsWith(': when you get stuck'), view + '/' + id + ' accessible purpose');
        await link.click();
        check(new URL(page.url()).hash === '#when-you-get-stuck', view + '/' + id + ' native fragment');
        check(await page.locator('#when-you-get-stuck').evaluate(el => {
          const rect = el.getBoundingClientRect();
          return rect.top >= 0 && rect.top < innerHeight;
        }), view + '/' + id + ' target in viewport');
        check(await page.evaluate(() => localStorage.getItem('recentGames')) === preserved, view + '/' + id + ' reading leaves recents unchanged');
        check(await page.evaluate(() => localStorage.getItem('likedGames')) === preserved, view + '/' + id + ' reading leaves saves unchanged');
        await page.goBack();
        check(page.url() === url, view + '/' + id + ' Back retains filters');
        check(await link.isVisible(), view + '/' + id + ' Back restores help');
      }
      await page.goto(root + '/?view=' + view);
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const theme of ['light', 'dark']) {
          await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
          check(await page.locator(grid + ' .detail-link[href$="#when-you-get-stuck"]').evaluateAll(links =>
            document.documentElement.scrollWidth <= innerWidth && links.every(link => {
              const r = link.getBoundingClientRect(), card = link.closest('.game-card').getBoundingClientRect();
              return r.height >= 44 && r.left >= card.left && r.right <= card.right;
            })), view + ' help layout ' + width + '/' + theme);
          layouts++;
        }
      }
    }
    await page.goto(root + '/?view=saved');
    await page.locator('#favoritesGrid [data-game-id="daysudoku"] .fav-btn').click();
    await page.locator('#toastUndo').click();
    check(await page.locator('#favoritesGrid [data-game-id="daysudoku"] .detail-link').textContent() === 'Puzzle help', 'Saved Undo restores help link');
    await page.goto(root + '/?view=recent');
    await page.locator('#recentGrid [data-game-id="daysudoku"] .recent-remove').click();
    await page.locator('#toastUndo').click();
    check(await page.locator('#recentGrid [data-game-id="daysudoku"] .detail-link').textContent() === 'Puzzle help', 'Recent Undo restores help link');
    await page.goto(root + '/');
    check(await page.locator('.source-section .detail-link').evaluateAll(links => links.every(a => a.textContent === 'Details' && !a.hash)), 'Discover guide links unchanged');
    check(await page.locator('#homeCollections .detail-link').evaluateAll(links => links.every(a => getComputedStyle(a).display === 'none')), 'no added preview links');
    await page.goto(root + '/games/');
    const directoryHelp = page.locator('#starting-tips .guide-detail[href$="#when-you-get-stuck"]');
    check(await directoryHelp.count() === 3, 'directory has three contextual help links');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
        check(await directoryHelp.evaluateAll(links => document.documentElement.scrollWidth <= innerWidth && links.every(a => {
          const box = a.getBoundingClientRect();
          return box.height >= 44 && box.left >= 0 && box.right <= innerWidth;
        })), 'directory help layout ' + width + '/' + theme);
        layouts++;
      }
    }
    for (const id of Object.keys(games)) {
      const link = page.locator('#starting-tips a[href="/games/' + id + '/#when-you-get-stuck"]');
      await link.click();
      check(new URL(page.url()).hash === '#when-you-get-stuck' && await page.locator('#when-you-get-stuck').count() === 1, id + ' directory help resolves');
      await page.goBack();
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
    await plain.goto(root + '/games/');
    check(await plain.locator('#starting-tips a[href$="#when-you-get-stuck"]').count() === 3, 'directory help available without JS');
    await plain.locator('#starting-tips a[href="/games/daysudoku/#when-you-get-stuck"]').click();
    check(new URL(plain.url()).hash === '#when-you-get-stuck' && await plain.locator('#when-you-get-stuck').isVisible(), 'no-JS native help navigation');
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
