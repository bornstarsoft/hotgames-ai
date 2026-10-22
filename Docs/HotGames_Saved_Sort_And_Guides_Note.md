# Saved Sorting and Practical Puzzle Guides

- Work ID: HOTGAMES-RETURN-GUIDES
- Date: 2026-10-23 (Asia/Seoul)
- Starting state: clean main at 86fdfd3, matching origin/main after fetch; no other active writer.
- Owner scope: relevant content and a modest return-visit improvement, keep the homepage simple, validate and deploy. Existing project-specific GitHub exception retained. Cache work remains excluded.

## Returning Users

- Add a native select in the full Saved view only: Recently saved (default) or Name A-Z.
- Remember the choice in the same browser using savedGameOrder. No account, server storage or tracking is added.
- Sort a copy of the saved IDs, leaving likedGames and its insertion order untouched. Default newest-first agrees with the existing compact homepage preview.
- Keep homepage previews limited to the two most recently saved games, regardless of the full list's alphabetical preference. Recently opened remains ordered by recency.
- Preserve search, category filters, individual Undo, clear-all Undo and cross-tab updates. Restore-page refresh includes the preference; invalid data falls back to newest-first. Failed persistence is explicitly labeled as temporary for this visit.
- Keep the select keyboard-accessible and 44px high in Chrome and WebKit. Style its appearance with the existing icon library without replacing native selection semantics.

## Useful Content

- Add three concise starting tips to each existing puzzle detail page, with an official reference link. No extra landing page or duplicate article.
- Set lastmod on the changed guide pages and directory to the actual content-update time with an explicit +09:00 offset, retaining their original publication dates and routes. Date-only local timestamps were found to be future-dated in UTC and were corrected before release; page and alias counts must remain unchanged.
- Blockzzle: line clears and preserving usable space for later pieces.
- Ringzzle: ring-size slots, color lines and the same-color three-size Color Burst rule.
- DaySudoku: row/column/box rules and finding a certain move before guessing.
- The live DaySudoku homepage and rules now describe ordinary daily Sudoku, not the earlier Key9-first flow. Update the game card, comparison, FAQ, metadata and cross-recommendations accordingly. Preserve the old #what-key9-means fragment on the renamed rules heading so existing links still resolve. Historical docs remain historical.

## Source Check

Read the rendered public HTML on 2026-10-23; no game source was imported or changed:

- https://daysudoku.com/ and https://daysudoku.com/how-to-play/
- https://blockzzle.com/block-puzzle/
- https://ringzzle.com/how-to-play/

Tips are editorial suggestions based on those rules, not guarantees of scores or benefits. No popularity, ranking, traffic, ratings, cognitive/health claims, DaySudoku leaderboard/account/app features, or new challenge mode were added.

## Validation and Release

- Strict isolated Hugo build (--gc --minify --panicOnWarning) and Git hygiene passed; 128 pages, 11 paginator pages, 7 aliases. No generated output is added to the repo.
- Extend the existing check_site.sh with required-route output checks for home, /games/, its existing page/1 alias, and the three details. This catches Hugo's otherwise silent future-content omission without adding dependencies or another build tool.
- Initial Chrome test incorrectly treated "zzle" as matching only two names, although it also matches "puzzle" in existing search metadata. Corrected the test expectation; search behavior was not changed.
- WebKit initially rendered the native select at 21px despite min-height. Fixed its styled appearance and explicit height to provide a consistent 44px target. Final reruns: Chrome and WebKit each PASS 56 assertions and 32 responsive/theme combinations (64 total). Mobile screenshots inspected.
- Additional Chrome checks passed: all 24 catalog games sorted correctly, category filtering retained preference, legacy DaySudoku fragment resolved, and content remained accessible with JavaScript disabled.
- Tests run in isolated storage with existing analytics suppressed. No real gameplay or retention/business lift is inferred. Physical-device testing: NOT_RUN.
- Final source commit: 2e0d6c49b481d4c2f33a25af0bbd807da97a3ac5, Improve saved game sorting and puzzle guides; normally pushed to GitHub main.
- Cloudflare Pages check completed successfully, deployment b77c5945-81c1-4d96-9098-5b2ef5645a11. Verified around 2026-10-23 00:53 KST.
- Deployed URL: https://b77c5945.hotgames-ai.pages.dev/. Five affected routes returned HTTP 200 with new content. Mobile remembered sorting, 44px select, remove/Undo, all three strategies, exact Play targets, legacy fragment and updated sitemap PASS. Screenshot inspected.
- Final generated sitemap has 126 unique URLs; all four updated guide/directory entries use 2026-10-23T00:50:06+09:00. Existing page/alias counts remain 128/7.
- All five normal hotgames.ai URLs returned HTTP 200 but earlier HTML during acceptance. Normal-domain freshness is not confirmed. Owner-directed cache exclusion is preserved: no purge, rules change, credential handling or outstanding login request.
- No implementation/Git blocker remains. Physical-device acceptance can be checked when the normal domain serves the new HTML; do not purge or alter cache rules for this task.

## Manual Regression

1. Save several games and open Saved. Confirm newest-first, choose Name A-Z, reload, and confirm the choice persists.
2. Search and filter within Saved; remove/Undo and clear/Undo. Confirm the selected order is retained and games are not lost.
3. Change sorting in another tab. Both Saved views should update, but Discover should still show the newest two saved games.
4. Test 320px and 390px layouts, light/dark, keyboard focus, failed browser storage, and Back navigation.
5. Read each starting strategy, follow the official guide links, and confirm native Play links still target the separate game sites.
