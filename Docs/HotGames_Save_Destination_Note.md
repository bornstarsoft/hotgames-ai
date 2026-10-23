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
- Final commit, Cloudflare check and normal-domain acceptance: pending. Push success alone is not treated as deployment evidence.
- No purge, cache rule/header change, bypass query or force push.
