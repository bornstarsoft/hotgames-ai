# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-GUIDE-RETURN-CONTEXT; contextual guide return links and validated GitHub deployment; main; 2026-10-23)

- Phase: release preparation; implementation and local QA DONE; push and deployment pending.
- Work ID / last AI: HOTGAMES-GUIDE-RETURN-CONTEXT / CODEX (2026-10-23).
- Start: clean main 638c2e6, matching origin/main after fetch; no other writer or owner WIP.
- Owner approval: useful content and return-visit improvement, simple homepage, validation and deployment. Existing GitHub exception retained; cache operations excluded.
- Scope: existing guide return links preserve same-origin catalog view/category/query when referrer is available; safe original fallbacks. No new data, controls or route.
- Main remains simple: homepage HTML and sitemap byte-identical to preceding release build. Existing game copy, assets and guide CSS unchanged.
- QA PASS: strict isolated Hugo --gc --minify, Node syntax and Git hygiene; 128 pages / 7 aliases / four verified style hashes.
- Browser QA PASS: Chrome and WebKit each 725 assertions / 120 layouts (context return 141/24, guide-return 208/48, move-checks 102/24, tip links 274/24). Mobile/desktop screenshots inspected. Clipboard and external Play mocked in isolated QA only.
- Source/QA detail: Docs/HotGames_Guide_Return_Context_Note.md and tools/check_guide_context.js; application changes only in layouts/games/baseof.html and single.html.
- Previous release: source edec604, verification 638c2e6; prior root consistency note remains in Docs/HotGames_Collection_Focus_Note.md.
- DONE / HEAD: implementation and local QA; source awaiting commit, use Git for WIP.
- Deployment / ordinary-domain acceptance: pending.
- BLOCKER: none for source/build. Physical mobile privacy modes/screen-reader and business impact NOT_RUN. Cache operations excluded.
- NEXT_SINGLE_TASK: normal GitHub push, verify Pages and ordinary-domain guide round trips without cache operations.
- Existing watch server 1316 untouched; isolated QA server 1317 and task browser profiles active for release checks.
