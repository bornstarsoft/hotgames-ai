// Playwright CLI smoke test in an isolated profile on the desired site origin.
async (page) => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const answers = {
    blockzzle: ['Gap B.', 'In the separate single-square gap.'],
    ringzzle: ['No.', 'The large red ring stays.'],
    daysudoku: ['5.', 'A must be 2.']
  };
  const nextGame = { blockzzle: 'ringzzle', ringzzle: 'daysudoku', daysudoku: 'blockzzle' };
  const checks = [];
  const errors = [];
  const check = (ok, name) => { if (!ok) throw new Error(name); checks.push(name); };
  const onError = error => errors.push(error.message);
  const analytics = /google-analytics|googletagmanager|cloudflareinsights/;
  const suppress = route => route.abort('blockedbyclient');
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
      const hints = page.locator('.move-hint');
      const retry = page.getByRole('button', { name: 'Retry both questions' });
      check(new URL(page.url()).hash === '#try-a-move-check', id + ' native fragment target');
      check(await page.locator('#try-a-move-check').count() === 1 && await exercises.count() === 2, id + ' stable anchor and two exercises');
      check(await hints.count() === 2, id + ' one hint per question');
      check(await retry.isHidden(), id + ' retry is hidden until final answer opens');
      for (const [index, answer] of expected.entries()) {
        const exercise = exercises.nth(index);
        const summary = exercise.locator('summary');
        const next = exercise.locator('[data-next-practice]');
        const hint = hints.nth(index);
        const hintSummary = hint.getByText('Hint for question ' + (index + 1), { exact: true });
        const label = id + ' exercise ' + (index + 1);
        check(await page.getByText('Check answer ' + (index + 1), { exact: true }).count() === 1, label + ' unique answer label');
        check(await exercise.evaluate(el => !el.open), label + ' answer initially closed');
        check(await exercise.locator('p').first().isHidden(), label + ' answer actually hidden');
        check(await hint.locator('p').isHidden(), label + ' hint initially hidden');
        check(await hint.evaluate(el => el.nextElementSibling.matches('.move-check')), label + ' hint precedes its answer');
        await hintSummary.press('Enter');
        check(await hint.locator('p').isVisible() && (await hint.locator('p').textContent()).trim().length > 0, label + ' keyboard opens hint');
        check(await page.locator('.move-check[open]').count() === 0, label + ' hint does not open an answer');
        check(await hints.nth(1 - index).evaluate(el => !el.open), label + ' other hint stays closed');
        await hintSummary.press('Space');
        check(await hint.locator('p').isHidden(), label + ' keyboard can hide hint');
        check(await next.isHidden(), label + ' no extra link until answer opens');
        check(await next.getAttribute('href') === (index === 0
          ? '#move-check-2' : '/games/' + nextGame[id] + '/#move-check-1'), label + ' exact next practice target');
        check(await exercise.locator('input,button:not([data-retry-practice]),form,script').count() === 0, label + ' no score or data submission');
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
            check(await hintSummary.evaluate(el => {
              const r = el.getBoundingClientRect();
              return r.height >= 44 && r.width >= 44 && r.left >= 0 && r.right <= innerWidth;
            }), label + '/' + width + '/' + theme + ' hint target fits');
            check(await exercise.locator('p').evaluateAll(items => items.every(el => {
              const r = el.getBoundingClientRect();
              return r.left >= 0 && r.right <= innerWidth && el.scrollWidth <= el.clientWidth;
            })), label + '/' + width + '/' + theme + ' explanation fits');
            check(await next.evaluate(el => {
              const r = el.getBoundingClientRect();
              return r.height >= 44 && r.width >= 44 && r.left >= 0 && r.right <= innerWidth;
            }), label + '/' + width + '/' + theme + ' next link fits');
            if (index === 1) check(await retry.evaluate((button, nextLink) => {
              const r = button.getBoundingClientRect();
              const n = nextLink.getBoundingClientRect();
              return r.height >= 44 && r.width >= 44 && r.left >= 0 && r.right <= innerWidth
                && (r.left >= n.right || r.top >= n.bottom);
            }, await next.elementHandle()), label + '/' + width + '/' + theme + ' retry target fits separately');
            layouts++;
          }
        }
        await summary.click();
        check(await exercise.evaluate(el => !el.open), label + ' can retry without answer showing');
      }
      const toc = page.locator('.guide-contents');
      await toc.locator('summary').click();
      await page.locator('.guide-contents a[href="#move-check-2"]').click();
      for (const item of await page.locator('.move-hint, .move-check').all()) await item.locator('summary').click();
      check(await page.locator('.move-hint[open], .move-check[open]').count() === 4, id + ' retry setup opens all disclosures');
      const beforeRetry = await page.evaluate(() => history.length);
      await retry.press('Enter');
      check(await page.locator('.move-hint[open], .move-check[open]').count() === 0, id + ' retry closes both answers and hints');
      check(await toc.evaluate(el => el.open), id + ' retry leaves guide contents open');
      check(await page.locator('#move-check-1').evaluate(el => {
        const r = el.getBoundingClientRect();
        return el === document.activeElement && r.top >= 0 && r.bottom <= innerHeight;
      }), id + ' retry focuses the visible first question');
      check(new URL(page.url()).hash === '#move-check-1' && await page.evaluate(() => history.length) === beforeRetry, id + ' retry updates fragment without adding history');
      await toc.locator('a[href="#try-a-move-check"]').click();
      check(new URL(page.url()).hash === '#try-a-move-check', id + ' automatic contents link');
      check(await page.locator('.puzzle-image').evaluateAll(images => images.every(el => el.complete && el.naturalWidth > 0)), id + ' existing illustration loads');
      await exercises.first().locator('summary').click();
      await exercises.first().locator('[data-next-practice]').press('Enter');
      check(new URL(page.url()).hash === '#move-check-2', id + ' keyboard goes to question 2');
      check(await exercises.last().evaluate(el => !el.open), id + ' next answer stays closed');
      await page.goBack();
      check(new URL(page.url()).hash === '#try-a-move-check', id + ' Back restores practice section');
      await exercises.last().locator('summary').click();
      await exercises.last().locator('[data-next-practice]').click();
      check(new URL(page.url()).pathname === '/games/' + nextGame[id] + '/'
        && new URL(page.url()).hash === '#move-check-1' && await page.locator('h3#move-check-1').count() === 1, id + ' opens other puzzle at its first question');
      check(await page.locator('.move-check[open]').count() === 0, id + ' other guide opens without spoilers');
      check(await page.evaluate(() => localStorage.getItem('likedGames') === '["blockzzle"]' && localStorage.getItem('recentGames') === '["ringzzle"]'), id + ' practice navigation leaves collections untouched');
      await page.goto(root + '/games/');
      check(await page.locator('a[href="/games/' + id + '/#try-a-move-check"]').count() === 1, id + ' directory return available');
    }
    plainContext = await context.browser().newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const plain = await plainContext.newPage();
    for (const [id, expected] of Object.entries(answers)) {
      await plain.goto(root + '/games/' + id + '/#try-a-move-check');
      for (const [index, answer] of expected.entries()) {
        const details = plain.locator('.move-check').nth(index);
        const hint = plain.locator('.move-hint').nth(index);
        check(await details.evaluate(el => !el.open), id + '/' + index + ' no-JS starts closed');
        check(await hint.locator('p').isHidden(), id + '/' + index + ' no-JS hint starts hidden');
        await hint.locator('summary').click();
        check(await hint.locator('p').isVisible() && await details.evaluate(el => !el.open), id + '/' + index + ' no-JS hint works without spoilers');
        await details.locator('summary').click();
        check(await details.evaluate(el => el.open) && await details.locator('strong').first().textContent() === answer, id + '/' + index + ' no-JS answer works');
        if (index === 1) check(await details.locator('[data-retry-practice]').isHidden(), id + ' no-JS hides unavailable retry');
        await details.locator('[data-next-practice]').click();
        check(new URL(plain.url()).hash === (index === 0 ? '#move-check-2' : '#move-check-1'), id + '/' + index + ' no-JS practice link works');
      }
    }
    await page.goto(root + '/');
    check(await page.locator('.move-check, .move-hint, a[href$="#try-a-move-check"]').count() === 0, 'main unchanged');
    check(await page.locator('.source-section .game-card').count() === 24, 'catalog unchanged');
    check(errors.length === 0, 'no application runtime errors');
    return { engine: context.browser().browserType().name(), passed: checks.length, layouts, checks };
  } finally {
    if (plainContext) await plainContext.close();
    page.off('pageerror', onError);
    await context.unroute(analytics, suppress);
  }
}
