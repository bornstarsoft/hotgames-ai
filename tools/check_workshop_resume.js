// Playwright CLI run-code; uses disposable contexts and only synthetic local data.
async launcher => {
  const root = new URL(launcher.url()).origin;
  const browser = launcher.context().browser();
  const url = root + '/games/practice/';
  const key = 'hotgamesLastWorkshopExercise';
  const exercises = [
    'blockzzle-crossing-lines', 'ringzzle-distant-slot', 'daysudoku-box-to-row',
    'blockzzle-after-clear', 'ringzzle-blue-slot', 'daysudoku-different-rows',
    'blockzzle-plan-two-moves', 'ringzzle-diagonal-clear', 'daysudoku-candidate-pair'
  ];
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const suppress = route => route.abort('blockedbyclient');
  await context.route(/google-analytics|googletagmanager|cloudflareinsights/, suppress);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let passed = 0;
  let layouts = 0;
  const check = (ok, name) => { if (!ok) throw new Error(name); passed++; };
  const resume = page.locator('#workshopResume');
  const link = resume.getByRole('link');
  const clear = resume.getByRole('button', { name: 'Forget last exercise' });
  const stored = () => page.evaluate(key => localStorage.getItem(key), key);
  const hint = (tab, i) => tab.locator('.move-hint').nth(i).locator('summary');
  const answer = (tab, i) => tab.locator('.move-check').nth(i).locator('summary');
  let blockedContext;
  let plainContext;
  try {
    await page.goto(url);
    await page.evaluate(() => {
      localStorage.setItem('hotgamesLastPractice', '{"game":"blockzzle","question":2}');
      localStorage.setItem('likedGames', '["daysudoku"]');
      localStorage.setItem('recentGames', '["ringzzle"]');
    });
    check(await resume.isHidden() && await stored() === null, 'first visit has no shortcut or write');
    await page.goto(url + '#' + exercises[1]);
    check(await resume.isHidden() && await stored() === null, 'a direct link does not count as opening an exercise');

    await hint(page, 0).press('Enter');
    await hint(page, 1).press('Enter');
    await hint(page, 0).press('Enter');
    check(await stored() === exercises[1], 'closing an older hint does not replace the latest exercise');
    await hint(page, 1).press('Enter');
    for (const [i, id] of exercises.entries()) {
      await hint(page, i).press('Enter');
      check(await stored() === id && await link.getAttribute('href') === '#' + id, id + ' stores and links to exactly one exercise');
      check(await link.textContent() === await page.locator('#' + id).textContent(), id + ' displays its own title');
      await hint(page, i).press('Enter');
    }
    await answer(page, 0).press('Enter');
    check(await stored() === exercises[0], 'opening an answer also remembers its exercise');
    await page.locator('.move-hint').nth(3).evaluate(el => { el.open = true; el.open = false; });
    check(await stored() === exercises[0], 'automatic disclosure changes do not replace the shortcut');

    await page.goto(root + '/games/');
    check(await resume.count() === 0 && await stored() === exercises[0], 'the directory does not show or change the Workshop shortcut');
    await page.goto(url);
    check(await resume.isVisible() && await link.getAttribute('href') === '#' + exercises[0], 'returning to Workshop restores the exact shortcut');
    await link.press('Enter');
    await page.waitForURL(url + '#' + exercises[0]);
    check(await page.locator('#' + exercises[0]).isVisible()
      && await page.locator('.move-hint[open], .move-check[open]').count() === 0, 'return link reaches the exercise without revealing an answer');

    const peer = await context.newPage();
    await peer.goto(url);
    const last = exercises.at(-1);
    await hint(peer, exercises.length - 1).click();
    await page.waitForFunction(id => document.getElementById('workshopResumeLink').getAttribute('href') === '#' + id, last);
    check(await stored() === last, 'opening in another tab updates the shortcut');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
        check(await resume.evaluate(el => {
          const [link, clear] = Array.from(el.querySelectorAll('a, button'), node => node.getBoundingClientRect());
          return [link, clear].every(r => r.height >= 44 && r.width >= 44 && r.left >= 0 && r.right <= innerWidth)
            && clear.left >= link.right && document.documentElement.scrollWidth <= innerWidth;
        }), 'return and clear controls fit at ' + width + '/' + theme);
        layouts++;
      }
    }
    await clear.press('Enter');
    check(await resume.isHidden() && await stored() === null, 'forget removes only the Workshop shortcut');
    check(await page.locator('.guide-contents summary').evaluate(el => el === document.activeElement), 'forget keeps keyboard focus on the contents');
    await peer.locator('#workshopResume').waitFor({ state: 'hidden' });
    check(await peer.locator('#workshopResumeLink').getAttribute('href') === null, 'clearing propagates to the other tab');
    await page.reload();
    check(await resume.isHidden() && await stored() === null, 'cleared shortcut stays gone after reload');
    for (const invalid of ['try-a-variation', 'https://example.invalid/#x']) {
      await page.evaluate(({ key, invalid }) => localStorage.setItem(key, invalid), { key, invalid });
      await page.reload();
      check(await resume.isHidden() && await page.locator('#workshopResumeLink').getAttribute('href') === null, 'ignores unknown saved value ' + invalid);
    }
    await page.evaluate(key => localStorage.removeItem(key), key);
    check(await page.evaluate(() => localStorage.getItem('hotgamesLastPractice') === '{"game":"blockzzle","question":2}'
      && localStorage.getItem('likedGames') === '["daysudoku"]'
      && localStorage.getItem('recentGames') === '["ringzzle"]'), 'guide bookmark, saved games and recent games are unchanged');
    check(errors.length === 0, 'no application runtime errors');

    blockedContext = await browser.newContext();
    await blockedContext.route(/google-analytics|googletagmanager|cloudflareinsights/, suppress);
    await blockedContext.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Denied', 'SecurityError'); } });
    });
    const blocked = await blockedContext.newPage();
    await blocked.goto(url);
    await hint(blocked, 0).click();
    check(await blocked.locator('#workshopResume').isHidden() && await blocked.locator('.move-hint').first().locator('p').isVisible(), 'blocking storage leaves native hints usable');
    plainContext = await browser.newContext({ javaScriptEnabled: false });
    const plain = await plainContext.newPage();
    await plain.goto(url);
    await answer(plain, 0).click();
    check(await plain.locator('#workshopResume').isHidden() && await plain.locator('.move-check').first().locator('strong').isVisible(), 'no-JS keeps native answers and hides the shortcut');
    return { engine: browser.browserType().name(), passed, layouts };
  } finally {
    if (plainContext) await plainContext.close();
    if (blockedContext) await blockedContext.close();
    await context.close();
  }
}
