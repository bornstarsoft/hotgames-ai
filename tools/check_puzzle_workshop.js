// Playwright CLI run-code; no external gameplay or owner data.
async page => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const pattern = /google-analytics|googletagmanager|cloudflareinsights/;
  const suppress = route => route.abort('blockedbyclient');
  const examples = [
    ['blockzzle', 'Blockzzle', 'blockzzle-crossing-lines', 'Use the two-square block.'],
    ['ringzzle', 'Ringzzle', 'ringzzle-distant-slot', 'Choose spot B.'],
    ['daysudoku', 'DaySudoku', 'daysudoku-box-to-row', 'Yes.']
  ];
  let passed = 0;
  let layouts = 0;
  let plain;
  const errors = [];
  const onError = error => errors.push(error.message);
  const check = (ok, name) => { if (!ok) throw new Error(name); passed++; };
  page.on('pageerror', onError);
  await context.route(pattern, suppress);
  try {
    await page.goto(root + '/games/');
    await page.evaluate(() => {
      localStorage.setItem('likedGames', '["blockzzle"]');
      localStorage.setItem('recentGames', '["ringzzle"]');
      localStorage.setItem('hotgamesLastPractice', '{"game":"daysudoku","question":2}');
    });
    const entrance = page.getByRole('link', { name: 'Puzzle Workshop' });
    check(await entrance.count() === 1 && await entrance.getAttribute('href') === '/games/practice/', 'one crawlable directory entrance');
    await entrance.press('Enter');
    await page.waitForURL(root + '/games/practice/');
    check(await page.getByRole('heading', { level: 1, name: 'Puzzle Workshop' }).count() === 1, 'workshop title');
    check(await page.locator('link[rel=canonical]').getAttribute('href') === 'https://hotgames.ai/games/practice/', 'canonical workshop URL');
    check(await page.locator('.move-hint').count() === 3 && await page.locator('.move-check').count() === 3, 'three standalone examples');
    const boards = page.locator('.practice-board');
    check(await boards.count() === 3, 'one board per example');
    const boardStyle = page.locator('link[rel="stylesheet"][href*="/css/practice-boards.min."]');
    check(await boardStyle.count() === 1 && await boardStyle.evaluate(el => !!el.sheet?.cssRules.length), 'scoped board stylesheet loaded');
    const grid = index => boards.nth(index).locator('tbody tr').evaluateAll(rows => rows.map(row => Array.from(row.cells).slice(1).map(cell => cell.textContent)));
    const blocks = await grid(0);
    check(blocks[1].join() === 'Filled,Empty,Empty,Filled'
      && blocks.map(r => r[1]).join() === 'Filled,Empty,Filled,Filled'
      && blocks.some((r, i) => i !== 1 && r[2] === 'Empty'), 'Blockzzle diagram has the two row gaps and one matching column gap');
    const rings = await grid(1);
    check(rings[0].join() === 'Red S,A: empty,Red L' && rings[1][0] === 'B: red S + L'
      && rings[2][1] === 'Target: red L', 'Ringzzle diagram locates both placements and the distant slot');
    const candidates = await grid(2);
    check(candidates[1].join() === 'Possible,No,Possible,Possible'
      && [candidates[0], candidates[2]].every(row => row.slice(0, 3).every(cell => cell === 'No')), 'DaySudoku diagram matches the row and both box candidates');
    check(await page.locator('main [data-save-game], main .guide-play, main [data-retry-practice]').count() === 0, 'workshop is editorial, not a new game');
    const contents = page.locator('.guide-contents');
    await contents.locator('summary').click();
    for (const [i, [id, name, anchor, answer]] of examples.entries()) {
      const hint = page.locator('.move-hint').nth(i);
      const details = page.locator('.move-check').nth(i);
      const target = '/games/' + id + '/#move-check-1';
      const board = boards.nth(i);
      check(await board.locator('caption').textContent().then(text => text.startsWith(name)), name + ' board has its own accessible caption');
      check(await board.locator('thead th[scope="col"]').count() === (id === 'ringzzle' ? 4 : 5)
        && await board.locator('tbody th[scope="row"]').count() === (id === 'blockzzle' ? 4 : 3), name + ' board labels rows and columns');
      await contents.locator('a[href="#' + anchor + '"]').click();
      check(new URL(page.url()).hash === '#' + anchor && await page.locator('#' + anchor).isVisible(), name + ' contents link reaches unique exercise');
      check(await hint.locator('p').isHidden() && await details.locator('strong').isHidden(), name + ' hint and answer initially hidden');
      await hint.getByText(name + ' hint', { exact: true }).press('Enter');
      check(await hint.locator('p').isVisible() && await page.locator('.move-check[open]').count() === 0, name + ' hint does not spoil any answer');
      await hint.locator('summary').press('Space');
      await details.locator('summary').click();
      check(await details.locator('strong').isVisible() && await details.locator('strong').textContent() === answer, name + ' answer visible on request');
      check(await page.locator('.move-check[open]').count() === 1, name + ' other answers remain closed');
      const more = details.getByRole('link', { name: 'More ' + name + ' practice' });
      check(await more.getAttribute('href') === target, name + ' links to matching guide question');
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          check(await details.evaluate(el => {
            const r = el.querySelector('a').getBoundingClientRect();
            return r.width >= 44 && r.height >= 44 && r.left >= 0 && r.right <= innerWidth
              && document.documentElement.scrollWidth <= innerWidth;
          }), name + ' link and answer fit at ' + width + '/' + theme);
          check(await board.evaluate(el => {
            const r = el.getBoundingClientRect();
            return r.left >= 0 && r.right <= innerWidth && Array.from(el.querySelectorAll('th, td')).every(cell => cell.scrollWidth <= cell.clientWidth);
          }), name + ' board fits at ' + width + '/' + theme);
          layouts++;
        }
      }
      await details.locator('summary').click();
    }
    check(await page.evaluate(() => localStorage.getItem('likedGames') === '["blockzzle"]'
      && localStorage.getItem('recentGames') === '["ringzzle"]'
      && localStorage.getItem('hotgamesLastPractice') === '{"game":"daysudoku","question":2}'), 'workshop does not alter game history or guide bookmark');

    plain = await context.browser().newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
    const noJS = await plain.newPage();
    for (const [i, [id, name, anchor]] of examples.entries()) {
      await noJS.goto(root + '/games/practice/#' + anchor);
      check(await noJS.locator('.practice-board').nth(i).isVisible(), name + ' board is usable without scripts');
      const hint = noJS.locator('.move-hint').nth(i);
      const answer = noJS.locator('.move-check').nth(i);
      await hint.locator('summary').click();
      check(await hint.locator('p').isVisible() && await answer.locator('strong').isHidden(), name + ' native hint works without scripts');
      await answer.locator('summary').click();
      await answer.locator('a').click();
      await noJS.waitForURL(root + '/games/' + id + '/#move-check-1');
      check(await noJS.locator('#move-check-1').isVisible(), name + ' native next link reaches its guide without scripts');
    }
    await page.goto(root + '/');
    check(await page.locator('a[href="/games/practice/"]').count() === 0, 'homepage unchanged');
    check(errors.length === 0, 'no application runtime errors');
    return { engine: context.browser().browserType().name(), passed, layouts };
  } finally {
    if (plain) await plain.close();
    page.off('pageerror', onError);
    await context.unroute(pattern, suppress);
  }
}
