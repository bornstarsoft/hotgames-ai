# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-SEARCH-INPUT; composition-safe search and keyboard/touch recovery, QA and approved GitHub deployment; main; 2026-10-23)

- Phase: release preparation; implementation and local validation DONE, deployment pending.
- Work ID / last AI: HOTGAMES-SEARCH-INPUT / CODEX (2026-10-23).
- Start: clean main ac95ca0, matching origin/main after fetch; no other writer or owner WIP.
- Owner approval: useful return-visit improvement, simple homepage, validation and deployment. Existing project GitHub exception retained; cache operations excluded.
- Scope: keep committed search results during IME composition; protect composition from shortcuts; keep focus after Escape/clear; enlarge existing clear target to 44px. No new section, content claim, route or storage.
- QA PASS: strict isolated Hugo --gc --minify, generated inline-script and test syntax, git diff --check and generated-file hygiene; 128 pages / 7 aliases / four verified style hashes.
- Browser QA PASS: Chrome and WebKit each 665 assertions / 116 layout cases across eight suites. New search suite 100/24; collection search 70/16, focus 145/16, recency 45/8, storage 39/8, backup 45/8, share 80/12, guide context 141/24.
- Baseline reproduction: new search regression failed on ac95ca0 output because intermediate composition changed URL. Same test passes after fix.
- Visual QA PASS: 320px light Saved search and 1440px dark Discover search screenshots inspected; current image assets render. Full generated-tree comparison differs only in index.html; all game guides, sitemap and assets unchanged.
- Details: Docs/HotGames_Search_Input_Note.md; tools/check_search_input.js. Synthetic IME events are not a physical keyboard test.
- Previous release: source 710dce2, follow-up ac95ca0; Docs/HotGames_Guide_Return_Context_Note.md. Prior ordinary root consistency note remains in Docs/HotGames_Collection_Focus_Note.md.
- HEAD/WIP: use Git; intended changes only layouts/index.html, tools/check_search_input.js and these two documentation files.
- BLOCKER: none locally. Physical mobile/OS IME, privacy-mode and screen-reader validation, business impact NOT_RUN.
- NEXT_SINGLE_TASK: normal GitHub push, confirm Pages deployment and ordinary-domain search acceptance without cache operations.
- Existing watch server 1316 untouched; isolated QA server 1317 and task browser profiles currently running.
