# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-SAVED-BACKUP; local saved-list transfer, validation and approved GitHub deployment; main; 2026-10-23)

- Phase: release preparation; saved-list backup implementation and local QA DONE; approved normal GitHub deployment next.
- Work ID / last AI: HOTGAMES-SAVED-BACKUP / CODEX (2026-10-23).
- Start: clean main e326b5a, matching origin/main after fetch; no other writer or owner WIP.
- Owner approval: useful content and return-visit improvement, simple homepage, validation and deployment. Existing GitHub exception retained; cache operations excluded.
- Scope: full Saved-only JSON export/import; entire saved list, local processing, strict format/version/size/ID limits, catalog whitelist, merge without replacement, native confirmation, Undo and honest storage-failure feedback. No progress/history/settings transfer or cloud sync.
- Main remains simple: no new Discover/Recent tools or normal-home section. Existing Play, Save, help and compact previews unchanged.
- QA PASS: strict isolated Hugo --gc --minify, node syntax and Git hygiene; 128 pages / 7 aliases / four style hashes. Full output comparison differs only in index.html; all detail pages, sitemap and assets identical.
- Browser QA PASS: Chrome and WebKit each 43 backup / 70 search / 208 guide-return assertions (321 total) and 72 viewport-theme combinations. Actual keyboard file chooser in both, native cancellation and acceptance, and mobile screenshots verified separately.
- Source/QA detail: Docs/HotGames_Saved_Backup_Note.md and tools/check_saved_backup.js; existing search/guide regression tools retained unchanged.
- Previous release: source 88968db, verification e326b5a; details and domain freshness limitation in Docs/HotGames_Collection_Search_Note.md.
- Deployment / deployed QA: pending source push.
- BLOCKER: none for source/build. Ordinary-domain freshness requires separate acceptance; no cache operations. Physical-device file-provider QA and measured business effects NOT_RUN.
- NEXT_SINGLE_TASK: normally push validated source and verify Pages deployment plus ordinary Saved availability.
- Existing watch server 1316 untouched; isolated QA server 1317 and task browser sessions active for release verification.
