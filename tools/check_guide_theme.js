// Playwright CLI; isolated storage. Persisted pageshow events simulate a restored page.
async (page) => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const checks = [];
  const errors = [];
  const check = (ok, name) => { if (!ok) throw new Error(name); checks.push(name); };
  const onError = error => errors.push(error.message);
  const analytics = /google-analytics|googletagmanager|cloudflareinsights/;
  const suppress = route => route.fulfill({ body: '', contentType: 'application/javascript' });
  const theme = () => page.locator('html').getAttribute('data-theme');
  const waitTheme = expected => page.waitForFunction(value => document.documentElement.dataset.theme === value, expected);
  const restore = () => page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  const seed = () => page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('likedGames', '["blockzzle"]');
    localStorage.setItem('recentGames', '["ringzzle"]');
  });
  let other;
  let blocked;
  let layouts = 0;
  page.on('pageerror', onError);
  await context.route(analytics, suppress);
  try {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(root + '/games/');
    for (const path of ['/games/', '/games/blockzzle/', '/games/ringzzle/', '/games/daysudoku/']) {
      await seed();
      await page.goto(root + path);
      const button = page.locator('#guideTheme');
      check(await theme() === 'light', path + ' stored theme loaded');
      check(await button.getAttribute('aria-label') === 'Use dark theme', path + ' initial accessible label');
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));
      await restore();
      check(await theme() === 'dark', path + ' restored page reads current preference');
      check(await button.getAttribute('aria-label') === 'Use light theme', path + ' restored label');
      check(await button.locator('i').getAttribute('class') === 'fa-solid fa-sun', path + ' restored icon');

      other = await context.newPage();
      await other.goto(root + '/');
      await other.locator('#themeBtn').click();
      await waitTheme('light');
      check(await theme() === 'light', path + ' homepage toggle synchronizes guide');
      for (const area of ['sessionStorage', 'none']) {
        await page.evaluate(area => window.dispatchEvent(new StorageEvent('storage', {
          key: 'theme', newValue: 'dark', storageArea: area === 'none' ? null : sessionStorage
        })), area);
        check(await theme() === 'light', path + ' ignores unrelated storage area ' + area);
      }
      await page.evaluate(() => window.dispatchEvent(new StorageEvent('storage', {
        key: 'recentGames', newValue: 'dark', storageArea: localStorage
      })));
      check(await theme() === 'light', path + ' unrelated key does not change theme');
      await other.evaluate(() => localStorage.removeItem('theme'));
      await waitTheme('dark');
      check(await page.evaluate(() => localStorage.getItem('theme')) === null, path + ' removal uses default without rewriting storage');
      await other.evaluate(() => localStorage.setItem('theme', 'light'));
      await waitTheme('light');
      check(await page.evaluate(() => localStorage.getItem('likedGames') === '["blockzzle"]'
        && localStorage.getItem('recentGames') === '["ringzzle"]'), path + ' synchronization preserves personal lists');
      await other.evaluate(() => localStorage.clear());
      await waitTheme('dark');
      check(await theme() === 'dark', path + ' explicit storage reset restores default');
      check(await page.evaluate(() => localStorage.getItem('theme')) === null, path + ' reset is not undone by guide');
      await other.close(); other = undefined;

      await button.focus();
      await button.press('Space');
      check(await theme() === 'light' && await page.evaluate(() => localStorage.getItem('theme')) === 'light', path + ' keyboard toggle persists');
      check(await button.evaluate(el => el === document.activeElement), path + ' toggle retains focus');
      await page.reload();
      check(await theme() === 'light', path + ' reload keeps preference');
      await button.focus(); await button.press('Enter');
      check(await theme() === 'dark', path + ' Enter toggles back');
      await page.evaluate(() => {
        localStorage.setItem('theme', 'invalid-theme');
        window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'light', storageArea: localStorage }));
      });
      check(await theme() === 'dark', path + ' current stored value takes priority over stale event payload');

      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const value of ['light', 'dark']) {
          await page.evaluate(value => localStorage.setItem('theme', value), value);
          await restore();
          await button.scrollIntoViewIfNeeded();
          check(await theme() === value && await button.evaluate(el => {
            const r = el.getBoundingClientRect();
            return document.documentElement.scrollWidth <= innerWidth && r.width >= 44 && r.height >= 44
              && r.left >= 0 && r.right <= innerWidth;
          }), path + '/' + width + '/' + value + ' restored control fits');
          layouts++;
        }
      }
    }

    // Storage failure must not undo a theme selected for the current page.
    for (const mode of ['read-blocked', 'write-blocked']) {
      blocked = await context.browser().newContext({ viewport: { width: 390, height: 900 } });
      await blocked.route(analytics, suppress);
      await blocked.addInitScript(mode => {
        if (mode === 'read-blocked') {
          Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
        } else {
          localStorage.setItem('theme', 'dark');
          const original = Storage.prototype.setItem;
          Storage.prototype.setItem = function(key, value) {
            if (this === localStorage && key === 'theme') throw new DOMException('Full', 'QuotaExceededError');
            return original.call(this, key, value);
          };
        }
      }, mode);
      const probe = await blocked.newPage();
      probe.on('pageerror', onError);
      await probe.goto(root + '/games/daysudoku/');
      await probe.locator('#guideTheme').click();
      check(await probe.locator('html').getAttribute('data-theme') === 'light', mode + ' local toggle works');
      await probe.evaluate(() => {
        window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
        window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'dark', storageArea: sessionStorage }));
        window.dispatchEvent(new StorageEvent('storage', { key: null, storageArea: sessionStorage }));
      });
      check(await probe.locator('html').getAttribute('data-theme') === 'light', mode + ' restore and unrelated events keep temporary choice');
      check(await probe.locator('#guideTheme').getAttribute('aria-label') === 'Use dark theme', mode + ' temporary label correct');
      if (mode === 'write-blocked') {
        await probe.evaluate(() => window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'dark', storageArea: localStorage })));
        check(await probe.locator('html').getAttribute('data-theme') === 'dark', mode + ' explicit theme event overrides temporary preference');
      }
      await blocked.close(); blocked = undefined;
    }
    await page.goto(root + '/games/ringzzle/');
    await page.locator('.guide-header a[href="/"]').first().click();
    await page.locator('#themeBtn').click();
    const homeTheme = await theme();
    await page.goBack();
    check(await theme() === homeTheme, 'native Back restores current theme whether reloaded or restored');
    check(await page.locator('.move-check').count() === 2, 'paired practice retained');
    check(errors.length === 0, 'no application runtime errors');
    return { engine: context.browser().browserType().name(), passed: checks.length, layouts };
  } finally {
    if (other) await other.close();
    if (blocked) await blocked.close();
    page.off('pageerror', onError);
    await context.unroute(analytics, suppress);
  }
}
