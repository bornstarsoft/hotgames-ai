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
  const compareClears = 'blockzzle-compare-clears';
  const compareAnswerText = 'Place the block at A1.';
  const trayPuzzle = 'ringzzle-open-medium-slot';
  const trayAnswerText = 'Place the blue ring at C2, then the yellow ring at B2.';
  const advanced = [twoMove, diagonal, candidatePair];
  const shareAnchors = [...examples.map(([, , anchor]) => anchor), ...variations.map(([anchor]) => anchor), ...advanced, compareClears, trayPuzzle];
  const playURLs = ['https://blockzzle.com/play/', 'https://ringzzle.com/play/', 'https://daysudoku.com/'];
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
    const compareIndex = pairIndex + 1;
    const trayIndex = compareIndex + 1;
    check(await page.locator('.move-hint').count() === shareAnchors.length
      && await page.locator('.move-check').count() === shareAnchors.length, 'original examples, variations and advanced exercises');
    const boards = page.locator('.practice-board');
    check(await boards.count() === 8, 'only the original and advanced exercises need boards');
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
    check(await page.locator('main [data-save-game], main [data-retry-practice]').count() === 0, 'workshop is editorial, not a new game');
    check(await page.locator('main .guide-play').count() === 3
      && await page.locator('main .guide-play:visible').count() === 0, 'three Play links are hidden until their advanced answers open');
    const contents = page.locator('.guide-contents');
    const index = contents.getByRole('navigation', { name: 'Workshop exercises' });
    check(await index.isHidden() && await contents.locator('summary').textContent() === 'Browse exercises', 'compact exercise index starts closed');
    await contents.locator('summary').press('Enter');
    check(await index.isVisible() && await index.getByRole('group').count() === 3, 'keyboard opens three named exercise groups');
    for (const [i, [, name, anchor]] of examples.entries()) {
      const group = index.getByRole('group', { name, exact: true });
      const hrefs = await group.getByRole('link').evaluateAll(links => links.map(link => link.getAttribute('href')));
      const expected = [anchor, variations[i][0], advanced[i]];
      if (i === 0) expected.push(compareClears);
      if (i === 1) expected.push(trayPuzzle);
      check(hrefs.join() === expected.map(id => '#' + id).join(), name + ' index orders the basic problem, variation and follow-ups');
    }
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        check(await index.evaluate((el, count) => {
          const bounds = items => Array.from(items, item => item.getBoundingClientRect());
          const groups = bounds(el.children);
          const links = bounds(el.querySelectorAll('a'));
          const fits = r => r.left >= 0 && r.right <= innerWidth && r.width >= 44 && r.height >= 44;
          return links.length === count && links.every(fits) && groups.every((r, i) =>
            i === 0 || (innerWidth <= 680 ? r.top >= groups[i - 1].bottom : r.left >= groups[i - 1].right))
            && document.documentElement.scrollWidth <= innerWidth;
        }, shareAnchors.length), 'topic index fits at ' + width + '/' + theme);
        layouts++;
      }
    }
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
    check(await page.locator('#try-a-variation').count() === 1, 'existing variation-section bookmarks survive');
    for (const [index, [anchor, boardAnchor, answer]] of variations.entries()) {
      const position = examples.length + index;
      const hint = page.locator('.move-hint').nth(position);
      const details = page.locator('.move-check').nth(position);
      const next = details.locator('[data-next-practice]');
      const nextId = advanced[index];
      const nextPosition = examples.length + variations.length + index;
      const originalBoard = page.locator('.game-guide-content a[href="#' + boardAnchor + '"]');
      await contents.locator('a[href="#' + anchor + '"]').click();
      check(new URL(page.url()).hash === '#' + anchor, anchor + ' has a native heading link');
      await originalBoard.click();
      check(new URL(page.url()).hash === '#' + boardAnchor, anchor + ' links to the correct board');
      await contents.locator('a[href="#' + anchor + '"]').click();
      await hint.locator('summary').press('Enter');
      check(await hint.locator('p').isVisible() && await details.locator('strong').isHidden()
        && await next.isHidden(), anchor + ' hint keeps answer and next link closed');
      await details.locator('summary').press('Space');
      check(await details.locator('strong').isVisible() && await details.locator('strong').textContent() === answer, anchor + ' answer appears on demand');
      check(await page.locator('.move-check[open]').count() === 1, anchor + ' other answers remain closed');
      check(await next.getAttribute('href') === '#' + nextId
        && await next.textContent().then(text => text.trim().startsWith('Next: '))
        && await next.evaluate(el => el.parentElement.classList.contains('guide-jumps')), anchor + ' offers a separate link to its matching advanced exercise');
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        check(await details.locator('summary').or(next).evaluateAll(els => {
          const [summary, link] = els.map(el => el.getBoundingClientRect());
          return [summary, link].every(r => r.width >= 44 && r.height >= 44 && r.left >= 0 && r.right <= innerWidth)
            && link.top >= summary.bottom
            && document.documentElement.scrollWidth <= innerWidth;
        }), anchor + ' controls and next link fit at ' + width + 'px');
        layouts++;
      }
      const resumeHref = await page.locator('#workshopResumeLink').getAttribute('href');
      await next.press('Enter');
      await page.waitForURL(root + workshopPath + '#' + nextId);
      check(await page.locator('#' + nextId).isVisible()
        && await page.locator('.move-check').nth(nextPosition).locator('strong').isHidden()
        && await page.locator('.move-hint').nth(nextPosition).locator('p').isHidden(), anchor + ' next link reaches the follow-up without spoilers');
      check(resumeHref === '#' + anchor && await page.locator('#workshopResumeLink').getAttribute('href') === resumeHref, 'following the link does not replace the last opened exercise');
      await page.goBack();
      check(new URL(page.url()).hash === '#' + anchor && await details.locator('strong').isVisible(), anchor + ' Back returns to the variation answer');
      await details.locator('summary').press('Space');
      await hint.locator('summary').press('Space');
    }
    const twoMoveLink = index.getByRole('link', { name: 'Plan two moves' });
    check(await twoMoveLink.getAttribute('href') === '#' + twoMove, 'repeat visitors can jump to the two-move exercise');
    await twoMoveLink.press('Enter');
    check(new URL(page.url()).hash === '#' + twoMove && await page.locator('#' + twoMove).isVisible(), 'keyboard reaches the two-move exercise');
    const newBoard = boards.nth(3);
    check(await newBoard.locator('caption').textContent() === 'Blockzzle board before the first move', 'two-move board has a caption');
    const start = (await grid(3)).map(row => row.map(cell => cell === 'Filled'));
    const gaps = board => board.flatMap((row, r) => row.flatMap((cell, c) =>
      r < 3 && c < 3 && !cell && !row[c + 1] && !board[r + 1][c] && !board[r + 1][c + 1]
        ? ['ABCD'[c] + (r + 1)] : []));
    const place = (cells, rowIndex, cols) => {
      const board = cells.map(row => row.slice());
      check(cols.every(c => !board[rowIndex][c]), 'placement uses empty cells at row ' + rowIndex + ', columns ' + cols);
      cols.forEach(c => { board[rowIndex][c] = true; });
      const rows = board.map(row => row.every(Boolean));
      const columns = board[0].map((_, c) => board.every(row => row[c]));
      return { rows, columns, after: board.map((row, r) => row.map((cell, c) => cell && !rows[r] && !columns[c])) };
    };
    check(gaps(start).join() === 'A1', 'only A1 through B2 can take the starting square');
    const moveA = place(start, 0, [0, 1]);
    const moveB = place(start, 0, [1, 2]);
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

    const diagonalLink = index.getByRole('link', { name: 'Clear the right line' });
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
    const clearedByBlue = (cells, row, col) => lineCells.filter(line =>
      line.every(([r, c]) => (r === row && c === col) || cells[r][c].includes('Blue')));
    const rowTwo = clearedByBlue(ringGrid, 1, 2);
    const diagonalClear = clearedByBlue(ringGrid, 2, 2);
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

    const pairLink = index.getByRole('link', { name: 'Use a candidate pair' });
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

    const compareLink = index.getByRole('group', { name: 'Blockzzle' }).getByRole('link', { name: 'Compare two clears' });
    await compareLink.press('Enter');
    check(new URL(page.url()).hash === '#' + compareClears && await page.locator('#' + compareClears).isVisible(), 'keyboard opens the new Blockzzle comparison');
    const compareBoard = boards.nth(6);
    check(await compareBoard.locator('caption').textContent() === 'Blockzzle board before either line clear', 'comparison board has a descriptive caption');
    const before = (await grid(6)).map(row => row.map(cell => cell === 'Filled'));
    check(gaps(before).length === 0, 'square does not fit on the original board');
    const clearRow = place(before, 0, [0]);
    const clearColumn = place(before, 3, [3]);
    check(clearRow.rows.join() === 'true,false,false,false' && !clearRow.columns.some(Boolean)
      && gaps(clearRow.after).join() === 'B1', 'A1 clears row 1 only and opens exactly one square gap at B1');
    check(clearColumn.columns.join() === 'false,false,false,true' && !clearColumn.rows.some(Boolean)
      && gaps(clearColumn.after).length === 0, 'D4 clears column D only and opens no square gap');
    const emptyCount = cells => cells.flat().filter(cell => !cell).length;
    check(emptyCount(clearRow.after) === emptyCount(clearColumn.after), 'both clears leave the same number of empty cells');
    const compareHint = page.locator('.move-hint').nth(compareIndex);
    const compareAnswer = page.locator('.move-check').nth(compareIndex);
    check(await compareHint.locator('p').isHidden() && await compareAnswer.locator('strong').isHidden(), 'comparison hint and answer start closed');
    await compareHint.locator('summary').press('Enter');
    check(await compareHint.locator('p').isVisible() && await compareAnswer.locator('strong').isHidden(), 'comparison hint keeps answer closed');
    await compareAnswer.locator('summary').press('Enter');
    check(await compareAnswer.locator('strong').isVisible() && await compareAnswer.locator('strong').textContent() === compareAnswerText, 'comparison answer agrees with the simulated result');
    const relatedShapePractice = compareAnswer.locator('[data-next-practice]');
    check(await relatedShapePractice.getAttribute('href') === '/games/blockzzle/#move-check-2', 'comparison leads to related shape practice');
    await checkBoardLayout(compareBoard, compareHint.locator('summary').or(compareAnswer.locator('summary')).or(relatedShapePractice), 'clear comparison');
    await compareAnswer.locator('summary').press('Space');
    await compareHint.locator('summary').press('Space');

    const trayLink = index.getByRole('group', { name: 'Ringzzle' }).getByRole('link', { name: 'Make room for the next ring' });
    await trayLink.press('Enter');
    check(new URL(page.url()).hash === '#' + trayPuzzle && await page.locator('#' + trayPuzzle).isVisible(), 'keyboard opens the new Ringzzle tray problem');
    const trayBoard = boards.nth(7);
    check(await trayBoard.locator('caption').textContent() === 'Ringzzle tray setup: M = medium, L = large', 'tray board labels size abbreviations');
    const trayGrid = await grid(7);
    const slots = (row, col) => trayGrid[row][col].split(' + ');
    check(indices.every(r => indices.every(c => slots(r, c).some(ring => ring.endsWith(' M')))), 'the yellow medium ring cannot fit anywhere initially');
    const newMediumSlots = (row, col) => {
      check(!slots(row, col).some(ring => ring.endsWith(' S')), 'small blue ring fits at row ' + row + ', column ' + col);
      const lines = clearedByBlue(trayGrid, row, col);
      return {
        lines,
        freed: indices.flatMap(r => indices.flatMap(c => slots(r, c).includes('Blue M')
          && lines.some(line => line.some(([lineRow, lineCol]) => lineRow === r && lineCol === c))
          ? ['ABC'[c] + (r + 1)] : []))
      };
    };
    const clearA = newMediumSlots(2, 0);
    const clearTwo = newMediumSlots(1, 2);
    check(clearA.lines.length === 1 && clearA.lines[0].every(([, c]) => c === 0) && clearA.freed.length === 0, 'A3 clears only column A and leaves medium slots full');
    check(clearTwo.lines.length === 1 && clearTwo.lines[0].every(([r]) => r === 1) && clearTwo.freed.join() === 'B2', 'C2 clears only row 2 and frees exactly the B2 medium slot');
    const trayHint = page.locator('.move-hint').nth(trayIndex);
    const trayAnswer = page.locator('.move-check').nth(trayIndex);
    check(await trayHint.locator('p').isHidden() && await trayAnswer.locator('strong').isHidden(), 'tray question starts without spoilers');
    await trayHint.locator('summary').press('Enter');
    check(await trayHint.locator('p').isVisible() && await trayAnswer.locator('strong').isHidden(), 'tray hint keeps answer closed');
    await trayAnswer.locator('summary').press('Enter');
    check(await trayAnswer.locator('strong').isVisible() && await trayAnswer.locator('strong').textContent() === trayAnswerText, 'tray answer agrees with the board');
    const moreTrayPractice = trayAnswer.locator('[data-next-practice]');
    check(await moreTrayPractice.getAttribute('href') === '/games/ringzzle/#move-check-2', 'tray answer leads to related Ringzzle practice');
    await checkBoardLayout(trayBoard, trayHint.locator('summary').or(trayAnswer.locator('summary')).or(moreTrayPractice), 'tray choices');
    await trayAnswer.locator('summary').press('Space');
    await trayHint.locator('summary').press('Space');

    check(await page.locator('[data-workshop-retry]').count() === shareAnchors.length, 'each exercise has one retry control');
    const otherHint = page.locator('.move-hint').last();
    const otherAnswer = page.locator('.move-check').last();
    await otherHint.locator('summary').press('Enter');
    await otherAnswer.locator('summary').press('Enter');
    for (const [i, id] of shareAnchors.entries()) {
      const heading = page.locator('#' + id);
      const headingText = await heading.textContent();
      const hint = page.locator('.move-hint').nth(i);
      const answer = page.locator('.move-check').nth(i);
      const retry = answer.locator('[data-workshop-retry]');
      check(await retry.isHidden(), id + ' retry starts inside the closed answer');
      await hint.locator('summary').press('Enter');
      await answer.locator('summary').press('Enter');
      check(await retry.isVisible() && await retry.getAttribute('aria-label') === 'Retry ' + headingText
        && await hint.locator('p').isVisible(), id + ' retry identifies the exercise and is available after reveal');
      for (const [width, theme] of [[320, 'light'], [1440, 'dark']]) {
        await page.setViewportSize({ width, height: 844 });
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        check(await answer.locator('.guide-jumps').evaluate(el => {
          const bounds = Array.from(el.children, node => node.getBoundingClientRect());
          return bounds.every((r, i) => r.width >= 44 && r.height >= 44 && r.left >= 0 && r.right <= innerWidth
            && bounds.slice(i + 1).every(other => other.left >= r.right || other.top >= r.bottom))
            && document.documentElement.scrollWidth <= innerWidth;
        }), id + ' retry and links fit at ' + width + '/' + theme);
        layouts++;
      }
      const beforeRetry = [page.url(), await page.evaluate(() => history.length)];
      const visit = await page.locator('#workshopResumeLink').getAttribute('href');
      await retry.press('Enter');
      check(await hint.locator('p').isHidden() && await answer.locator('strong').isHidden() && await retry.isHidden(), id + ' retry closes its own disclosures');
      check(await heading.evaluate(el => el === document.activeElement && el.getBoundingClientRect().top >= 0
        && el.getBoundingClientRect().bottom <= innerHeight), id + ' retry focuses and scrolls to the question');
      check(visit === '#' + id && await page.locator('#workshopResumeLink').getAttribute('href') === visit
        && page.url() === beforeRetry[0] && await page.evaluate(() => history.length) === beforeRetry[1], id + ' retry preserves the bookmark and browser history');
      if (i === 0) {
        check(await otherHint.locator('p').isVisible() && await otherAnswer.locator('strong').isVisible(), 'retry does not close another exercise');
        await otherHint.locator('summary').press('Enter');
        await otherAnswer.locator('summary').press('Enter');
      }
    }
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

    let recent = ['ringzzle'];
    for (const [i, [id, name]] of examples.entries()) {
      const answer = page.locator('.move-check').nth(examples.length + variations.length + i);
      const play = answer.locator('.guide-play');
      const url = playURLs[i];
      check(await play.isHidden() && await play.getAttribute('href') === url && await play.getAttribute('target') === '_blank'
        && (await play.getAttribute('rel')).split(' ').includes('noopener'), name + ' exact Play target is safe and stays inside its closed answer');
      await answer.locator('summary').press('Enter');
      check(await answer.getByRole('link', { name: 'Play ' + name, exact: true }).isVisible(), name + ' Play appears after reveal');
      const fixture = route => route.fulfill({ body: '<title>QA destination</title>', contentType: 'text/html' });
      await context.route(url, fixture);
      const beforePlay = page.url();
      try {
        const [popup] = await Promise.all([page.waitForEvent('popup'), play.press('Enter')]);
        try {
          await popup.waitForLoadState('domcontentloaded');
          check(popup.url() === url && await popup.evaluate(() => window.opener === null), name + ' Play opens the correct game in a separate tab');
        } finally {
          await popup.close();
        }
      } finally {
        await context.unroute(url, fixture);
      }
      recent = [id, ...recent.filter(game => game !== id)];
      check(await page.evaluate(() => localStorage.getItem('recentGames')) === JSON.stringify(recent)
        && await page.locator('#workshopResumeLink').getAttribute('href') === '#' + advanced[i]
        && page.url() === beforePlay, name + ' play uses existing recent history and preserves the workshop tab');
      await answer.locator('summary').press('Enter');
    }
    check(await page.evaluate(() => localStorage.getItem('likedGames') === '["blockzzle"]'
      && localStorage.getItem('hotgamesLastPractice') === '{"game":"daysudoku","question":2}'), 'launching does not alter saved games or guide progress');

    const nextSteps = page.getByRole('navigation', { name: 'Workshop next steps' });
    const chooseAgain = nextSteps.getByRole('link', { name: 'Choose another exercise' });
    check(await chooseAgain.getAttribute('href') === '#workshop-exercises'
      && await nextSteps.getByRole('link', { name: 'Browse puzzle games' }).getAttribute('href') === '/games/#puzzles',
      'Workshop end presents only native continuation paths');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        check(await nextSteps.getByRole('link').evaluateAll(links => {
          const [first, second] = links.map(link => link.getBoundingClientRect());
          return links.length === 2
            && [first, second].every(r => r.height >= 44 && r.width >= 44 && r.left >= 0 && r.right <= innerWidth)
            && (second.left >= first.right || second.top >= first.bottom)
            && document.documentElement.scrollWidth <= innerWidth;
        }), 'end links fit at ' + width + '/' + theme);
        layouts++;
      }
    }
    await contents.locator('summary').press('Enter');
    check(await index.isHidden(), 'index is closed before returning from the end');
    const savedExercise = await page.locator('#workshopResumeLink').getAttribute('href');
    await chooseAgain.press('Enter');
    await page.waitForURL(url => url.hash === '#workshop-exercises');
    check(await index.isVisible() && await index.evaluate(el => el === document.activeElement
      && el.getBoundingClientRect().top >= 0 && el.getBoundingClientRect().top < innerHeight)
      && await contents.locator('summary').evaluate(el => el.getBoundingClientRect().top >= 0),
      'return link opens the index, scrolls it into view and moves keyboard focus');
    await index.getByRole('link', { name: 'Free a distant slot' }).press('Enter');
    await page.waitForURL(url => url.hash === '#ringzzle-distant-slot');
    check(await page.locator('#ringzzle-distant-slot').isVisible()
      && await page.locator('.move-check[open], .move-hint[open]').count() === 0
      && await page.locator('#workshopResumeLink').getAttribute('href') === savedExercise,
      'choosing a different game does not reveal answers or overwrite the bookmark');
    await page.goBack();
    await page.waitForURL(url => url.hash === '#workshop-exercises');
    check(await index.isVisible(), 'browser Back returns to the open exercise list');

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
      check(await answer.locator('[data-workshop-retry]').isHidden(), name + ' native answer does not show a nonfunctional retry');
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
      await answer.locator('[data-next-practice]').click();
      const nextId = advanced[index];
      await noJS.waitForURL(root + workshopPath + '#' + nextId);
      check(await noJS.locator('#' + nextId).isVisible()
        && await noJS.locator('.move-check').nth(examples.length + variations.length + index).locator('strong').isHidden(), anchor + ' native next link keeps its destination answer closed');
      await noJS.goBack();
      check(new URL(noJS.url()).hash === '#' + anchor, anchor + ' native Back returns to the variation');
      await answer.locator('summary').click();
    }
    await noJS.goto(root + '/games/practice/');
    const plainIndex = noJS.getByRole('navigation', { name: 'Workshop exercises' });
    check(await plainIndex.isHidden(), 'native exercise index is closed without scripts');
    await noJS.locator('.guide-contents summary').click();
    check(await plainIndex.isVisible() && await plainIndex.getByRole('link').count() === shareAnchors.length, 'all native index links work without scripts');
    await plainIndex.getByRole('link', { name: 'Plan two moves' }).click();
    check(new URL(noJS.url()).hash === '#' + twoMove && await noJS.locator('.practice-board').nth(3).isVisible(), 'native link and two-move board work without scripts');
    const plainAnswer = noJS.locator('.move-check').nth(twoMoveIndex);
    check(await plainAnswer.locator('strong').isHidden(), 'two-move answer stays hidden without scripts');
    await plainAnswer.locator('summary').click();
    check(await plainAnswer.locator('strong').isVisible() && await plainAnswer.locator('strong').textContent() === 'Move B.', 'two-move answer works without scripts');
    check(await plainAnswer.getByRole('link', { name: 'Play Blockzzle' }).getAttribute('href') === playURLs[0], 'Blockzzle Play remains native');
    await plainAnswer.locator('[data-next-practice]').click();
    await noJS.waitForURL(root + '/games/blockzzle/#move-check-2');
    check(await noJS.locator('#move-check-2').isVisible(), 'native guide link reaches the exact exercise');
    await noJS.goto(root + '/games/practice/#' + diagonal);
    check(await noJS.locator('#' + diagonal).isVisible() && await noJS.locator('.practice-board').nth(4).isVisible(), 'diagonal bookmark and board work without scripts');
    const plainLineAnswer = noJS.locator('.move-check').nth(diagonalIndex);
    check(await plainLineAnswer.locator('strong').isHidden(), 'diagonal answer stays hidden without scripts');
    await plainLineAnswer.locator('summary').click();
    check(await plainLineAnswer.locator('strong').isVisible() && await plainLineAnswer.locator('strong').textContent() === 'Place the medium blue ring at C3.', 'diagonal answer works without scripts');
    check(await plainLineAnswer.getByRole('link', { name: 'Play Ringzzle' }).getAttribute('href') === playURLs[1], 'Ringzzle Play remains native');
    await plainLineAnswer.locator('[data-next-practice]').click();
    await noJS.waitForURL(root + '/games/ringzzle/#move-check-2');
    check(await noJS.locator('#move-check-2').isVisible(), 'native guide link reaches the Ringzzle line exercise');
    await noJS.goto(root + '/games/practice/#' + candidatePair);
    check(await noJS.locator('#' + candidatePair).isVisible() && await noJS.locator('.practice-board').nth(5).isVisible(), 'pair bookmark and table work without scripts');
    const plainPairAnswer = noJS.locator('.move-check').nth(pairIndex);
    check(await plainPairAnswer.locator('strong').isHidden(), 'pair answer stays hidden without scripts');
    await plainPairAnswer.locator('summary').click();
    check(await plainPairAnswer.locator('strong').isVisible() && await plainPairAnswer.locator('strong').textContent() === pairAnswerText, 'pair answer works without scripts');
    check(await plainPairAnswer.getByRole('link', { name: 'Play DaySudoku' }).getAttribute('href') === playURLs[2], 'DaySudoku Play remains native');
    await plainPairAnswer.locator('[data-next-practice]').click();
    await noJS.waitForURL(root + '/games/daysudoku/#move-check-2');
    check(await noJS.locator('#move-check-2').isVisible(), 'native guide link reaches the DaySudoku deduction');
    await noJS.goto(root + workshopPath + '#' + candidatePair);
    const plainNextSteps = noJS.getByRole('navigation', { name: 'Workshop next steps' });
    check(await plainIndex.isHidden(), 'index starts closed without scripts');
    await plainNextSteps.getByRole('link', { name: 'Choose another exercise' }).click();
    await noJS.waitForURL(root + workshopPath + '#workshop-exercises');
    check(await plainIndex.isVisible() && await plainIndex.getByRole('link').count() === shareAnchors.length, 'native return opens the complete index without scripts');
    await plainIndex.getByRole('link', { name: 'Compare two clears' }).click();
    await noJS.waitForURL(root + workshopPath + '#' + compareClears);
    const plainComparison = noJS.locator('.move-check').nth(compareIndex);
    check(await noJS.locator('.practice-board').nth(6).isVisible()
      && await plainComparison.locator('strong').isHidden(), 'native index reaches the comparison board without spoilers');
    await plainComparison.locator('summary').click();
    check(await plainComparison.locator('strong').isVisible() && await plainComparison.locator('strong').textContent() === compareAnswerText, 'comparison answer works without scripts');
    await plainIndex.getByRole('link', { name: 'Make room for the next ring' }).click();
    await noJS.waitForURL(root + workshopPath + '#' + trayPuzzle);
    const plainTray = noJS.locator('.move-check').nth(trayIndex);
    check(await noJS.locator('.practice-board').nth(7).isVisible() && await plainTray.locator('strong').isHidden(), 'native index reaches the tray board without spoilers');
    await plainTray.locator('summary').click();
    check(await plainTray.locator('strong').isVisible() && await plainTray.locator('strong').textContent() === trayAnswerText, 'tray answer works without scripts');
    await plainNextSteps.getByRole('link', { name: 'Browse puzzle games' }).click();
    await noJS.waitForURL(root + '/games/#puzzles');
    check(await noJS.getByRole('heading', { name: 'Choose a puzzle' }).isVisible(), 'native directory link reaches the puzzle choices');
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
