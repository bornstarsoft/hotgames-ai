// Run with Playwright CLI in an isolated profile, never the owner's collections.
async (page) => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const checks = [];
  const errors = [];
  const check = (ok, name) => { if (!ok) throw new Error(name); checks.push(name); };
  const onError = error => errors.push(error.message);
  const analytics = /google-analytics|googletagmanager|cloudflareinsights/;
  const suppress = route => route.fulfill({ body: '', contentType: 'application/javascript' });
  const cardControl = (grid, id, control) => page.locator('#' + grid + ' [data-game-id="' + id + '"] ' + control);
  const focused = locator => locator.evaluate(el => el === document.activeElement);
  let other;
  let layouts = 0;
  const seed = async (view, order = 'newest') => {
    await page.goto(root + '/');
    await page.evaluate(order => {
      localStorage.setItem('likedGames', '["ringzzle","blockzzle","daysudoku"]');
      localStorage.setItem('recentGames', '["daysudoku","blockzzle","ringzzle"]');
      localStorage.setItem('savedGameOrder', JSON.stringify(order));
    }, order);
    await page.goto(root + '/?view=' + view);
  };
  page.on('pageerror', onError);
  await context.route(analytics, suppress);
  try {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const theme of ['light', 'dark']) {
        for (const view of ['saved', 'recent']) {
          await seed(view);
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          const grid = view === 'saved' ? 'favoritesGrid' : 'recentGrid';
          const control = view === 'saved' ? '.fav-btn' : '.recent-remove';
          const name = width + '/' + theme + '/' + view;
          await cardControl(grid, 'blockzzle', control).focus();
          await page.keyboard.press('Enter');
          check(await focused(cardControl(grid, 'ringzzle', control)), name + ' middle removal focuses next');
          await page.locator('#toastUndo').click();
          check(await focused(cardControl(grid, 'blockzzle', control)), name + ' Undo restores original control');
          // Reload normalizes restored saved order without relying on its old slot.
          await seed(view);
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          await cardControl(grid, 'ringzzle', control).focus();
          await page.keyboard.press('Space');
          check(await focused(cardControl(grid, 'blockzzle', control)), name + ' last removal focuses previous');
          await page.locator('#toastDismiss').click();
          check(await focused(cardControl(grid, 'blockzzle', control)), name + ' dismiss returns to remaining neighbor');
          await cardControl(grid, 'daysudoku', control).click();
          check(await focused(cardControl(grid, 'blockzzle', control)), name + ' first removal focuses next');
          await cardControl(grid, 'blockzzle', control).click();
          check(await focused(page.locator('h1')) && await page.locator('#emptyState').isVisible(), name + ' final removal safely focuses heading');
          await page.locator('#toastUndo').click();
          check(await focused(cardControl(grid, 'blockzzle', control)), name + ' empty-list Undo restores control');
          check(await cardControl(grid, 'blockzzle', control).evaluate(el => {
            const r = el.getBoundingClientRect();
            return r.width >= 44 && r.height >= 44 && r.left >= 0 && r.right <= innerWidth
              && document.documentElement.scrollWidth <= innerWidth;
          }), name + ' control fits and remains a touch target');
          layouts++;
        }
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    for (const order of ['name', 'recent']) {
      await seed('saved', order);
      const ids = await page.locator('#favoritesGrid .game-card').evaluateAll(cards => cards.map(card => card.dataset.gameId));
      await cardControl('favoritesGrid', ids[0], '.fav-btn').click();
      check(await focused(cardControl('favoritesGrid', ids[1], '.fav-btn')), order + ' removal respects displayed order');
      await page.locator('#toastUndo').click();
      check(await focused(cardControl('favoritesGrid', ids[0], '.fav-btn')), order + ' Undo follows identity');
    }
    await seed('recent');
    await cardControl('recentGrid', 'blockzzle', '.fav-btn').click();
    check(await focused(cardControl('recentGrid', 'blockzzle', '.fav-btn')), 'unsaving from Recent keeps same card');
    await page.locator('#toastUndo').click();
    check(await focused(cardControl('recentGrid', 'blockzzle', '.fav-btn')), 'Recent save Undo keeps same control');
    await seed('saved');
    await page.locator('#searchInput').fill('ringzzle');
    check(await focused(page.locator('#searchInput')), 'search rerender does not steal input focus');
    await cardControl('favoritesGrid', 'ringzzle', '.fav-btn').click();
    check(await focused(page.locator('h1')), 'last filtered match does not focus hidden cards');
    await page.locator('#toastUndo').click();
    check(await focused(cardControl('favoritesGrid', 'ringzzle', '.fav-btn')), 'filtered Undo returns to matching card');
    await page.goto(root + '/?view=saved');
    await cardControl('favoritesGrid', 'ringzzle', '.fav-btn').click();
    await page.locator('.view-link[data-view="recent"]').click();
    await page.locator('#toastUndo').click();
    check(await focused(page.locator('h1')), 'Undo after view change does not focus a hidden grid');

    await seed('saved', 'recent');
    other = await context.newPage();
    await other.goto(root + '/');
    await cardControl('favoritesGrid', 'ringzzle', '.play-link').focus();
    await other.evaluate(() => localStorage.setItem('recentGames', '["ringzzle","daysudoku","blockzzle"]'));
    await page.waitForFunction(() => document.querySelector('#favoritesGrid .game-card').dataset.gameId === 'ringzzle');
    check(await focused(cardControl('favoritesGrid', 'ringzzle', '.play-link')), 'cross-tab reorder preserves focused game and action');
    await cardControl('favoritesGrid', 'blockzzle', '.detail-link').focus();
    await other.evaluate(() => localStorage.setItem('likedGames', '["ringzzle","daysudoku"]'));
    await page.waitForFunction(() => document.querySelectorAll('#favoritesGrid .game-card').length === 2);
    check(await focused(cardControl('favoritesGrid', 'daysudoku', '.detail-link')), 'cross-tab removal preserves neighboring action');
    await page.locator('#searchInput').focus();
    await other.evaluate(() => localStorage.setItem('likedGames', '["ringzzle"]'));
    await page.waitForFunction(() => document.querySelectorAll('#favoritesGrid .game-card').length === 1);
    check(await focused(page.locator('#searchInput')), 'cross-tab update does not steal focus outside collection');
    await page.goto(root + '/');
    check(await cardControl('favoritesGrid', 'ringzzle', '.fav-btn').isHidden(), 'compact preview still hides save control');
    await cardControl('favoritesGrid', 'ringzzle', '.play-link').focus();
    await other.evaluate(() => localStorage.setItem('likedGames', '[]'));
    await page.waitForFunction(() => document.getElementById('favoritesSection').hidden);
    check(await focused(page.locator('h1')), 'cross-tab empty compact preview has safe fallback');
    check(await page.locator('.source-section .game-card').count() === 24, 'catalog unchanged');
    check(errors.length === 0, 'no application errors');
    return { engine: context.browser().browserType().name(), passed: checks.length, layouts, checks };
  } finally {
    if (other) await other.close();
    page.off('pageerror', onError);
    await context.unroute(analytics, suppress);
  }
}
