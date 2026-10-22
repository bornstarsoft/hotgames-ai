# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-STORAGE-ISOLATION; protect temporary collections across unrelated tab changes, QA and approved GitHub deployment; main; 2026-10-23)

- Phase: release preparation; storage isolation implemented and local QA complete; approved GitHub deployment next.
- Work ID / last AI: HOTGAMES-STORAGE-ISOLATION / CODEX (2026-10-23).
- Start: clean main bb37693, matching origin/main after fetch; no other writer or owner WIP.
- Owner approval: useful content and return-visit improvement, simple homepage, validation and deployment. Existing GitHub exception retained; cache operations excluded.
- Scope: preserve temporary collection/sort state on unrelated cross-tab changes; invalidate only the changed localStorage key, while respecting direct same-key writes/removal and explicit clear.
- Main remains simple: no new section or card. Existing Play, Save, help, backup and compact previews unchanged.
- QA PASS: strict isolated Hugo --gc --minify, node syntax and Git hygiene; 128 pages / 7 aliases / four style hashes. Full output comparison differs only in index.html; all detail pages, sitemap and assets identical.
- Browser QA PASS: Chrome and WebKit each storage isolation 39/8, search 70/16, backup 45/8, share 80/12 and guide-return 208/48 (442 assertions / 92 layouts). Mobile/desktop screenshots inspected. Pre-fix Chrome test reproduced temporary recent removal loss after another tab changed theme.
- Source/QA detail: Docs/HotGames_Storage_Isolation_Note.md and tools/check_storage_isolation.js; existing regressions unchanged.
- Previous release: source d0c2aa2, verification bb37693; details and ordinary-domain limitation in Docs/HotGames_Public_Share_Note.md.
- DONE / HEAD: implementation complete, source uncommitted; use Git for WIP.
- Deployment: NOT_RUN for this work ID.
- BLOCKER: none locally. Ordinary-domain acceptance remains separate; physical-device quota and measured business effects NOT_RUN. Cache operations excluded.
- NEXT_SINGLE_TASK: commit and deploy verified storage isolation, then validate deployed code and ordinary domain separately.
- Existing watch server 1316 untouched; isolated QA server 1317 and task browser sessions active.
