# Saved Game Removal Recovery

- Work ID: HOTGAMES-SAVE-UNDO
- Date: 2026-10-23 (Asia/Seoul)
- Start: clean main at 6ae9bda, matching origin/main after fetch.
- Owner scope: one modest return-visit improvement, unchanged homepage layout, validation and production deployment through the existing GitHub exception.
- Owner update: leave Cloudflare cache settings and purge operations alone. Deployment verification must distinguish Pages build success from custom-domain cache freshness.

## Change

- Add Undo to individual saved-game removal on the homepage, /games/, and the three puzzle detail pages.
- Restore only the removed game into the current collection, preserving other-tab additions and removals. Keep existing likedGames storage and cross-tab synchronization.
- Keep actionable notifications available until dismissed or superseded by the next action. Add a labeled close icon and at least 44-by-44-pixel action targets.
- Return keyboard focus to the home heading or originating guide save control when an action disappears. Hidden home notifications are no longer keyboard-focusable.
- Guide restore failures report the error and remain retryable. Homepage session-only restoration is explicitly labeled when persistence fails.
- No new homepage section, game content, route, dependency, tracking, account, backend, iframe or game repository changes. Existing images, play links and recent-game behavior are retained.

## Validation

- Strict isolated Hugo build and Git hygiene: PASS via ./tools/check_site.sh (includes --gc --minify --panicOnWarning and git diff --check). Output remains outside the repository.
- Chrome and WebKit mobile emulation: 49 assertions PASS per engine, including 40 layout combinations each across five routes, four widths (320/390/768/1440), and light/dark themes (80 combinations total).
- Initial Chrome cross-tab run timed out on a background-tab action. The complete rerun with explicit test-tab foregrounding passed; no application change was required for this test-harness issue.
- Production deployment: pending final result below.
- Browser tests cover remove/Undo, persistence, keyboard focus, dismiss, multiple tabs, unrelated IDs, clear-all regression, failed writes and retry, session-only fallback, Back navigation, action replacement and no-JavaScript native links.
- Additional Chrome mobile touch checks PASS: tap save/remove/Undo, native Play link opening a mocked external game, and the resulting Recently opened card. No actual game session was launched.
- Inspected mobile screenshots of homepage and DaySudoku detail notifications. No horizontal overflow or missing tested cover images.
- Tests use isolated browser storage and suppress existing analytics. No gameplay or retention-rate claim is inferred from these tests. Physical-device testing: NOT_RUN.

## Manual Regression

1. Save DaySudoku, open Saved, remove it, then use Undo. Reload and confirm it remains saved.
2. Repeat on /games/ and each detail page. Dismiss must leave the game removed; Undo must restore it.
3. While Undo is available, add a different game and remove another in a second tab. Undo must restore only its own game and synchronize both tabs.
4. Check Enter/Space, focus after Undo/dismiss, 320px mobile layout, and light/dark themes.
5. In an isolated browser, simulate a failed likedGames write. Guide Undo must report failure and allow retry; homepage must label temporary restoration accurately.

## Release

- Pending verified source commit and Cloudflare Pages deployment.
- Do not purge cache or change cache rules for this task.
