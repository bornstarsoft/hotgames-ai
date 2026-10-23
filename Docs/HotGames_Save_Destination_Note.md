# Guide Save Destination

- Work ID: HOTGAMES-SAVE-DESTINATION
- Date: 2026-10-24 (Asia/Seoul)
- Repository: /Users/seongjinkim/BornStarSoft_Publishing/github_hugo/hotgames-ai
- Baseline: clean main 25121b8, matching origin/main after fetch; no owner WIP or other active writer.
- Approval: modest return-visit improvement, simple homepage, validation and deployment through the existing GitHub exception. No cache operations.

## Change

Successful guide saves and successful Undo now offer a normal same-tab `Saved games` link to `/?view=saved`. The notification stays available until dismissed or superseded, so the destination cannot disappear while someone is reaching it by keyboard. Removal retains its existing Undo; failed saves do not show a success destination.

The existing dismiss button and Escape within the notification return focus to the initiating save control. If another tab removes the saved game, or a restored page reads an updated collection, the outdated success notification closes. This does not steal focus from someone reading elsewhere. Only real localStorage events refresh saved controls; sessionStorage and missing storage areas are ignored.

The message and actions use two rows with existing guide styles. There are no new homepage sections, stylesheets, images, routes, game facts, storage keys, dependencies, external scripts, analytics, ads, login, backend or rankings. Reading or opening Saved games is not recorded as play. Existing game repositories and game content are untouched.

## Validation

- New CLI suite: tools/check_save_destination.js. Baseline build fails at `successful save offers destination`, as expected.
- Coverage: directory plus three guides, native Saved navigation and Back, keyboard activation and Escape, successful Undo, persistent actionable feedback, pointer dismissal, real cross-tab removal/reset, synthetic restored-page events, storage-area isolation, blocked reads, failed writes and JavaScript-disabled Play links.
- Layout coverage: 320/390/768/1440px, light/dark themes, visible controls at least 44px, no control overlap or horizontal overflow.
- Strict isolated Hugo --gc --minify --printPathWarnings --panicOnWarning passes with 128 pages, 7 aliases and four verified stylesheet hashes. Generated files remain outside the repository.
- Output comparison against baseline changes only four guide HTML files. Homepage, sitemap, content, assets and all stylesheets are byte-identical.
- PASS: final Chrome and WebKit each 1061 assertions / 208 layout cases: destination 123/32, theme 114/32, practice 201/48, tip links 274/24, guide context 141/24, guide return 208/48. Node test syntax, eight generated inline scripts and git diff --check also pass.
- PASS: screenshots inspected at 320px light (DaySudoku) and 1440px dark (Ringzzle). Two-row feedback keeps destination and dismiss together on the narrow viewport without a stylesheet change.
- All tests use independent profiles. Existing analytics is suppressed in suites and game launches in regression tests are mocked. No owner data or actual remote gameplay is used.
- Physical-device private browsing, screen readers and exhaustive native back-forward-cache coverage: NOT_RUN. Retention or revenue impact is not measured.

## Deployment

- Pre-release ordinary-domain check: previous guide theme suite passed on https://hotgames.ai/ (Chrome: 114 assertions / 32 layouts). This resolves the previous guide-theme mismatch for this observed session, not every prior homepage check or every edge.
- Source commit 6deccdb4625257ed4d1e06159ff85e3a5cd7370c pushed normally to GitHub main.
- Final Cloudflare check 120564342706: Deployed successfully (2026-10-24 02:43:17 KST). Initial Building check 120564094087 was superseded; the commit checks page confirms success and source SHA.
- Deployment: e3f36815-8001-4b02-b817-3ca266e79420, https://e3f36815.hotgames-ai.pages.dev/.
- Deployed QA PASS: Chrome on the unique deployment and WebKit on https://hotgames-ai.pages.dev/ each pass destination 123 assertions / 32 layouts.
- Prior normal-domain homepage search suite also passes in Chrome (100/24); paired exercises observed on all three guides. Earlier rollout observations are historical, not current universal failures.
- Ordinary-domain acceptance NOT PASS at 02:45-02:46 KST: WebKit initially showed no destination on any guide. Chrome briefly showed it on all three details but not /games/. Final normal-URL inspections in both engines showed the previous markup on all four. Delivery is inconsistent; no complete custom-domain rollout claim.
- Read-only normal DaySudoku headers: HTTP 200, cf-cache-status HIT, Age 723, Last-Modified Fri, 23 Oct 2026 17:33:46 GMT; Cache-Control public, max-age=0, must-revalidate. This documents an observed older cached response, not all edges or the complete rule cause.
- No purge, cache rule/header change, bypass query or force push.
- Task servers and browser profiles stopped; existing watch server untouched. Browser artifacts moved outside the repository. Final documentation rebuild must remain byte-identical to the verified application output.

Next single check: verify save -> Saved games -> Back on all four normal-domain guides without cache manipulation before declaring full visitor rollout.
