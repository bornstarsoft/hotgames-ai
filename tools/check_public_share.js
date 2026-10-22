// Playwright CLI run-code in an isolated profile; never opens a real share target or clipboard.
async (page) => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const checks = [];
  const errors = [];
  const check = (ok, name) => { if (!ok) throw new Error(name); checks.push(name); };
  const onError = error => errors.push(error.message);
  const analytics = /google-analytics|googletagmanager|cloudflareinsights/;
  const suppress = route => route.fulfill({ body: '', contentType: 'application/javascript' });
  page.on('pageerror', onError);
  await context.route(analytics, suppress);
  await page.addInitScript(() => {
    window.shareMode = 'native'; window.shared = []; window.copied = [];
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => window.shareMode !== 'unsupported' });
    Object.defineProperty(navigator, 'share', { configurable: true, value: async data => {
      window.shared.push(data);
      if (window.shareMode === 'cancel') throw new DOMException('Canceled', 'AbortError');
      if (['failure', 'denied'].includes(window.shareMode)) throw new DOMException('Unavailable', 'NotAllowedError');
      if (window.shareMode === 'pending') await new Promise(resolve => window.releaseShare = resolve);
    } });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => {
      if (window.shareMode === 'denied') throw new DOMException('Denied', 'NotAllowedError');
      window.copied.push(text);
    } } });
  });
  let receiver;
  let plainContext;
  let layouts = 0;
  const share = page.locator('#shareBtn');
  const menuShare = page.locator('#shareMenuBtn');
  try {
    await page.goto(root + '/');
    await page.evaluate(() => {
      localStorage.setItem('likedGames', '["blockzzle"]');
      localStorage.setItem('recentGames', '["daysudoku"]');
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const view of ['discover', 'saved', 'recent']) {
      const query = '?view=' + view + '&cat=puzzle&q=Ringzzle&ref=not-to-share#recentTitle';
      await page.goto(root + '/' + query);
      check(await share.getAttribute('aria-label') === 'Share game search', view + ' scope label');
      await share.click();
      const data = await page.evaluate(() => window.shared[0]);
      check(data.url === 'https://hotgames.ai/?cat=puzzle&q=Ringzzle', view + ' canonical public search only');
      check(data.title === 'Game search | HotGames.ai', view + ' factual share title');
      check(Object.keys(data).sort().join(',') === 'title,url', view + ' no private list payload');
      check(new URL(page.url()).search + new URL(page.url()).hash === query, view + ' current view untouched');
      check(await page.evaluate(() => localStorage.getItem('likedGames') === '["blockzzle"]' && localStorage.getItem('recentGames') === '["daysudoku"]'), view + ' lists untouched');
      check(await page.evaluate(() => window.copied.length === 0), view + ' native success does not copy');
    }
    receiver = await context.browser().newContext({ viewport: { width: 390, height: 844 } });
    await receiver.route(analytics, suppress);
    const recipient = await receiver.newPage();
    await recipient.goto(root + '/?cat=puzzle&q=Ringzzle');
    check(await recipient.locator('.source-section [data-game-id="ringzzle"]:visible').count() === 1, 'fresh recipient sees matching game');
    check(await recipient.evaluate(() => localStorage.getItem('likedGames') === null && localStorage.getItem('recentGames') === null), 'recipient receives no personal lists');
    await receiver.close(); receiver = undefined;

    await page.goto(root + '/?view=saved');
    check(await share.getAttribute('title') === 'Share HotGames.ai', 'unfiltered collection uses site label');
    await share.click();
    check(await page.evaluate(() => window.shared[0].url) === 'https://hotgames.ai/', 'unfiltered collection shares public home');
    await page.locator('#searchInput').fill('  red + blue & rings  ');
    await share.click();
    const encoded = new URL(await page.evaluate(() => window.shared[1].url));
    check(encoded.searchParams.get('q') === 'red + blue & rings' && [...encoded.searchParams.keys()].join(',') === 'q', 'query safely encoded and trimmed');
    await page.goto(root + '/?cat=unknown&view=unknown&ref=unused#unused');
    await share.click();
    check(await page.evaluate(() => window.shared[0].url) === 'https://hotgames.ai/', 'invalid route state does not leak to share');

    for (const mode of ['clipboard', 'unsupported', 'failure', 'cancel', 'denied']) {
      await page.goto(root + '/?view=recent&cat=browser&q=Ringzzle');
      await page.evaluate(value => {
        window.shareMode = value;
        if (value === 'clipboard') Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
      }, mode);
      await share.click();
      await page.waitForFunction(() => !document.getElementById('shareBtn').hasAttribute('aria-busy'));
      const result = await page.evaluate(() => ({ shared: window.shared, copied: window.copied, message: document.getElementById('toastMessage').textContent }));
      if (['clipboard', 'unsupported', 'failure'].includes(mode)) {
        check(result.copied[0] === 'https://hotgames.ai/?cat=browser&q=Ringzzle', mode + ' canonical copy fallback');
        check(result.message === 'Game search link copied', mode + ' truthful copy feedback');
      } else if (mode === 'cancel') {
        check(result.copied.length === 0 && result.message === '', 'cancel performs no copy or error toast');
      } else {
        check(result.copied.length === 0 && result.message === 'Sharing is unavailable in this browser', 'denied APIs do not claim success');
      }
      check(await share.getAttribute('aria-busy') === null, mode + ' busy state released');
    }

    await page.goto(root + '/?q=Ringzzle');
    await page.evaluate(() => window.shareMode = 'pending');
    await share.click(); await share.click();
    check(await page.evaluate(() => window.shared.length === 1), 'repeated click does not open duplicate share');
    await page.evaluate(() => window.releaseShare());
    await page.waitForFunction(() => !document.getElementById('shareBtn').hasAttribute('aria-busy'));
    await page.locator('.filter-btn[data-filter="browser"]').click();
    await page.goBack();
    await page.evaluate(() => window.shareMode = 'native');
    await share.click();
    check(await page.evaluate(() => window.shared.at(-1).url) === 'https://hotgames.ai/?q=Ringzzle', 'Back updates shared filter state');

    for (const width of [320, 390, 620, 621, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
        const mobile = width <= 620;
        if (mobile) await page.locator('#mobileMenuBtn').click();
        const control = mobile ? menuShare : share;
        await control.scrollIntoViewIfNeeded();
        check(await control.isVisible() && (mobile ? await share.isHidden() : await menuShare.isHidden()), width + '/' + theme + ' single share entry');
        check(await control.evaluate(el => {
          const r = el.getBoundingClientRect();
          return document.documentElement.scrollWidth <= innerWidth && r.left >= 0 && r.right <= innerWidth && r.height >= 40 && r.width >= 40 && el.scrollWidth <= el.clientWidth;
        }), width + '/' + theme + ' control fits');
        await control.focus(); await control.press('Enter');
        if (mobile) {
          check(await page.locator('#sidebar').evaluate(el => el.inert && !el.classList.contains('open')), width + '/' + theme + ' menu closes');
          check(await page.locator('#mobileMenuBtn').evaluate(el => el === document.activeElement) && await page.locator('.main-shell').evaluate(el => !el.inert), width + '/' + theme + ' focus and interaction restored');
        }
        layouts++;
      }
    }
    plainContext = await context.browser().newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const plain = await plainContext.newPage();
    await plain.goto(root + '/');
    check(await plain.locator('#shareMenuBtn').isHidden(), 'no dead mobile action without JavaScript');
    check(errors.length === 0, 'no application runtime errors');
    return { engine: context.browser().browserType().name(), passed: checks.length, layouts, checks };
  } finally {
    if (receiver) await receiver.close();
    if (plainContext) await plainContext.close();
    page.off('pageerror', onError);
    await context.unroute(analytics, suppress);
  }
}
