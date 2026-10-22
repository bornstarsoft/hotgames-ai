# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification; implementation, QA, normal GitHub push and Pages deployment DONE. Ordinary-domain round-trip acceptance PARTIAL.
- Work ID / last AI: HOTGAMES-SAVED-BACKUP / CODEX (2026-10-23).
- Start: clean main e326b5a, matching origin/main after fetch; no other writer or owner WIP.
- Owner approval: useful content and return-visit improvement, simple homepage, validation and deployment. Existing GitHub exception retained; cache operations excluded.
- Scope: full Saved-only JSON export/import; entire saved list, local processing, strict format/version/size/ID limits, catalog whitelist, merge without replacement, native confirmation, Undo and honest storage-failure feedback. No progress/history/settings transfer or cloud sync.
- Main remains simple: no new Discover/Recent tools or normal-home section. Existing Play, Save, help and compact previews unchanged.
- QA PASS: strict isolated Hugo --gc --minify, node syntax and Git hygiene; 128 pages / 7 aliases / four style hashes. Full output comparison differs only in index.html; all detail pages, sitemap and assets identical.
- Browser QA PASS: Chrome and WebKit each 45 backup / 70 search / 208 guide-return assertions (323 total) and 72 viewport-theme combinations. Actual keyboard file chooser in both, native cancellation and acceptance, and mobile/desktop screenshots verified separately. Final two-assertion expansion covers concurrent removal during confirmation and Undo.
- Source/QA detail: Docs/HotGames_Saved_Backup_Note.md and tools/check_saved_backup.js; existing search/guide regression tools retained unchanged.
- Previous release: source 88968db, verification e326b5a; details and domain freshness limitation in Docs/HotGames_Collection_Search_Note.md.
- DONE / HEAD: initial source 2968cca, final source 31998ba8216df55ad82509669111d5f4568ede9d pushed normally. This documentation follow-up records the final evidence; use Git for its containing commit and WIP.
- Deployment PASS: GitHub Cloudflare check 119991628926; db855965-b752-4f2e-89ab-f554a53f0d84, https://db855965.hotgames-ai.pages.dev/.
- Deployed QA PASS: final Chrome backup 45/8 on unique deployment and WebKit backup 45/8 on production Pages. Initial source also passed deployed WebKit guide-return 208/48; the final fix changes only import candidate handling.
- Ordinary-domain PARTIAL (02:50-02:52 KST): Home -> Saved -> download succeeded in Chrome; direct Saved tools and 390px layout also passed. Subsequent full regressions encountered older responses without backup controls. Full ordinary-domain round-trip acceptance is not claimed; details in the work note.
- BLOCKER: none for source/build/Pages. Ordinary-domain response consistency and physical-device file-provider QA remain unaccepted; no cache operations. Measured business effects NOT_RUN.
- NEXT_SINGLE_TASK: ordinary-domain physical iOS/Android file-provider and round-trip acceptance without changing cache policy.
- Existing watch server 1316 untouched; isolated QA server 1317 and task browser sessions stopped.
