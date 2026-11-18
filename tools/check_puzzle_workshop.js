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
  const workshopPath = '/games/practice/';
  const shortcutLabel = 'Puzzle Workshop shortcuts';
  const variations = [
    ['blockzzle-after-clear', 'blockzzle-crossing-lines', 'Yes, the same gap is open again.'],
    ['ringzzle-blue-slot', 'ringzzle-distant-slot', 'No, the small slot is still occupied.'],
    ['daysudoku-different-rows', 'daysudoku-box-to-row', 'No, the two positions are in different rows.']
  ];
  const twoMove = 'blockzzle-plan-two-moves';
  const diagonal = 'ringzzle-diagonal-clear';
  const candidatePair = 'daysudoku-candidate-pair';
  const pairAnswerText = 'Row 4 must be 4.';
  let passed = 0;
  let layouts = 0;
  let plain;
  const errors = [];
  const onError = error => errors.push(error.message);
  const check = (ok, name) => { if (!ok) throw new Error(name); passed++; };
  const checkBoardLayout = async (board, targets, name) => {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        check(await board.evaluate(el => el.getBoundingClientRect().right <= innerWidth)
          && await targets.evaluateAll(els => els.length === 3 && els.every(el => {
            const r = el.getBoundingClientRect();
            return r.left >= 0 && r.right <= innerWidth && r.width >= 44 && r.height >= 44;
          }))
          && await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), name + ' board and controls fit at ' + width + '/' + theme);
        layouts++;
      }
    }
  };
  page.on('pageerror', onError);
  await context.route(pattern, suppress);
  try {
    await page.goto(root + '/games/');
    await page.evaluate(() => {
      localStorage.setItem('likedGames', '["blockzzle"]');
      localStorage.setItem('recentGames', '["ringzzle"]');
      localStorage.setItem('hotgamesLastPractice', '{"game":"daysudoku","question":2}');
    });
    const shortcuts = page.getByRole('navigation', { name: shortcutLabel });
    const entrance = shortcuts.getByRole('link', { name: 'Puzzle Workshop', exact: true });
    check(await entrance.count() === 1 && await entrance.getAttribute('href') === workshopPath, 'one crawlable directory entrance');
    check(await shortcuts.getByRole('link').count() === examples.length + 1, 'one direct entry per game alongside the Workshop index');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        check(await shortcuts.getByRole('link').evaluateAll(links => {
          const rects = links.map(link => link.getBoundingClientRect());
          return document.documentElement.scrollWidth <= innerWidth
            && new Set(rects.map(r => r.top)).size <= 2 && rects.every((r, i) =>
            r.height >= 44 && r.width >= 44 && r.left >= 0 && r.right <= innerWidth
            && rects.slice(i + 1).every(other => r.right <= other.left || r.bottom <= other.top));
        }), 'directory shortcuts wrap at ' + width + '/' + theme);
        layouts++;
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    for (const [, name, anchor] of examples) {
      const link = shortcuts.getByRole('link', { name: name + ' practice', exact: true });
      check(await link.getAttribute('href') === workshopPath + '#' + anchor, name + ' shortcut uses an exact native URL');
      await link.press('Enter');
      await page.waitForURL(root + workshopPath + '#' + anchor);
      check(await page.locator('#' + anchor).isVisible()
        && await page.locator('.move-check[open], .move-hint[open]').count() === 0, name + ' shortcut reaches its original exercise without spoilers');
      await page.goBack();
      await page.waitForURL(root + '/games/');
    }
    await entrance.press('Enter');
    await page.waitForURL(root + '/games/practice/');
    check(await page.getByRole('heading', { level: 1, name: 'Puzzle Workshop' }).count() === 1, 'workshop title');
    check(await page.locator('link[rel=canonical]').getAttribute('href') === 'https://hotgames.ai/games/practice/', 'canonical workshop URL');
    const twoMoveIndex = examples.length + variations.length;
    const diagonalIndex = twoMoveIndex + 1;
    const pairIndex = diagonalIndex + 1;
    check(await page.locator('.move-hint').count() === pairIndex + 1 && await page.locator('.move-check').count() === pairIndex + 1, 'original examples, variations and advanced exercises');
    const boards = page.locator('.practice-board');
    check(await boards.count() === 6, 'only the original and advanced exercises need boards');
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
      const [relatedAnchor] = variations[i];
      const related = details.getByRole('link', { name: 'Try the ' + name + ' variation' });
      check(await related.getAttribute('href') === '#' + relatedAnchor, name + ' answer links to its own variation');
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          check(await details.evaluate(el => {
            const bounds = Array.from(el.querySelectorAll('a')).map(link => link.getBoundingClientRect());
            const [first, second] = bounds;
            return bounds.length === 2
              && bounds.every(r => r.width >= 44 && r.height >= 44 && r.left >= 0 && r.right <= innerWidth)
              && (second.left >= first.right || second.top >= first.bottom)
              && document.documentElement.scrollWidth <= innerWidth;
          }), name + ' link and answer fit at ' + width + '/' + theme);
          check(await board.evaluate(el => {
            const r = el.getBoundingClientRect();
            return r.left >= 0 && r.right <= innerWidth && Array.from(el.querySelectorAll('th, td')).every(cell => cell.scrollWidth <= cell.clientWidth);
          }), name + ' board fits at ' + width + '/' + theme);
          layouts++;
        }
      }
      await related.press('Enter');
      check(new URL(page.url()).hash === '#' + relatedAnchor && await page.locator('#' + relatedAnchor).isVisible(), name + ' keyboard reaches matched variation');
      check(await page.locator('.move-check').nth(examples.length + i).locator('strong').isHidden(), name + ' variation answer stays hidden');
      await page.goBack();
      check(new URL(page.url()).hash === '#' + anchor, name + ' Back returns to the original question');
      await details.locator('summary').click();
    }
    await page.getByRole('link', { name: 'Try a variation', exact: true }).last().press('Enter');
    check(new URL(page.url()).hash === '#try-a-variation', 'repeat visitors have a direct variation jump');
    for (const [index, [anchor, boardAnchor, answer]] of variations.entries()) {
      const position = examples.length + index;
      const hint = page.locator('.move-hint').nth(position);
      const details = page.locator('.move-check').nth(position);
      const originalBoard = page.locator('.game-guide-content a[href="#' + boardAnchor + '"]');
      await contents.locator('a[href="#' + anchor + '"]').click();
      check(new URL(page.url()).hash === '#' + anchor, anchor + ' has a native heading link');
      await originalBoard.click();
      check(new URL(page.url()).hash === '#' + boardAnchor, anchor + ' links to the correct board');
      await contents.locator('a[href="#' + anchor + '"]').click();
      await hint.locator('summary').press('Enter');
      check(await hint.locator('p').isVisible() && await details.locator('strong').isHidden(), anchor + ' hint keeps answer closed');
      await details.locator('summary').press('Space');
      check(await details.locator('strong').isVisible() && await details.locator('strong').textContent() === answer, anchor + ' answer appears on demand');
      check(await page.locator('.move-check[open]').count() === 1, anchor + ' other answers remain closed');
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        check(await details.locator('summary').evaluate(el => {
          const r = el.getBoundingClientRect();
          return r.width >= 44 && r.height >= 44 && r.right <= innerWidth
            && document.documentElement.scrollWidth <= innerWidth;
        }), anchor + ' controls and text fit at ' + width + 'px');
        layouts++;
      }
      await details.locator('summary').press('Space');
      await hint.locator('summary').press('Space');
    }
    const twoMoveLink = page.getByRole('link', { name: 'plan two Blockzzle moves' });
    check(await twoMoveLink.getAttribute('href') === '#' + twoMove, 'repeat visitors can jump to the two-move exercise');
    await twoMoveLink.press('Enter');
    check(new URL(page.url()).hash === '#' + twoMove && await page.locator('#' + twoMove).isVisible(), 'keyboard reaches the two-move exercise');
    const newBoard = boards.nth(3);
    check(await newBoard.locator('caption').textContent() === 'Blockzzle board before the first move', 'two-move board has a caption');
    const start = (await grid(3)).map(row => row.map(cell => cell === 'Filled'));
    const gaps = board => board.flatMap((row, r) => row.flatMap((cell, c) =>
      r < 3 && c < 3 && !cell && !row[c + 1] && !board[r + 1][c] && !board[r + 1][c + 1]
        ? ['ABCD'[c] + (r + 1)] : []));
    const place = col => {
      const board = start.map(row => row.slice());
      check(!board[0][col] && !board[0][col + 1], 'two-square move is legal at column ' + col);
      board[0][col] = board[0][col + 1] = true;
      const rows = board.map(row => row.every(Boolean));
      const columns = board[0].map((_, c) => board.every(row => row[c]));
      return { rows, columns, after: board.map((row, r) => row.map((cell, c) => cell && !rows[r] && !columns[c])) };
    };
    check(gaps(start).join() === 'A1', 'only A1 through B2 can take the starting square');
    const moveA = place(0);
    const moveB = place(1);
    check(!moveA.rows.some(Boolean) && !moveA.columns.some(Boolean) && gaps(moveA.after).length === 0, 'move A clears nothing and leaves no square');
    check(!moveB.rows.some(Boolean) && moveB.columns.join() === 'false,false,true,false' && gaps(moveB.after).join() === 'B2', 'move B clears only C and makes the new B2 through C3 gap');
    const newHint = page.locator('.move-hint').nth(twoMoveIndex);
    const newAnswer = page.locator('.move-check').nth(twoMoveIndex);
    check(await newHint.locator('p').isHidden() && await newAnswer.locator('strong').isHidden(), 'two-move problem starts without spoilers');
    await newHint.locator('summary').press('Enter');
    check(await newHint.locator('p').isVisible() && await newAnswer.locator('strong').isHidden(), 'two-move hint does not reveal the answer');
    await newAnswer.locator('summary').press('Enter');
    check(await newAnswer.locator('strong').textContent() === 'Move B.' && await newAnswer.locator('strong').isVisible(), 'two-move answer matches the board');
    const morePlacement = newAnswer.locator('[data-next-practice]');
    check(await morePlacement.getAttribute('href') === '/games/blockzzle/#move-check-2', 'answer leads to related Blockzzle practice');
    await checkBoardLayout(newBoard, newHint.locator('summary').or(newAnswer.locator('summary')).or(morePlacement), 'two-move');
    await newAnswer.locator('summary').press('Space');
    await newHint.locator('summary').press('Space');

    const diagonalLink = page.getByRole('link', { name: 'find a Ringzzle diagonal' });
    check(await diagonalLink.getAttribute('href') === '#' + diagonal, 'repeat visitors can jump to the diagonal exercise');
    await diagonalLink.press('Enter');
    check(new URL(page.url()).hash === '#' + diagonal && await page.locator('#' + diagonal).isVisible(), 'keyboard reaches the diagonal exercise');
    const diagonalBoard = boards.nth(4);
    check(await diagonalBoard.locator('caption').textContent() === 'Ringzzle before the blue move: S = small, L = large', 'diagonal board explains the size labels');
    const ringGrid = await grid(4);
    check(ringGrid[0][0] === 'Blue S + Red L' && ringGrid[1][2] === 'Empty' && ringGrid[2][2] === 'Empty', 'target rings and both allowed placements match the prompt');
    const indices = [0, 1, 2];
    const lineCells = [
      ...indices.map(r => indices.map(c => [r, c])),
      ...indices.map(c => indices.map(r => [r, c])),
      indices.map(i => [i, i]),
      indices.map(i => [i, 2 - i])
    ];
    const clearedByBlue = row => lineCells.filter(line =>
      line.every(([r, c]) => (r === row && c === 2) || ringGrid[r][c].includes('Blue')));
    const rowTwo = clearedByBlue(1);
    const diagonalClear = clearedByBlue(2);
    check(rowTwo.length === 1 && rowTwo[0].every(([r]) => r === 1), 'C2 clears only row 2, leaving A1 untouched');
    check(diagonalClear.length === 1 && diagonalClear[0].every(([r, c]) => r === c), 'C3 clears only the diagonal through A1');
    const lineHint = page.locator('.move-hint').nth(diagonalIndex);
    const lineAnswer = page.locator('.move-check').nth(diagonalIndex);
    check(await lineHint.locator('p').isHidden() && await lineAnswer.locator('strong').isHidden(), 'diagonal hint and answer start closed');
    await lineHint.locator('summary').press('Enter');
    check(await lineHint.locator('p').isVisible() && await lineAnswer.locator('strong').isHidden(), 'diagonal hint keeps answer closed');
    await lineAnswer.locator('summary').press('Enter');
    check(await lineAnswer.locator('strong').isVisible()
      && await lineAnswer.locator('strong').textContent() === 'Place the medium blue ring at C3.'
      && (await lineAnswer.textContent()).includes('the large red ring stays'), 'diagonal answer matches the board and leaves the red ring');
    const moreLinePractice = lineAnswer.locator('[data-next-practice]');
    check(await moreLinePractice.getAttribute('href') === '/games/ringzzle/#move-check-2', 'answer leads to related Ringzzle practice');
    await checkBoardLayout(diagonalBoard, lineHint.locator('summary').or(lineAnswer.locator('summary')).or(moreLinePractice), 'diagonal');
    await lineAnswer.locator('summary').press('Space');
    await lineHint.locator('summary').press('Space');

    const pairLink = page.getByRole('link', { name: 'use a DaySudoku pair' });
    check(await pairLink.getAttribute('href') === '#' + candidatePair, 'repeat visitors can jump to the candidate pair');
    await pairLink.press('Enter');
    check(new URL(page.url()).hash === '#' + candidatePair && await page.locator('#' + candidatePair).isVisible(), 'keyboard reaches the candidate pair');
    const pairBoard = boards.nth(5);
    check(await pairBoard.locator('caption').textContent() === 'Column 5 candidates'
      && (await pairBoard.locator('tbody th[scope="row"]').allTextContents()).join() === '1,2,4,7,9', 'pair table identifies the column and empty rows');
    const choices = (await grid(5)).map(([cell]) => cell.split(', ').map(Number));
    const digits = [2, 4, 6, 8, 9];
    check(choices.every(row => row.length >= 2 && row.every(digit => digits.includes(digit)))
      && digits.every(digit => choices.filter(row => row.includes(digit)).length >= 2), 'no naked or hidden single precedes the pair deduction');
    const arrangements = choices.reduce((valid, row) => valid.flatMap(used =>
      row.filter(digit => !used.includes(digit)).map(digit => [...used, digit])), [[]]);
    const possibilities = choices.map((_, i) => [...new Set(arrangements.map(arrangement => arrangement[i]))].sort().join());
    check(arrangements.length === 4 && possibilities.join('|') === '2,6|2,6|4|8,9|8,9', 'only row 4 is fixed across all column assignments');
    const pairHint = page.locator('.move-hint').nth(pairIndex);
    const pairAnswer = page.locator('.move-check').nth(pairIndex);
    check(await pairHint.locator('p').isHidden() && await pairAnswer.locator('strong').isHidden(), 'pair hint and answer start closed');
    await pairHint.locator('summary').press('Enter');
    check(await pairHint.locator('p').isVisible() && await pairAnswer.locator('strong').isHidden(), 'pair hint keeps answer closed');
    await pairAnswer.locator('summary').press('Enter');
    check(await pairAnswer.locator('strong').isVisible() && await pairAnswer.locator('strong').textContent() === pairAnswerText, 'pair answer matches the column deduction');
    const moreDeduction = pairAnswer.locator('[data-next-practice]');
    check(await moreDeduction.getAttribute('href') === '/games/daysudoku/#move-check-2', 'answer leads to related DaySudoku practice');
    await checkBoardLayout(pairBoard, pairHint.locator('summary').or(pairAnswer.locator('summary')).or(moreDeduction), 'candidate pair');
    await pairAnswer.locator('summary').press('Space');
    await pairHint.locator('summary').press('Space');
    const shareAnchors = [...examples.map(([, , anchor]) => anchor), ...variations.map(([anchor]) => anchor), twoMove, diagonal, candidatePair];
    check(await page.locator('[data-copy-tip]').count() === shareAnchors.length, 'only exercise headings get share controls');
    await page.setViewportSize({ width: 320, height: 844 });
    await page.evaluate(() => {
      history.replaceState(history.state, '', '?q=private&view=saved#try-a-variation');
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: async text => { window.workshopCopiedLink = text; } }
      });
    });
    const beforeCopy = page.url();
    for (const anchor of shareAnchors) {
      const button = page.locator('[data-copy-tip="' + anchor + '"]');
      const status = page.locator('#tip-status-' + anchor);
      await button.press('Enter');
      await status.waitFor({ state: 'visible' });
      check(await page.evaluate(() => window.workshopCopiedLink) === 'https://hotgames.ai/games/practice/#' + anchor, anchor + ' copied URL is public, exact and free of query data');
      check(await status.textContent() === 'Practice link copied.', anchor + ' copy feedback');
      check(await button.evaluate(el => {
        const r = el.getBoundingClientRect();
        const label = el.parentElement.querySelector('span').getBoundingClientRect();
        return r.width >= 44 && r.height >= 44 && r.left >= 0 && r.right <= innerWidth
          && r.left >= label.right && r.bottom > label.top && r.top < label.bottom
          && document.documentElement.scrollWidth <= innerWidth;
      }), anchor + ' separate share target fits at 320px');
    }
    check(page.url() === beforeCopy && await page.locator('.move-hint[open], .move-check[open]').count() === 0, 'copying does not navigate or reveal solutions');
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => { throw new DOMException('Denied', 'NotAllowedError'); } }
    }));
    await page.locator('[data-copy-tip="' + shareAnchors[0] + '"]').click();
    const fallback = page.locator('#tip-status-' + shareAnchors[0]).getByRole('link', { name: 'Open practice link' });
    await fallback.waitFor({ state: 'visible' });
    check(await fallback.getAttribute('href') === 'https://hotgames.ai/games/practice/#' + shareAnchors[0], 'clipboard denial exposes the exact native link');

    check(await page.evaluate(() => localStorage.getItem('likedGames') === '["blockzzle"]'
      && localStorage.getItem('recentGames') === '["ringzzle"]'
      && localStorage.getItem('hotgamesLastPractice') === '{"game":"daysudoku","question":2}'), 'workshop does not alter game history or guide bookmark');

    plain = await context.browser().newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
    const noJS = await plain.newPage();
    for (const [i, [id, name, anchor]] of examples.entries()) {
      await noJS.goto(root + '/games/');
      await noJS.getByRole('navigation', { name: shortcutLabel }).getByRole('link', { name: name + ' practice', exact: true }).click();
      await noJS.waitForURL(root + workshopPath + '#' + anchor);
      check(await noJS.locator('#' + anchor).isVisible() && await noJS.locator('.practice-board').nth(i).isVisible(), name + ' directory entry and board are usable without scripts');
      const hint = noJS.locator('.move-hint').nth(i);
      const answer = noJS.locator('.move-check').nth(i);
      await hint.locator('summary').click();
      check(await hint.locator('p').isVisible() && await answer.locator('strong').isHidden(), name + ' native hint works without scripts');
      await answer.locator('summary').click();
      const [relatedAnchor] = variations[i];
      await answer.locator('[data-workshop-variation]').click();
      check(new URL(noJS.url()).hash === '#' + relatedAnchor && await noJS.locator('#' + relatedAnchor).isVisible(), name + ' native variation jump works without scripts');
      await noJS.locator('.game-guide-content a[href="#' + anchor + '"]').click();
      check(new URL(noJS.url()).hash === '#' + anchor, name + ' native return link reaches the original board');
      await answer.locator('[data-next-practice]').click();
      await noJS.waitForURL(root + '/games/' + id + '/#move-check-1');
      check(await noJS.locator('#move-check-1').isVisible(), name + ' native next link reaches its guide without scripts');
      const returnToBoard = noJS.getByRole('link', { name: /^Puzzle Workshop:/ });
      check(await returnToBoard.count() === 1
        && await returnToBoard.getAttribute('href') === '/games/practice/#' + anchor, name + ' guide links directly to its own board');
      await returnToBoard.press('Enter');
      await noJS.waitForURL(root + '/games/practice/#' + anchor);
      check(await noJS.locator('#' + anchor).isVisible() && await noJS.locator('.practice-board').nth(i).isVisible(), name + ' native return reaches matching exercise');
      check(await noJS.locator('.move-hint[open], .move-check[open]').count() === 0, name + ' return does not reveal any hint or answer');
    }
    for (const [index, [anchor, , text]] of variations.entries()) {
      await noJS.goto(root + '/games/practice/#' + anchor);
      check(await noJS.locator('#' + anchor).isVisible() && await noJS.locator('[data-copy-tip]').count() === 0, anchor + ' bookmark works without JavaScript controls');
      const answer = noJS.locator('.move-check').nth(examples.length + index);
      check(await answer.locator('strong').isHidden(), anchor + ' no-JS answer starts closed');
      await answer.locator('summary').click();
      check(await answer.locator('strong').isVisible() && await answer.locator('strong').textContent() === text, anchor + ' answer works without scripts');
      await answer.locator('summary').click();
    }
    await noJS.goto(root + '/games/practice/');
    await noJS.getByRole('link', { name: 'plan two Blockzzle moves' }).click();
    check(new URL(noJS.url()).hash === '#' + twoMove && await noJS.locator('.practice-board').nth(3).isVisible(), 'native link and two-move board work without scripts');
    const plainAnswer = noJS.locator('.move-check').nth(twoMoveIndex);
    check(await plainAnswer.locator('strong').isHidden(), 'two-move answer stays hidden without scripts');
    await plainAnswer.locator('summary').click();
    check(await plainAnswer.locator('strong').isVisible() && await plainAnswer.locator('strong').textContent() === 'Move B.', 'two-move answer works without scripts');
    await plainAnswer.locator('[data-next-practice]').click();
    await noJS.waitForURL(root + '/games/blockzzle/#move-check-2');
    check(await noJS.locator('#move-check-2').isVisible(), 'native guide link reaches the exact exercise');
    await noJS.goto(root + '/games/practice/#' + diagonal);
    check(await noJS.locator('#' + diagonal).isVisible() && await noJS.locator('.practice-board').nth(4).isVisible(), 'diagonal bookmark and board work without scripts');
    const plainLineAnswer = noJS.locator('.move-check').nth(diagonalIndex);
    check(await plainLineAnswer.locator('strong').isHidden(), 'diagonal answer stays hidden without scripts');
    await plainLineAnswer.locator('summary').click();
    check(await plainLineAnswer.locator('strong').isVisible() && await plainLineAnswer.locator('strong').textContent() === 'Place the medium blue ring at C3.', 'diagonal answer works without scripts');
    await plainLineAnswer.locator('[data-next-practice]').click();
    await noJS.waitForURL(root + '/games/ringzzle/#move-check-2');
    check(await noJS.locator('#move-check-2').isVisible(), 'native guide link reaches the Ringzzle line exercise');
    await noJS.goto(root + '/games/practice/#' + candidatePair);
    check(await noJS.locator('#' + candidatePair).isVisible() && await noJS.locator('.practice-board').nth(5).isVisible(), 'pair bookmark and table work without scripts');
    const plainPairAnswer = noJS.locator('.move-check').nth(pairIndex);
    check(await plainPairAnswer.locator('strong').isHidden(), 'pair answer stays hidden without scripts');
    await plainPairAnswer.locator('summary').click();
    check(await plainPairAnswer.locator('strong').isVisible() && await plainPairAnswer.locator('strong').textContent() === pairAnswerText, 'pair answer works without scripts');
    await plainPairAnswer.locator('[data-next-practice]').click();
    await noJS.waitForURL(root + '/games/daysudoku/#move-check-2');
    check(await noJS.locator('#move-check-2').isVisible(), 'native guide link reaches the DaySudoku deduction');
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
