# Guide Shortcuts

- Work ID: HOTGAMES-GUIDE-SHORTCUTS
- Date: 2026-10-23 (KST)
- Starting state: clean main at 78e6852, matching origin/main after fetch; ACTIVE_WRITER was NONE.
- Approved scope: relevant content and a modest returning-user improvement, validation and deployment using the existing project-specific GitHub exception. No cache operations.

## Changes

- Existing game detail pages now have a collapsed native "In this guide" contents disclosure before the illustration. Section links come from Hugo's built-in TableOfContents, not a second manually maintained heading list. Existing fragment IDs, including DaySudoku's legacy #what-key9-means, remain intact.
- The /games/ directory adds a Starting tips jump and three concise next-move summaries linking directly to each game's existing starting strategy. Text is stored with its game page and summarizes the already verified rules and advice; no new game capabilities are claimed.
- The build fails if a configured starting tip loses its section target. No new JavaScript, storage key, dependency or build tool is required. Links can be revisited using ordinary browser history and bookmarks, including without JavaScript.
- Homepage HTML and controls, Saved/Recently opened behavior, all Play targets and existing artwork are unchanged. No new page or duplicated long guide is introduced.

## References

- Hugo's native contents API: https://gohugo.io/methods/page/tableofcontents/
- Existing reviewed content: content/games/daysudoku.md, content/games/blockzzle.md and content/games/ringzzle.md. Their official sources remain linked in each page; see the previous strategy and further-reading QA notes.

## Boundaries

Only the HotGames.ai repository is modified. No game source, iframe, backend, login, ads, analytics, popularity/ranking claim, cache change or generated output added. No measured retention or business lift is claimed.

## Validation And Release

- PASS: ./tools/check_site.sh, isolated hugo --gc --minify with warnings fatal, required output routes, git diff --check and generated-file hygiene. Build retains 128 pages and 7 aliases.
- PASS: Chrome (Pixel 7 profile) and WebKit (iPhone 13 profile) each passed 117 assertions including 56 layout/theme/disclosure combinations at 320, 390, 768 and 1440px. Native fragment navigation, heading targets, keyboard disclosure, Back/Forward, reload, saved/recent isolation and existing Save/Undo behavior checked. No application JavaScript errors.
- PASS: 26 additional no-JavaScript/sitemap checks; all three guides' disclosures and links work without scripts, 126 unique sitemap URLs and the pagination alias remain. Existing Play URLs and the old Sudoku fragment are preserved.
- PASS: mobile screenshots inspected in both engines. Contents links and disclosure summaries have at least 44px targets; no horizontal overflow. Existing illustration assets still render.
- Test environment: initial Chrome startup stalled; only that task-owned session was terminated, and a fresh isolated session completed successfully. Existing analytics requests were suppressed during scripted QA; no production user data was modified.
- Manual regression recipe: open /games/#starting-tips, follow each tip, open the contents with Enter, navigate to a section, then use Back/Forward and reload. Repeat with JavaScript disabled; confirm Saved and Recently opened do not change merely from reading.
- Physical-device testing and measured business outcomes: NOT_RUN.
- Release: pending normal GitHub push and Cloudflare Pages acceptance.
