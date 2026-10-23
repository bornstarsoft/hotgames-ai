// Playwright CLI run-code; isolated profile, no real game launches or owner data.
async (page) => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const analytics = /google-analytics|googletagmanager|cloudflareinsights/;
  const suppress = route => route.fulfill({ body: '', contentType: 'application/javascript' });
  const errors = [];
  const onError = error => errors.push(error.message);
  let passed = 0;
  let layouts = 0;
  let other;
  let isolated;
  const check = (ok, name) => { if (!ok) throw new Error(name); passed++; };
  page.on('pageerror', onError);
  await context.route(analytics, suppress);
  try {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(root + '/games/');
    for (const [path, id] of [
      ['/games/', 'blockzzle'], ['/games/blockzzle/', 'blockzzle'],
      ['/games/ringzzle/', 'ringzzle'], ['/games/daysudoku/', 'daysudoku']
    ]) {
      await page.evaluate(() => {
        localStorage.setItem('likedGames', '["wordle"]');
        localStorage.setItem('recentGames', '["ringzzle"]');
      });
      await page.goto(root + path);
      const save = page.locator(`[data-save-game="${id}"]`).first();
      const toast = page.locator('#guideSaveToast');
      const link = page.locator('#guideSavedDestination a');
      check(!await toast.isVisible(), path + ' no initial prompt');
      await save.focus(); await save.press('Space');
      check(await link.isVisible(), path + ' successful save offers destination');
      check(await link.textContent().then(text => text.trim()) === 'Saved games', path + ' concise destination label');
      check(await link.getAttribute('href') === '/?view=saved' && !await link.getAttribute('target')
        && !await link.getAttribute('rel'), path + ' native same-tab crawlable link');
      check(!await page.locator('#guideSaveUndo').isVisible(), path + ' no misleading undo after adding');
      check(await page.locator('#guideSaveDismiss').isVisible(), path + ' can dismiss success');
      check(await save.evaluate(el => el === document.activeElement), path + ' save does not steal focus');
      await link.focus();
      if (path === '/games/') {
        await page.waitForTimeout(4700);
        check(await link.isVisible() && await link.evaluate(el => el === document.activeElement), 'success does not time out under keyboard focus');
      }
      await link.press('Escape');
      check(!await toast.isVisible() && await save.evaluate(el => el === document.activeElement), path + ' Escape closes and restores focus');

      await save.click();
      check(!await link.isVisible() && await page.locator('#guideSaveUndo').isVisible(), path + ' removal retains Undo without success link');
      await page.locator('#guideSaveUndo').click();
      check(await link.isVisible() && await save.getAttribute('aria-pressed') === 'true', path + ' Undo restores destination');
      await link.focus(); await link.press('Enter');
      await page.waitForURL(root + '/?view=saved');
      check(await page.locator(`#favoritesGrid [data-game-id="${id}"]`).count() === 1, path + ' saved game reached');
      check(await page.locator('#favoritesGrid [data-game-id="wordle"]').count() === 1, path + ' other saved game preserved');
      check(await page.evaluate(() => localStorage.getItem('recentGames')) === '["ringzzle"]', path + ' no play history from saving or navigating');
      await page.goBack();
      check(await save.getAttribute('aria-pressed') === 'true', path + ' native Back keeps saved state');

      await save.click();
      await page.locator('#guideSaveUndo').click();
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          check(await toast.evaluate(el => {
            const t = el.getBoundingClientRect();
            const controls = [...el.querySelectorAll('a,button')].filter(el => el.getClientRects().length);
            const boxes = controls.map(el => el.getBoundingClientRect());
            return document.documentElement.scrollWidth <= innerWidth && t.left >= 0 && t.right <= innerWidth
              && t.top >= 0 && t.bottom <= innerHeight
              && boxes.every(r => r.width >= 44 && r.height >= 44 && r.left >= t.left && r.right <= t.right && r.top >= t.top && r.bottom <= t.bottom)
              && boxes.every((a, i) => boxes.every((b, j) => i === j || a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top));
          }), path + '/' + width + '/' + theme + ' visible controls fit without overlap');
          layouts++;
        }
      }
      await page.locator('#guideSaveDismiss').click();
      check(!await toast.isVisible() && await save.evaluate(el => el === document.activeElement), path + ' dismiss retains saved game and returns focus');
      await save.click(); await page.locator('#guideSaveUndo').click();
      other = await context.newPage();
      await other.goto(root + '/games/');
      await page.locator('#guideTheme').focus();
      await other.evaluate(() => localStorage.setItem('likedGames', '["wordle"]'));
      await toast.waitFor({ state: 'hidden' });
      check(await page.locator('#guideTheme').evaluate(el => el === document.activeElement), path + ' cross-tab removal does not steal unrelated focus');
      check(await save.getAttribute('aria-pressed') === 'false', path + ' cross-tab removal updates heart');
      await save.click(); await link.focus();
      await other.evaluate(() => localStorage.clear());
      await toast.waitFor({ state: 'hidden' });
      check(await save.evaluate(el => el === document.activeElement), path + ' explicit reset restores focus from disappearing link');
      await other.close(); other = undefined;

      await save.click();
      await page.evaluate(() => {
        localStorage.setItem('likedGames', '[]');
        window.dispatchEvent(new StorageEvent('storage', { key: 'likedGames', storageArea: sessionStorage }));
        window.dispatchEvent(new StorageEvent('storage', { key: null }));
      });
      check(await link.isVisible() && await save.getAttribute('aria-pressed') === 'true', path + ' ignores unrelated storage areas');
      await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
      check(!await toast.isVisible() && await save.getAttribute('aria-pressed') === 'false', path + ' restored page removes stale success');
    }

    for (const mode of ['read-blocked', 'write-blocked', 'no-js']) {
      isolated = await context.browser().newContext({ javaScriptEnabled: mode !== 'no-js' });
      await isolated.route(analytics, suppress);
      if (mode !== 'no-js') await isolated.addInitScript(mode => {
        if (mode === 'read-blocked') Object.defineProperty(window, 'localStorage', {
          get() { throw new DOMException('Blocked', 'SecurityError'); }
        });
        else {
          const set = Storage.prototype.setItem;
          Storage.prototype.setItem = function(key, value) {
            if (this === localStorage && key === 'likedGames') throw new DOMException('Full', 'QuotaExceededError');
            return set.call(this, key, value);
          };
        }
      }, mode);
      const probe = await isolated.newPage();
      probe.on('pageerror', onError);
      await probe.goto(root + '/games/daysudoku/');
      const save = probe.locator('[data-save-game]').first();
      if (mode === 'no-js') {
        check(!await save.isVisible(), 'no JS hides unavailable saving');
        check(await probe.locator('.guide-play').first().getAttribute('href') === 'https://daysudoku.com/', 'no JS retains native Play');
      } else {
        await save.click();
        check((await probe.locator('#guideSaveStatus').textContent()).includes(mode === 'read-blocked' ? 'unavailable' : 'could not'), mode + ' honest failure feedback');
        check(await save.getAttribute('aria-pressed') === 'false', mode + ' no false saved state');
      }
      check(!await probe.locator('#guideSavedDestination a').isVisible(), mode + ' no success shortcut');
      await isolated.close(); isolated = undefined;
    }
    check(errors.length === 0, 'no runtime errors');
    return { engine: context.browser().browserType().name(), passed, layouts };
  } finally {
    if (other) await other.close();
    if (isolated) await isolated.close();
    page.off('pageerror', onError);
    await context.unroute(analytics, suppress);
  }
}
