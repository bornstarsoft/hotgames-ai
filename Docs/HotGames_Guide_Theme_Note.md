# Guide Theme Continuity

- Work ID: HOTGAMES-GUIDE-THEME
- Date: 2026-10-23 (Asia/Seoul)
- Repository: /Users/seongjinkim/BornStarSoft_Publishing/github_hugo/hotgames-ai
- Baseline: clean main 1386a09, matching origin/main after fetch; no other writer or owner WIP.
- Approval: incremental return-visit improvements, simple homepage, validation and deployment using the project's existing GitHub exception. Cache operations excluded.

## Change

The guide layout now re-reads the current theme when a page is restored. Actual localStorage changes to the theme, including deletion or a clear, update the guide's appearance and its theme button label/icon. sessionStorage, missing storage areas and unrelated keys are ignored. Synchronization reads current storage instead of replaying a possibly stale event payload and does not write the preference back.

If a theme write fails, the selected theme remains in memory for that page. Restoration and unrelated events do not discard it. An explicit localStorage theme change/reset supersedes it. A blocked read preserves the current appearance. This does not promise persistence across a reload or tab close when browser storage is unavailable.

Only layouts/games/baseof.html changes runtime behavior. No new control, route, storage key, dependency, external script, backend, login, analytics, ad, email capture, gameplay feature or unsupported claim. Main HTML and game content remain unchanged. No other game repository was modified.

## Validation

- Baseline: tools/check_guide_theme.js fails against 1386a09 output at /games/ restored page reads current preference.
- Fixed: Chrome and WebKit each pass theme 114 assertions / 32 layout cases across /games/ and the three detail pages.
- Theme coverage: reload and simulated persisted pageshow, real homepage-to-guide tab synchronization, native Back, key/area isolation, removeItem/clear, invalid value normalization, label/icon/focus, read-blocked and write-blocked storage.
- The simulated storage resets operate only on independent QA profiles. Preference changes preserve saved/recent arrays; no owner data is used.
- Regression suites per engine: practice 201/48, tip links 274/24, guide context 141/24 and guide return 208/48. Total including theme: 938 assertions / 176 layout cases per engine.
- ./tools/check_site.sh PASS: warning-free isolated Hugo --gc --minify, 128 pages, 7 aliases and four verified stylesheet hashes. Node test syntax and generated guide inline-script parsing PASS.
- git diff --check PASS; public/, resources/_gen/ and node_modules/ are not tracked or staged.
- Complete output comparison: only four guide HTML files differ. Homepage, sitemap, images and stylesheets are byte-identical to the baseline.
- Screenshots inspected: /private/tmp/hg-guide-theme-mobile.png (320px light) and /private/tmp/hg-guide-theme-desktop.png (1440px dark). Automated layout cases also cover 390/768px and both themes.
- Physical-device private browsing, actual OS back-forward-cache coverage and screen-reader testing: NOT_RUN. Browser restore handlers are tested with synthetic persisted events in addition to ordinary navigation. Business/retention impact is not measured.

## Read-Only Deployment Diagnosis

At 22:22 KST, normal https://hotgames.ai/games/daysudoku/ returned the previous single-exercise HTML with cf-cache-status HIT, Age 2037 and Last-Modified Fri, 23 Oct 2026 12:48:09 GMT. Its Cache-Control was public, max-age=0, must-revalidate. The corresponding https://hotgames-ai.pages.dev/games/daysudoku/ returned the paired exercises.

This confirms an observed older cached response, not a failed GitHub push. It does not establish consistency across all edges or diagnose every rule. No purge, bypass header/query, cache rule or response-header change was performed, and no credentials were accessed.

## Deployment

- Source f135b592cf08bcb27e853e840efef25d71f0e3c7 pushed normally to GitHub main.
- GitHub Cloudflare check 120441439757: Deployed successfully.
- Deployment edc506ca-8a9a-4f30-b535-9643e41e982b: https://edc506ca.hotgames-ai.pages.dev/.
- Post-deploy PASS: Chrome unique deployment and WebKit https://hotgames-ai.pages.dev/ each pass the theme suite (114 assertions / 32 layouts).
- Ordinary-domain acceptance NOT PASS at 22:33 KST: both engines show previous theme behavior on /games/ and all three detail pages. Simulated restored-page preference changes remain unapplied, and a sessionStorage theme event incorrectly changes appearance. Each detail page still has one exercise rather than the previously deployed pair.
- No general live-domain rollout claim; earlier acceptance remains separate from Pages build success. See Docs/HotGames_Practice_Pairs_Note.md and Docs/HotGames_Search_Input_Note.md.
- No purge, cache-rule/header change, bypass or force push. Isolated server and both browser sessions stopped; existing watch server untouched.

Next single check: verify normal-domain guide theme behavior matches Pages, without cache manipulation, before treating the release as fully visible to visitors.
