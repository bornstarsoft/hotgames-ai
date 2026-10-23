// Playwright CLI run-code; isolated profile on the target origin. IME events are synthetic.
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
  const input = page.locator('#searchInput');
  const focused = () => input.evaluate(el => document.activeElement === el);
  const query = () => new URL(page.url()).searchParams.get('q');
  const compose = (type, value, isComposing = true) => input.evaluate((el, args) => {
    if (args.value !== null) el.value = args.value;
    el.dispatchEvent(args.type === 'input'
      ? new InputEvent('input', { bubbles: true, isComposing: args.isComposing, inputType: 'insertCompositionText' })
      : new CompositionEvent(args.type, { bubbles: true, data: args.value || '' }));
  }, { type, value, isComposing });
  try {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(root + '/');
    await page.evaluate(() => {
      localStorage.setItem('likedGames', '["blockzzle","ringzzle","daysudoku"]');
      localStorage.setItem('recentGames', '["blockzzle","ringzzle","daysudoku"]');
    });
    for (const view of ['discover', 'saved', 'recent']) {
      const suffix = (view === 'discover' ? '' : 'view=' + view + '&') + 'cat=puzzle&q=Ringzzle';
      await page.goto(root + '/?' + suffix);
      await input.focus();
      const originalUrl = page.url();
      const originalCount = await page.locator('#catalogCount').textContent();
      await compose('compositionstart', null);
      await compose('input', '\u314e');
      check(page.url() === originalUrl, view + ' intermediate input does not change URL');
      check(await page.locator('#catalogCount').textContent() === originalCount, view + ' intermediate input does not change results');
      await compose('input', '\ud55c', false);
      check(page.url() === originalUrl, view + ' composition lifecycle also protects unflagged input');
      for (const init of [{ key: 'Escape', isComposing: true }, { key: 'Escape' }, { key: '/', isComposing: true }]) {
        await input.evaluate((el, init) => el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })), init);
        check(await input.inputValue() === '\ud55c' && await focused() && page.url() === originalUrl, view + ' composition shortcut leaves draft and focus intact ' + JSON.stringify(init));
      }
      await compose('compositionend', 'Blockzzle');
      check(query() === 'Blockzzle', view + ' composition commit updates query');
      check(await page.locator('[data-game-id="blockzzle"]:visible').count() === 1, view + ' committed match visible');
      check(await focused(), view + ' commit preserves input focus');
      const repeated = await input.evaluate(el => {
        const observer = new MutationObserver(() => {});
        observer.observe(document.getElementById('catalogCount'), { childList: true, characterData: true, subtree: true });
        el.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: false }));
        const records = observer.takeRecords().length;
        observer.disconnect();
        return records;
      });
      check(repeated === 0, view + ' final duplicate input does not rerender');

      await compose('compositionstart', null);
      await compose('input', '\u30d1\u30ba\u30eb');
      await compose('compositionend', 'Blockzzle');
      check(query() === 'Blockzzle' && await focused(), view + ' canceled composition keeps prior committed query');
      for (const init of [{ key: 'Escape', isComposing: true }, { key: 'Escape', keyCode: 229 }]) {
        await input.evaluate((el, init) => el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })), init);
        check(await input.inputValue() === 'Blockzzle' && query() === 'Blockzzle' && await focused(), view + ' boundary IME key is not a search clear ' + JSON.stringify(init));
      }
      await compose('input', '\u6570\u72ec');
      check(query() === 'Blockzzle', view + ' input isComposing alone defers filtering');
      await compose('compositionend', '\u6570\u72ec');
      check(query() === '\u6570\u72ec' && await page.locator('#emptyState').isVisible(), view + ' committed Unicode search uses ordinary catalog matching');
      await input.press('Escape');
      check(await input.inputValue() === '' && query() === null && await focused(), view + ' Escape clears search without losing focus');
      check(new URL(page.url()).searchParams.get('cat') === 'puzzle' &&
        new URL(page.url()).searchParams.get('view') === (view === 'discover' ? null : view), view + ' Escape preserves collection and category');
      await input.press('Escape');
      check(await focused(), view + ' empty Escape does not move focus');
      await page.keyboard.type('DaySudoku');
      check(query() === 'DaySudoku' && await page.locator('[data-game-id="daysudoku"]:visible').count() === 1, view + ' immediate retry finds a game');
      await page.locator('#searchClear').click();
      check(query() === null && await focused(), view + ' clear button keeps search ready');
      await input.fill('Ringzzle');
      await input.fill('');
      check(query() === null && await page.locator('#searchClear').isHidden(), view + ' native deletion updates results');
      await input.fill('Ringzzle');
      await page.reload();
      check(await input.inputValue() === 'Ringzzle', view + ' reload restores committed query');

      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const theme of ['light', 'dark']) {
          await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
          check(await page.locator('#searchClear').evaluate(el => {
            const button = el.getBoundingClientRect();
            const field = document.getElementById('searchInput').getBoundingClientRect();
            const padding = parseFloat(getComputedStyle(document.getElementById('searchInput')).paddingRight);
            return document.documentElement.scrollWidth <= innerWidth && button.width >= 44 && button.height >= 44
              && button.left >= field.left && button.right <= field.right && button.top >= field.top && button.bottom <= field.bottom
              && field.right - padding <= button.left;
          }), view + ' clear target and text fit ' + width + '/' + theme);
          layouts++;
        }
      }
      check(await page.evaluate(() => localStorage.getItem('likedGames') === '["blockzzle","ringzzle","daysudoku"]'
        && localStorage.getItem('recentGames') === '["blockzzle","ringzzle","daysudoku"]'), view + ' search never changes personal lists');
    }
    await page.goto(root + '/');
    await page.locator('h1').focus();
    await page.keyboard.press('/');
    check(await focused(), 'ordinary slash shortcut still opens search');
    await input.fill('Blockzzle');
    await page.locator('[data-view="saved"]').first().click();
    await page.goBack();
    check(query() === 'Blockzzle' && await input.inputValue() === 'Blockzzle', 'Back restores prior search');
    await page.goForward();
    check(query() === null && await input.inputValue() === '', 'Forward restores collection without stale draft');
    for (const [id, url] of Object.entries({ daysudoku: 'https://daysudoku.com/', blockzzle: 'https://blockzzle.com/play/', ringzzle: 'https://ringzzle.com/play/' })) {
      check(await page.locator('.source-section [data-game-id="' + id + '"] .play-link').getAttribute('href') === url, id + ' Play link unchanged');
    }
    check(errors.length === 0, 'no JavaScript errors');
    return { engine: context.browser().browserType().name(), passed: checks.length, layouts };
  } finally {
    page.off('pageerror', onError);
    await context.unroute(analytics, suppress);
  }
}
