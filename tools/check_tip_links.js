// Playwright CLI; isolated browser storage and clipboard stub, never owner data.
async (page) => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const checks = [];
  const errors = [];
  const check = (ok, name) => { if (!ok) throw new Error(name); checks.push(name); };
  const onError = error => errors.push(error.message);
  const analytics = /google-analytics|googletagmanager|cloudflareinsights/;
  const suppress = route => route.fulfill({ body: '', contentType: 'application/javascript' });
  const tips = ['a-simple-starting-strategy', 'when-you-get-stuck', 'try-a-move-check'];
  const exercises = ['move-check-1', 'move-check-2'];
  const targets = [...tips, ...exercises];
  const games = ['blockzzle', 'ringzzle', 'daysudoku'];
  let plainContext;
  let layouts = 0;
  page.on('pageerror', onError);
  await context.route(analytics, suppress);
  try {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const game of games) {
      await page.goto(root + '/games/' + game + '/?q=private&view=saved#who-it-is-for');
      await page.evaluate(() => {
        localStorage.setItem('likedGames', '["blockzzle","ringzzle","daysudoku"]');
        localStorage.setItem('recentGames', '["ringzzle"]');
        window.tipCopies = [];
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
          writeText: async text => { window.tipCopies.push(text); }
        } });
      });
      check(await page.locator('[data-copy-tip]').count() === targets.length, game + ' three tip links and two exact practice links');
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          for (const tip of targets) {
            const button = page.locator('[data-copy-tip="' + tip + '"]');
            await button.focus();
            await page.keyboard.press('Enter');
            const expected = 'https://hotgames.ai/games/' + game + '/#' + tip;
            check(await page.evaluate(() => window.tipCopies.at(-1)) === expected, game + '/' + width + '/' + theme + '/' + tip + ' canonical URL');
            check(await page.locator('#tip-status-' + tip).textContent() === 'Tip link copied.', 'truthful copy feedback');
            check(await button.evaluate(el => {
              const r = el.getBoundingClientRect();
              return el === document.activeElement && r.width >= 44 && r.height >= 44
                && r.left >= 0 && r.right <= innerWidth && document.documentElement.scrollWidth <= innerWidth;
            }), 'visible focused 44px control without horizontal overflow');
          }
          layouts++;
        }
      }
      check(await page.evaluate(() => localStorage.getItem('likedGames')) === '["blockzzle","ringzzle","daysudoku"]', game + ' saves unchanged');
      check(await page.evaluate(() => localStorage.getItem('recentGames')) === '["ringzzle"]', game + ' history unchanged');
      check(new URL(page.url()).hash === '#who-it-is-for', game + ' copying does not navigate');
      check(await page.locator('.move-check[open]').count() === 0, game + ' copying leaves answers closed');

      await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }));
      const first = page.locator('[data-copy-tip]').first();
      await first.click();
      const fallback = page.locator('#tip-status-' + tips[0]);
      check(await fallback.textContent() === 'Copy unavailable. Open tip link', game + ' absent clipboard honest fallback');
      check(await fallback.locator('a').getAttribute('href') === 'https://hotgames.ai/games/' + game + '/#' + tips[0], game + ' fallback crawlable exact URL');
      await fallback.locator('a').focus();
      check(await fallback.locator('a').evaluate(el => el === document.activeElement), game + ' fallback keyboard accessible');
      await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
        writeText: async () => { throw new DOMException('QA denied', 'NotAllowedError'); }
      } }));
      await first.click();
      check((await fallback.textContent()).startsWith('Copy unavailable.'), game + ' permission denial is not success');

      await page.evaluate(() => {
        window.tipCalls = 0;
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
          writeText: () => { window.tipCalls++; return new Promise(resolve => { window.finishTip = resolve; }); }
        } });
      });
      await first.click();
      await first.click();
      check(await page.evaluate(() => window.tipCalls) === 1, game + ' repeated activation does not duplicate pending copy');
      check(await first.getAttribute('aria-busy') === 'true', game + ' pending state exposed');
      await page.evaluate(() => window.finishTip());
      await page.waitForFunction(() => !document.querySelector('[data-copy-tip]').hasAttribute('aria-busy'));
      check(await fallback.textContent() === 'Tip link copied.', game + ' retry succeeds');

      await page.locator('[data-save-game="' + game + '"]').first().click();
      check(await page.locator('#guideSaveUndo').isVisible(), game + ' existing save Undo available');
      await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => {} } }));
      await first.click();
      check(await page.locator('#guideSaveUndo').isVisible(), game + ' copying does not replace save notification');
      await page.locator('#guideSaveUndo').click();
      check(await page.evaluate(game => JSON.parse(localStorage.getItem('likedGames')).includes(game), game), game + ' save Undo still works');
    }
    plainContext = await context.browser().newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
    const plain = await plainContext.newPage();
    for (const game of games) {
      await plain.goto(root + '/games/' + game + '/#when-you-get-stuck');
      check(await plain.locator('[data-copy-tip]').count() === 0, game + ' no dead no-JS controls');
      for (const tip of tips) check(await plain.locator('h2[id="' + tip + '"]').count() === 1, game + '/' + tip + ' existing fragment retained');
      const contents = plain.locator('.guide-contents');
      for (const id of exercises) {
        if (!await contents.evaluate(el => el.open)) await contents.locator('summary').click();
        const heading = plain.locator('h3[id="' + id + '"]');
        check(await heading.count() === 1, game + '/' + id + ' unique heading');
        await plain.locator('.guide-contents a[href="#' + id + '"]').click();
        check(new URL(plain.url()).hash === '#' + id, game + '/' + id + ' no-JS contents jump');
        check(await plain.locator('.move-check[open]').count() === 0, game + '/' + id + ' jump keeps answers closed');
        await plain.goto('about:blank');
        await plain.goto(root + '/games/' + game + '/#' + id);
        check(await heading.evaluate(el => {
          const rect = el.getBoundingClientRect();
          return rect.top >= -1 && rect.bottom <= innerHeight && document.documentElement.scrollWidth <= innerWidth;
        }), game + '/' + id + ' direct fragment visible on mobile without JS');
        check(await plain.locator('.move-check[open]').count() === 0, game + '/' + id + ' direct link keeps answers closed');
      }
    }
    await page.goto(root + '/games/');
    check(await page.locator('[data-copy-tip]').count() === 0, 'directory not cluttered');
    const savedQuestion = page.locator('details').filter({ hasText: 'Does saving a game save my puzzle board?' });
    check(await savedQuestion.locator('p').isHidden(), 'saved-progress answer is collapsed');
    await savedQuestion.locator('summary').click();
    check((await savedQuestion.locator('p').textContent()).includes('does not save your puzzle board'), 'saved-progress answer distinguishes game state');
    check(await savedQuestion.locator('a').getAttribute('href') === '/?view=saved', 'saved-progress answer links to existing list');
    await page.goto(root + '/');
    check(await page.locator('[data-copy-tip]').count() === 0, 'main unchanged');
    check(await page.locator('.source-section .game-card').count() === 24, 'catalog unchanged');
    check(errors.length === 0, 'no application runtime errors');
    return { engine: context.browser().browserType().name(), passed: checks.length, layouts };
  } finally {
    if (plainContext) await plainContext.close();
    page.off('pageerror', onError);
    await context.unroute(analytics, suppress);
  }
}
