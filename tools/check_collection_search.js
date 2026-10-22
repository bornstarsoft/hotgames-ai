// Playwright CLI run-code; use an isolated profile already on the target origin.
async (page) => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const checks = [];
  const errors = [];
  const check = (ok, name) => {
    if (!ok) throw new Error(name);
    checks.push(name);
  };
  const onError = error => errors.push(error.message);
  const analytics = /google-analytics|googletagmanager|cloudflareinsights/;
  const suppress = route => route.fulfill({ body: '', contentType: 'application/javascript' });
  page.on('pageerror', onError);
  await context.route(analytics, suppress);
  let layouts = 0;
  let other;
  try {
    await page.goto(root + '/');
    await page.evaluate(() => {
      localStorage.setItem('likedGames', '["blockzzle"]');
      localStorage.setItem('recentGames', '["blockzzle"]');
    });
    for (const view of ['saved', 'recent']) {
      const url = root + '/?view=' + view + '&cat=puzzle&q=Ringzzle';
      await page.goto(url);
      const link = page.locator('#emptyDiscover');
      check(await link.isVisible(), view + ' recovery visible');
      check(await link.textContent() === 'Search all games (1)', view + ' actual unique match count');
      check(await link.getAttribute('href') === '/?cat=puzzle&q=Ringzzle', view + ' query and category retained');
      check(await link.getAttribute('rel') === null, view + ' normal crawlable link');
      const label = view === 'saved' ? 'Search saved games' : 'Search recently opened games';
      check(await page.getByRole('searchbox', { name: label, exact: true }).count() === 1, view + ' accessible search scope');
      check((await page.locator('#emptyMessage').textContent()).includes(view === 'saved' ? 'saved games' : 'recently opened games'), view + ' contextual empty message');

      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const theme of ['light', 'dark']) {
          await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
          check(await page.locator('.empty-actions').evaluate(row => {
            const rects = [...row.children].filter(el => !el.hidden).map(el => el.getBoundingClientRect());
            return document.documentElement.scrollWidth <= innerWidth && rects.every(r =>
              r.height >= 44 && r.left >= 0 && r.right <= innerWidth) &&
              rects.every((a, i) => rects.every((b, j) => i === j ||
                a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top));
          }), view + ' controls fit ' + width + '/' + theme);
          layouts++;
        }
      }
      await link.focus();
      await link.press('Enter');
      check(new URL(page.url()).search === '?cat=puzzle&q=Ringzzle', view + ' navigation retains filters');
      check(await page.locator('.source-section [data-game-id="ringzzle"]:visible').count() === 1, view + ' matching game visible');
      check(await page.locator('h1').evaluate(el => document.activeElement === el), view + ' focus transferred');
      check(await page.getByRole('searchbox', { name: 'Search games', exact: true }).count() === 1, view + ' search scope restored');
      await page.goBack();
      check(new URL(page.url()).searchParams.get('view') === view && await link.isVisible(), view + ' Back restores collection search');
      await page.reload();
      check(await page.locator('#searchInput').inputValue() === 'Ringzzle' && await link.isVisible(), view + ' reload retains search');
      await page.goForward();
      check(new URL(page.url()).searchParams.get('view') === null && await link.isHidden(), view + ' Forward restores results');

      await page.goto(url);
      await page.locator('#emptyReset').click();
      check(new URL(page.url()).search === '?view=' + view, view + ' reset stays in collection');
      check(await page.locator('.collection-section [data-game-id="blockzzle"]:visible').count() === 1, view + ' reset restores own game');
      check(await link.isHidden(), view + ' no extra action with results');
      await page.locator('#searchInput').fill('not-a-real-game');
      check(await link.isHidden(), view + ' no false all-catalog matches');
      await page.locator('#searchInput').fill('<img src=x onerror=alert(1)> & +');
      check(await link.isHidden() && await page.locator('#emptyState img').count() === 0, view + ' special query rendered safely');
      await page.locator('#searchInput').fill('Blockzzle');
      check(await link.isHidden() && await page.locator('#emptyState').isHidden(), view + ' own match avoids recovery');
      check(await page.evaluate(() => localStorage.getItem('likedGames') === '["blockzzle"]' &&
        localStorage.getItem('recentGames') === '["blockzzle"]'), view + ' browsing never edits collections');
    }

    await page.goto(root + '/?view=saved&cat=action');
    const categoryTarget = await page.locator('#emptyDiscover').getAttribute('href');
    check(await page.locator('#emptyDiscover').isVisible() && categoryTarget === '/?cat=action', 'category-only recovery');
    await page.locator('#emptyDiscover').click();
    const count = await page.locator('.source-section .game-card:visible').count();
    check(count > 0, 'category-only destination has games');

    await page.goto(root + '/?view=saved&q=Ringzzle');
    other = await context.newPage();
    await other.goto(root + '/');
    await other.evaluate(() => localStorage.setItem('likedGames', '["ringzzle"]'));
    await page.locator('#emptyState').waitFor({ state: 'hidden' });
    check(await page.locator('#emptyDiscover').isHidden(), 'cross-tab save removes empty recovery');
    await other.evaluate(() => localStorage.setItem('likedGames', '[]'));
    await page.locator('#emptyDiscover').waitFor({ state: 'visible' });
    check(await page.locator('#emptyMessage').textContent() === 'No saved games yet.', 'empty collection remains distinct');
    await page.locator('#emptyDiscover').click();
    check(new URL(page.url()).search === '?q=Ringzzle', 'empty collection preserves query too');
    await page.goto(root + '/?view=saved');
    check(await page.locator('#emptyDiscover').isHidden(), 'empty unfiltered collection has no duplicate action');
    await page.locator('#emptyReset').click();
    check(new URL(page.url()).search === '', 'empty collection Browse returns home');
    check(await page.locator('#emptyState').isHidden(), 'normal home remains simple');
    check(await page.locator('.source-section .game-card').count() === 24, 'catalog unchanged');
    for (const [id, url] of Object.entries({ daysudoku: 'https://daysudoku.com/', blockzzle: 'https://blockzzle.com/play/', ringzzle: 'https://ringzzle.com/play/' })) {
      check(await page.locator('.source-section [data-game-id="' + id + '"] .play-link').getAttribute('href') === url, id + ' Play preserved');
    }
    await page.goto(root + '/?q=not-a-real-game');
    check(await page.locator('#emptyDiscover').isHidden(), 'Discover never offers itself');
    check(errors.length === 0, 'no JavaScript errors');
    return { engine: context.browser().browserType().name(), passed: checks.length, layouts, checks };
  } finally {
    if (other) await other.close();
    page.off('pageerror', onError);
    await context.unroute(analytics, suppress);
  }
}
