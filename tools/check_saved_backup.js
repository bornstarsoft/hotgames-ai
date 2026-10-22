// Run through Playwright CLI in an isolated profile on the desired origin.
async (page) => {
  const root = new URL(page.url()).origin;
  const context = page.context();
  const checks = [];
  const errors = [];
  const check = (ok, name) => { if (!ok) throw new Error(name); checks.push(name); };
  const onError = error => errors.push(error.message);
  const analytics = /google-analytics|googletagmanager|cloudflareinsights/;
  const suppress = route => route.fulfill({ body: '', contentType: 'application/javascript' });
  const payload = ids => JSON.stringify({ format: 'hotgames-saved-games', version: 1, savedGames: ids });
  const upload = async (target, data) => {
    await target.locator('#savedBackupFile').setInputFiles({ name: 'saved.json', mimeType: 'application/json', buffer: Buffer.from(data) });
    await target.waitForFunction(() => !document.getElementById('savedBackup').hasAttribute('aria-busy'));
  };
  const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('likedGames')));
  const status = () => page.locator('#savedBackupStatus').textContent();
  // The CLI pauses scripts at native dialogs; test decisions here, then verify native dialogs separately.
  const confirmation = (target, accepted) => target.evaluate(value => {
    window.confirm = message => { window.backupConfirmation = message; return value; };
  }, accepted);
  page.on('pageerror', onError);
  await context.route(analytics, suppress);
  let other;
  let blocked;
  let noJS;
  let layouts = 0;
  try {
    await page.goto(root + '/');
    await page.evaluate(() => {
      localStorage.setItem('likedGames', '["blockzzle","daysudoku"]');
      localStorage.setItem('recentGames', '["daysudoku"]');
      localStorage.setItem('savedGameOrder', '"name"');
    });
    await page.reload();
    check(await page.locator('#savedBackup').isHidden(), 'no backup tools on Discover');
    await page.goto(root + '/?view=recent');
    check(await page.locator('#savedBackup').isHidden(), 'no backup tools in Recent');
    await page.goto(root + '/?view=saved&q=Ringzzle');
    check(await page.locator('#savedBackup').isVisible(), 'tools available even with zero matching results');
    await page.evaluate(() => {
      const original = URL.createObjectURL;
      URL.createObjectURL = function(blob) { window.backupText = blob.text(); return original.call(this, blob); };
    });
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export saved game list', exact: true }).click();
    const download = await downloadPromise;
    check(download.suggestedFilename() === 'hotgames-saved-games.json', 'native JSON download');
    const exported = await page.evaluate(() => window.backupText);
    check(exported.trim() === JSON.stringify(JSON.parse(payload(['blockzzle', 'daysudoku'])), null, 2), 'export includes entire saved list, no history or settings');
    check((await status()).includes('Game progress is not included'), 'export does not imply game progress');

    await confirmation(page, true);
    await upload(page, payload(['ringzzle', 'blockzzle', 'ringzzle', 'not-in-catalog', '<script>']));
    const message = await page.evaluate(() => window.backupConfirmation);
    check(message.includes('Add 1 game') && message.includes('2 unavailable games'), 'confirmation counts unique new and unavailable games');
    check(JSON.stringify(await saved()) === '["blockzzle","daysudoku","ringzzle"]', 'merge preserves original order and deduplicates');
    check(await page.locator('#favoritesGrid [data-game-id="ringzzle"]').count() === 1, 'imported game available in current search');
    check(new URL(page.url()).search === '?view=saved&q=Ringzzle', 'import keeps search and view');
    check(await page.evaluate(() => localStorage.getItem('recentGames') === '["daysudoku"]' && localStorage.getItem('savedGameOrder') === '"name"'), 'history and sort preference unchanged');
    await page.locator('#toastUndo').click();
    check(JSON.stringify(await saved()) === '["blockzzle","daysudoku"]', 'Undo removes only imported additions');
    check(await status() === 'Import undone.', 'Undo updates backup feedback');

    await confirmation(page, false);
    await upload(page, payload(['ringzzle']));
    check(JSON.stringify(await saved()) === '["blockzzle","daysudoku"]' && (await status()).includes('canceled'), 'cancel preserves list');
    await upload(page, exported);
    check((await status()).includes('already saved'), 'round-trip backup recognizes existing games');
    for (const [label, text] of [
      ['broken JSON', '{'], ['wrong format', '{"format":"other","version":1,"savedGames":["ringzzle"]}'],
      ['future version', '{"format":"hotgames-saved-games","version":2,"savedGames":["ringzzle"]}'],
      ['invalid IDs', payload(['ringzzle', null])], ['oversize', ' '.repeat(32769)],
      ['too many IDs', payload(Array(1001).fill('ringzzle'))], ['non-array', payload({ ringzzle: true })]
    ]) {
      await upload(page, text);
      check((await status()).startsWith('Import failed.') && JSON.stringify(await saved()) === '["blockzzle","daysudoku"]', label + ' rejected without partial writes');
    }
    await upload(page, payload([]));
    check((await status()).includes('no saved games'), 'empty backup honest feedback');
    await upload(page, payload(['https://evil.invalid/', '__proto__', '<img src=x onerror=alert(1)>']));
    check((await status()).includes('No games') && await page.locator('#savedBackupStatus img, #savedBackupStatus script').count() === 0, 'unknown IDs never become links or HTML');

    other = await context.newPage();
    await other.goto(root + '/');
    const extra = await other.locator('.source-section .game-card:not([data-guide-help])').first().getAttribute('data-game-id');
    await other.evaluate(id => localStorage.setItem('likedGames', JSON.stringify(['blockzzle', 'daysudoku', id])), extra);
    await page.waitForFunction(id => document.querySelector('#favoritesGrid [data-game-id="' + id + '"]') !== null || document.getElementById('savedCount').textContent === '3', extra);
    await confirmation(page, true);
    await upload(page, payload(['ringzzle']));
    check((await saved()).includes(extra), 'import preserves other-tab additions');
    await page.locator('#toastUndo').click();
    check((await saved()).includes(extra) && !(await saved()).includes('ringzzle'), 'Undo preserves other-tab additions');
    await page.reload();
    check((await saved()).includes(extra), 'merged saves persist on reload');

    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
        await upload(page, '{');
        check(await page.locator('#savedBackup').evaluate(row => {
          const buttons = [...row.querySelectorAll('button')].map(el => el.getBoundingClientRect());
          return document.documentElement.scrollWidth <= innerWidth && buttons.every(r => r.width >= 44 && r.height >= 44 && r.left >= 0 && r.right <= innerWidth) && buttons[0].right <= buttons[1].left;
        }), 'backup controls and error fit ' + width + '/' + theme);
        layouts++;
      }
    }
    await page.evaluate(() => localStorage.setItem('likedGames', '[]'));
    await page.goto(root + '/?view=saved');
    check(await page.locator('#exportSaved').isDisabled() && await page.locator('#importSaved').isEnabled(), 'empty list can import but not export');
    await page.locator('#importSaved').focus();
    check(await page.locator('#importSaved').evaluate(el => el === document.activeElement), 'import action keyboard focus');
    await confirmation(page, true);
    await upload(page, exported);
    check(JSON.stringify(await saved()) === '["blockzzle","daysudoku"]', 'exported file restores into empty list');

    blocked = await context.browser().newContext({ viewport: { width: 390, height: 844 } });
    await blocked.route(analytics, suppress);
    await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
    const privatePage = await blocked.newPage();
    await privatePage.goto(root + '/?view=saved');
    await confirmation(privatePage, true);
    await upload(privatePage, payload(['ringzzle']));
    check((await privatePage.locator('#savedBackupStatus').textContent()).includes('for this visit only'), 'blocked storage feedback is honest');
    check(await privatePage.locator('#favoritesGrid [data-game-id="ringzzle"]').count() === 1, 'session-only import remains usable');
    await privatePage.locator('#toastUndo').click();
    check(await privatePage.locator('#exportSaved').isDisabled(), 'session-only Undo restores empty list');
    await blocked.close(); blocked = undefined;

    noJS = await context.browser().newContext({ javaScriptEnabled: false });
    const plain = await noJS.newPage();
    await plain.goto(root + '/?view=saved');
    check(await plain.locator('#savedBackup').isHidden(), 'no dead backup controls without JavaScript');
    await noJS.close(); noJS = undefined;
    check(errors.length === 0, 'no application runtime errors');
    return { engine: context.browser().browserType().name(), passed: checks.length, layouts, checks };
  } finally {
    if (other) await other.close();
    if (blocked) await blocked.close();
    if (noJS) await noJS.close();
    page.off('pageerror', onError);
    await context.unroute(analytics, suppress);
  }
}
