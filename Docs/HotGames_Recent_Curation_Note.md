# Recent List Curation And Further Reading

- Work ID: HOTGAMES-RECENT-CURATION
- Date: 2026-10-23 (KST)
- Starting state: clean main at a9025e2, matching origin/main after fetch.
- Owner scope: relevant content, modest returning-user improvement, validation and production deployment through the existing GitHub exception. Cache work excluded.

## Changes

- Full Recently opened view allows removing one game with a labeled 44px icon button and Undo. Discover previews, Saved view and the source catalog gain no controls.
- Removal changes only recentGames, never Saved or game progress. Undo restores only that game in its original slot if history is otherwise unchanged. If another tab changed history, it is restored at the end so those edits retain their order. Reopening the game before Undo keeps its new position without duplication.
- History remains capped at six. If six newer games fill it before Undo, the restored game takes the sixth slot, preserving the five newest entries.
- Existing local-storage fallback, cross-tab refresh, keyboard focus and persistent Undo notification are reused. This is local browser history, not account sync or gameplay progress.
- Two concise official reading links added to each of the existing DaySudoku and Ringzzle guides. No homepage section or new thin page added. Blockzzle stays unchanged and distinct.

## Official Sources

HTTP 200 and guide contents checked on 2026-10-23 before adding the links:

- https://daysudoku.com/sudoku-tips/ : worked examples for a logical next move.
- https://daysudoku.com/sudoku-mistakes/ : rule conflicts and reviewing a doubtful entry.
- https://ringzzle.com/guides/keep-space-open/ : size slots and tray planning.
- https://ringzzle.com/guides/color-line-clears/ : mixed-size color matches and remaining rings.

## Boundaries

No other repository, game source, iframe, backend, account, login, ads, analytics, dependencies, generated output, cache settings or fake ranking/popularity claims added or changed. No measured retention or revenue improvement claimed.

## Validation And Release

- PASS: ./tools/check_site.sh, including isolated hugo --gc --minify --printPathWarnings --panicOnWarning, required route checks and git diff --check. 128 pages, 7 aliases; public/, resources/_gen/ and node_modules/ are not tracked or staged.
- PASS: Chrome (Pixel 7 profile) and WebKit (iPhone 13 profile), each 65 assertions and 24 responsive/theme combinations at 320, 390, 768 and 1440px. Removal, original-position Undo, concurrent history edits, reopened target, six-entry limit, filtering, last-item empty state, keyboard focus, Saved isolation/sorting/Undo, clear-all Undo and unavailable storage all checked.
- PASS: mobile screenshots inspected; removal targets are 44px, action controls do not overlap, existing illustrations render, and guide links wrap without horizontal overflow. Existing analytics requests suppressed in isolated browser QA.
- PASS: 17 additional sitemap and no-JavaScript assertions. All 126 unique sitemap URLs, updated detail lastmod, old Sudoku fragment, 24 catalog cards and all three exact Play destinations retained.
- Physical-device QA and business outcome measurements: NOT_RUN.
- Deployment verification: pending source push and Cloudflare Pages check.
