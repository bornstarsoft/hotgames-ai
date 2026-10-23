# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification; implementation, local QA, normal push and Pages deployment DONE. Ordinary-domain acceptance is incomplete: old root response observed.
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
- DONE / HEAD: source f9874b4be47f672c25f5a7bee01ddd236e1e112b pushed normally. This documentation follow-up records results; use Git for its containing commit and WIP.
- Deployment PASS: GitHub check 120427746135, deployment 50d2bf12-9829-4e19-8ae4-527727c8b4ab; https://50d2bf12.hotgames-ai.pages.dev/.
- Deployed QA PASS: Chrome unique deployment and WebKit production Pages each pass search input 100 assertions / 24 layouts.
- Ordinary-domain acceptance NOT PASS (22:03 KST): normal https://hotgames.ai/ response in both engines still has 34px clear button, filters intermediate composition and blurs on Escape. This is the prior behavior, not the verified Pages version. Do not claim the improvement is visible to all production-domain visitors.
- BLOCKER: ordinary root response remains older than deployed Pages. Owner excludes cache operations; no purge, rule/header changes or bypass performed. Physical mobile/OS IME, privacy-mode and screen-reader validation, business impact NOT_RUN.
- NEXT_SINGLE_TASK: verify ordinary-domain root serves the deployed search behavior without cache manipulation; retain physical IME checks as a later manual QA item.
- Existing watch server 1316 untouched; isolated QA server 1317 and both task browser profiles stopped.
