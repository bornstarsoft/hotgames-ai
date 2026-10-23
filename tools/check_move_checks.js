// Playwright CLI smoke test in an isolated profile on the desired site origin.
async (page) => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const answers = {
    blockzzle: ['Gap B.', 'In the separate single-square gap.'],
    ringzzle: ['No.', 'The large red ring stays.'],
    daysudoku: ['5.', 'A must be 2.']
  };
  const checks = [];
  const errors = [];
  const check = (ok, name) => { if (!ok) throw new Error(name); checks.push(name); };
  const onError = error => errors.push(error.message);
  const analytics = /google-analytics|googletagmanager|cloudflareinsights/;
  const suppress = route => route.fulfill({ body: '', contentType: 'application/javascript' });
  let plainContext;
  let layouts = 0;
  page.on('pageerror', onError);
  await context.route(analytics, suppress);
  try {
    await page.goto(root + '/');
    await page.evaluate(() => {
      localStorage.setItem('likedGames', '["blockzzle"]');
      localStorage.setItem('recentGames', '["ringzzle"]');
    });
    for (const [id, expected] of Object.entries(answers)) {
      await page.goto(root + '/games/');
      const link = page.locator('a[href="/games/' + id + '/#try-a-move-check"]');
      check(await link.count() === 1, id + ' directory link unique');
      check((await link.getAttribute('aria-label')).includes('try two move checks'), id + ' descriptive link');
      await link.click();
      await page.waitForLoadState('load');
      const exercises = page.locator('.move-check');
      check(new URL(page.url()).hash === '#try-a-move-check', id + ' native fragment target');
      check(await page.locator('#try-a-move-check').count() === 1 && await exercises.count() === 2, id + ' stable anchor and two exercises');
      for (const [index, answer] of expected.entries()) {
        const exercise = exercises.nth(index);
        const summary = exercise.locator('summary');
        const label = id + ' exercise ' + (index + 1);
        check(await page.getByText('Check answer ' + (index + 1), { exact: true }).count() === 1, label + ' unique answer label');
        check(await exercise.evaluate(el => !el.open), label + ' answer initially closed');
        check(await exercise.locator('p').first().isHidden(), label + ' answer actually hidden');
        check(await exercise.locator('input,button,form,script').count() === 0, label + ' no score or data submission');
        const url = page.url();
        await summary.click();
        check(await exercise.evaluate(el => el.open), label + ' pointer opens explanation');
        check(await exercise.locator('strong').first().textContent() === answer, label + ' correct answer');
        check(await exercises.nth(1 - index).evaluate(el => !el.open), label + ' other answer stays closed');
        check(page.url() === url, label + ' no history entry for answer');
        await summary.focus(); await summary.press('Space');
        check(await exercise.evaluate(el => !el.open), label + ' Space closes');
        await summary.press('Enter');
        check(await exercise.evaluate(el => el.open), label + ' Enter opens');
        for (const width of [320, 390, 768, 1440]) {
          await page.setViewportSize({ width, height: 844 });
          for (const theme of ['light', 'dark']) {
            await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
            await summary.scrollIntoViewIfNeeded();
            check(await summary.evaluate(el => {
              const r = el.getBoundingClientRect();
              return r.height >= 44 && r.left >= 0 && r.right <= innerWidth && document.documentElement.scrollWidth <= innerWidth;
            }), label + '/' + width + '/' + theme + ' summary fits');
            check(await exercise.locator('p').evaluateAll(items => items.every(el => {
              const r = el.getBoundingClientRect();
              return r.left >= 0 && r.right <= innerWidth && el.scrollWidth <= el.clientWidth;
            })), label + '/' + width + '/' + theme + ' explanation fits');
            layouts++;
          }
        }
        await summary.click();
        check(await exercise.evaluate(el => !el.open), label + ' can retry without answer showing');
      }
      check(await page.evaluate(() => localStorage.getItem('likedGames') === '["blockzzle"]' && localStorage.getItem('recentGames') === '["ringzzle"]'), id + ' practice leaves collections untouched');
      const toc = page.locator('.guide-contents');
      await toc.locator('summary').click();
      await toc.locator('a[href="#try-a-move-check"]').click();
      check(new URL(page.url()).hash === '#try-a-move-check', id + ' automatic contents link');
      check(await page.locator('.puzzle-image').evaluateAll(images => images.every(el => el.complete && el.naturalWidth > 0)), id + ' existing illustration loads');
      await page.goBack();
      // Fragment jumps can create an extra history entry; the directory stays a native URL.
      await page.goto(root + '/games/');
      check(await page.locator('a[href="/games/' + id + '/#try-a-move-check"]').count() === 1, id + ' directory return available');
    }
    plainContext = await context.browser().newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const plain = await plainContext.newPage();
    for (const [id, expected] of Object.entries(answers)) {
      await plain.goto(root + '/games/' + id + '/#try-a-move-check');
      for (const [index, answer] of expected.entries()) {
        const details = plain.locator('.move-check').nth(index);
        check(await details.evaluate(el => !el.open), id + '/' + index + ' no-JS starts closed');
        await details.locator('summary').click();
        check(await details.evaluate(el => el.open) && await details.locator('strong').first().textContent() === answer, id + '/' + index + ' no-JS answer works');
      }
    }
    await page.goto(root + '/');
    check(await page.locator('.move-check, a[href$="#try-a-move-check"]').count() === 0, 'main unchanged');
    check(await page.locator('.source-section .game-card').count() === 24, 'catalog unchanged');
    check(errors.length === 0, 'no application runtime errors');
    return { engine: context.browser().browserType().name(), passed: checks.length, layouts, checks };
  } finally {
    if (plainContext) await plainContext.close();
    page.off('pageerror', onError);
    await context.unroute(analytics, suppress);
  }
}
