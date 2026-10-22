# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-SAVED-RECENCY; recent-opened sorting in full Saved, QA and approved GitHub deployment; main; 2026-10-23)

- Phase: release preparation; saved recency sorting implemented and local QA complete; approved GitHub deployment next.
- Work ID / last AI: HOTGAMES-SAVED-RECENCY / CODEX (2026-10-23).
- Start: clean main 93f8e9c, matching origin/main after fetch; no other writer or owner WIP.
- Owner approval: useful content and return-visit improvement, simple homepage, validation and deployment. Existing GitHub exception retained; cache operations excluded.
- Scope: add Recently opened to the full Saved native sort menu; reuse existing six-entry recent history, newest-saved fallback, remembered preference and cross-tab updates without rewriting saved IDs/history.
- Main remains simple: no new section or card. Existing Play, Save, help, backup and compact previews unchanged.
- QA PASS: strict isolated Hugo --gc --minify, node syntax and Git hygiene; 128 pages / 7 aliases / four style hashes. Full output comparison differs only in index.html; all detail pages, sitemap and assets identical.
- Browser QA PASS: Chrome and WebKit each recency 45/8, storage isolation 39/8, search 70/16, backup 45/8, share 80/12 and guide-return 208/48 (487 assertions / 100 layouts). Mobile/desktop screenshots inspected. Play and sharing targets stubbed in isolated QA only.
- Source/QA detail: Docs/HotGames_Saved_Recency_Note.md and tools/check_saved_recency.js; existing regressions unchanged.
- Previous release: source c3ec512, verification 93f8e9c; details and ordinary-domain limitation in Docs/HotGames_Storage_Isolation_Note.md.
- DONE / HEAD: implementation complete, source uncommitted; use Git for WIP.
- Deployment: NOT_RUN for this work ID.
- BLOCKER: none locally. Ordinary-domain acceptance remains separate; physical-device native picker and measured business effects NOT_RUN. Cache operations excluded.
- NEXT_SINGLE_TASK: commit and deploy verified saved recency sorting, then validate deployed code and ordinary domain separately.
- Existing watch server 1316 untouched; isolated QA server 1317 and task browser sessions active.
