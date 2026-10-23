// Playwright CLI; isolated profile only. No actual game launches or owner data.
async (page) => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const checks = [];
  const errors = [];
  const check = (ok, name) => { if (!ok) throw new Error(name); checks.push(name); };
  const onError = error => errors.push(error.message);
  const analytics = /google-analytics|googletagmanager|cloudflareinsights/;
  const suppress = route => route.fulfill({ body: '', contentType: 'application/javascript' });
  const labels = { saved: 'Back to saved games', recent: 'Back to recently opened', discover: 'Back to game results' };
  let probe;
  let plainContext;
  let layouts = 0;
  page.on('pageerror', onError);
  await context.route(analytics, suppress);
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(root + '/');
    await page.evaluate(() => {
      localStorage.setItem('likedGames', '["ringzzle","blockzzle","daysudoku"]');
      localStorage.setItem('recentGames', '["daysudoku","ringzzle","blockzzle"]');
    });
    for (const view of ['saved', 'recent', 'discover']) {
      for (const game of ['blockzzle', 'ringzzle', 'daysudoku']) {
        const from = new URL('/', root);
        if (view !== 'discover') from.searchParams.set('view', view);
        from.searchParams.set('cat', 'puzzle');
        from.searchParams.set('q', game);
        from.searchParams.set('returnTo', 'https://example.invalid/');
        from.hash = 'unrelated';
        await page.goto(from.href);
        const selector = view === 'saved' ? '#favoritesGrid' : view === 'recent' ? '#recentGrid' : '.source-section';
        await page.locator(selector + ' [data-game-id="' + game + '"] .detail-link').click();
        await page.waitForLoadState('domcontentloaded');
        check(new URL(page.url()).pathname === '/games/' + game + '/', view + '/' + game + ' native guide navigation');
        const links = page.locator('[data-guide-back]');
        const expected = new URL('/', root);
        if (view !== 'discover') expected.searchParams.set('view', view);
        expected.searchParams.set('cat', 'puzzle');
        expected.searchParams.set('q', game);
        check(await links.count() === 2, 'two existing return links, no new controls');
        check(await links.evaluateAll((links, expected) => links.every(link => link.href === expected), expected.href), 'only catalog view and filters retained');
        check(await links.locator('[data-guide-back-label]').evaluateAll((labels, text) => labels.every(label => label.textContent === text), labels[view]), 'return purpose matches source');
        check(await page.evaluate(() => localStorage.getItem('likedGames')) === '["ringzzle","blockzzle","daysudoku"]', 'saves unchanged');
        check(await page.evaluate(() => localStorage.getItem('recentGames')) === '["daysudoku","ringzzle","blockzzle"]', 'reading does not record play');
        await page.reload();
        check(await links.first().getAttribute('href') === expected.pathname + expected.search, 'reload retains referrer context');
        if (game === 'daysudoku') {
          for (const width of [320, 390, 768, 1440]) {
            await page.setViewportSize({ width, height: 844 });
            for (const theme of ['light', 'dark']) {
              await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
              check(await links.evaluateAll(links => document.documentElement.scrollWidth <= innerWidth && links.every(link => {
                const r = link.getBoundingClientRect();
                return r.height >= 44 && r.left >= 0 && r.right <= innerWidth;
              })), view + '/' + width + '/' + theme + ' return labels fit');
              layouts++;
            }
          }
          await page.setViewportSize({ width: 390, height: 844 });
        }
        await links.nth(game === 'ringzzle' ? 1 : 0).focus();
        await page.keyboard.press('Enter');
        await page.waitForURL(expected.href);
        check(page.url() === expected.href, 'keyboard return restores exact sanitized filters');
        check(await page.locator('#searchInput').inputValue() === game, 'search restored');
        check(await page.locator(selector + ' [data-game-id="' + game + '"]').isVisible(), 'original game remains reachable');
      }
    }

    // Sharing a tip must not expose the private list or search used to reach it.
    await page.goto(root + '/?view=recent&cat=puzzle&q=ringzzle');
    await page.locator('#recentGrid [data-game-id="ringzzle"] .detail-link').click();
    await page.evaluate(() => {
      window.contextCopy = '';
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.contextCopy = text; } } });
    });
    await page.locator('[data-copy-tip="when-you-get-stuck"]').click();
    check(await page.evaluate(() => window.contextCopy) === 'https://hotgames.ai/games/ringzzle/#when-you-get-stuck', 'shared tip excludes return context');

    const cases = [
      ['', '/games/', 'Puzzle guides'],
      ['https://example.invalid/?view=saved', '/games/', 'Puzzle guides'],
      [root + '/games/?view=recent', '/games/', 'Puzzle guides'],
      [root + '/games/blockzzle/', '/games/', 'Puzzle guides'],
      ['not a URL', '/games/', 'Puzzle guides'],
      [root + '/?view=unknown&utm_source=test#fragment', '/', 'Back to all games'],
      [root + '/', '/', 'Back to all games'],
      [root + '/?view=recent&cat=browser&q=a%26b%20%3Csvg%3E&extra=secret', '/?view=recent&cat=browser&q=a%26b+%3Csvg%3E', 'Back to recently opened']
    ];
    for (const [referrer, expected, label] of cases) {
      probe = await context.newPage();
      await probe.addInitScript(referrer => Object.defineProperty(document, 'referrer', { get: () => referrer }), referrer);
      await probe.goto(root + '/games/daysudoku/');
      check(await probe.locator('[data-guide-back]').first().getAttribute('href') === expected, 'safe referrer destination: ' + referrer);
      check(await probe.locator('[data-guide-back-label]').first().textContent() === label, 'safe fallback label');
      if (expected === '/games/') check(await probe.locator('[data-guide-back]').last().getAttribute('href') === '/?view=saved', 'default end Saved link retained');
      await probe.close(); probe = undefined;
    }
    plainContext = await context.browser().newContext({ javaScriptEnabled: false });
    const plain = await plainContext.newPage();
    await plain.goto(root + '/games/daysudoku/', { referer: root + '/?view=recent' });
    check(await plain.locator('[data-guide-back]').first().getAttribute('href') === '/games/', 'no-JS guide fallback usable');
    check(await plain.locator('[data-guide-back]').last().getAttribute('href') === '/?view=saved', 'no-JS Saved fallback usable');
    await page.goto(root + '/');
    check(await page.locator('[data-guide-back]').count() === 0, 'main has no added controls');
    check(await page.locator('.source-section .game-card').count() === 24, 'catalog unchanged');
    check(errors.length === 0, 'no application runtime errors');
    return { engine: context.browser().browserType().name(), passed: checks.length, layouts };
  } finally {
    if (probe) await probe.close();
    if (plainContext) await plainContext.close();
    page.off('pageerror', onError);
    await context.unroute(analytics, suppress);
  }
}
