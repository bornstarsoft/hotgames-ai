# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification; implementation, local QA, normal GitHub push and Pages deployment DONE; ordinary-domain acceptance PARTIAL.
- Work ID / last AI: HOTGAMES-COLLECTION-FOCUS / CODEX (2026-10-23).
- Start: clean main 8b8b528, matching origin/main after fetch; no other writer or owner WIP.
- Owner approval: useful content and return-visit improvement, simple homepage, validation and deployment. Existing GitHub exception retained; cache operations excluded.
- Scope: preserve collection focus through removal, Undo and re-render; 44px collection save controls; notification scroll clearance. No new data, copy or route.
- Main remains simple: no new section, card or menu; compact previews still hide save buttons. Existing game content and assets unchanged.
- QA PASS: strict isolated Hugo --gc --minify, Node syntax and Git hygiene; 128 pages / 7 aliases / four verified style hashes.
- Browser QA PASS: Chrome and WebKit each 734 assertions / 140 viewport-theme-view layouts across all eight suites. Mobile/desktop screenshots inspected. External Play intercepted in isolated QA only.
- Source/QA detail: Docs/HotGames_Collection_Focus_Note.md and tools/check_collection_focus.js; application changes only in layouts/index.html.
- Previous release: source 39d6077, verification 8b8b528; previous domain consistency limitation in Docs/HotGames_Move_Checks_Note.md.
- DONE / HEAD: source 14e9040224c4dac2bf765f398114dcb621aaf30a pushed normally. This documentation follow-up records evidence; use Git for its containing commit and WIP.
- Deployment PASS: GitHub Cloudflare check 120411224542; 04cbc75f-8784-4a30-8ba8-0b4d7ac0637b, https://04cbc75f.hotgames-ai.pages.dev/.
- Deployed QA PASS: Chrome unique deployment and WebKit production Pages each 145 assertions / 16 layouts.
- Ordinary domain PARTIAL (21:24-21:25 KST): Chrome direct Saved has 44px targets and new focus behavior; root home remains old, and WebKit home-to-Saved retains 36px/H1 behavior. Normal /games/ now has three move-check links. No full root-to-collection acceptance claim.
- BLOCKER: none for source/build/Pages; ordinary root consistency pending. Physical-device/screen-reader and business impact NOT_RUN. Cache operations excluded.
- NEXT_SINGLE_TASK: verify ordinary root-to-Saved/Recent focus continuity when updated HTML is served, including physical mobile screen-reader confirmation.
- Existing watch server 1316 untouched; isolated QA server 1317 and task browser profiles stopped.
