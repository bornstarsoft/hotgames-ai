# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-TIP-LINKS; guide tip links and validated GitHub deployment; main; 2026-10-23)

- Phase: release preparation; implementation and local QA DONE; push and deployment pending.
- Work ID / last AI: HOTGAMES-TIP-LINKS / CODEX (2026-10-23).
- Start: clean main bc35659, matching origin/main after fetch; no other writer or owner WIP.
- Owner approval: useful content and return-visit improvement, simple homepage, validation and deployment. Existing GitHub exception retained; cache operations excluded.
- Scope: copy canonical links to three existing useful sections in each game guide; honest fallback and independent live feedback. No new data or route.
- Main remains simple: homepage HTML and sitemap byte-identical to preceding release build. Existing game copy, assets and guide CSS unchanged.
- QA PASS: strict isolated Hugo --gc --minify, Node syntax and Git hygiene; 128 pages / 7 aliases / four verified style hashes.
- Browser QA PASS: Chrome and WebKit each 584 assertions / 96 layouts (tip links 274/24, guide-return 208/48, move-checks 102/24). Mobile/desktop screenshots inspected. Clipboard and external Play mocked in isolated QA only.
- Source/QA detail: Docs/HotGames_Tip_Links_Note.md and tools/check_tip_links.js; application changes only in layouts/games/baseof.html and single.html.
- Previous release: source 14e9040, verification bc35659; ordinary root consistency limitation in Docs/HotGames_Collection_Focus_Note.md.
- DONE / HEAD: implementation and local QA; source awaiting commit, use Git for WIP.
- Deployment / ordinary-domain acceptance: pending.
- BLOCKER: none for source/build. Physical mobile clipboard, screen-reader and business impact NOT_RUN. Cache operations excluded.
- NEXT_SINGLE_TASK: normal GitHub push, verify Pages and ordinary-domain guide tip links without cache operations.
- Existing watch server 1316 untouched; isolated QA server 1317 and task browser profiles active for release checks.
