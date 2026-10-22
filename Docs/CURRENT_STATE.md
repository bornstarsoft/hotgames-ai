# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification; implementation, QA, normal GitHub push and Pages deployment DONE. Ordinary-domain acceptance PENDING.
- Work ID / last AI: HOTGAMES-SAVED-RECENCY / CODEX (2026-10-23).
- Start: clean main 93f8e9c, matching origin/main after fetch; no other writer or owner WIP.
- Owner approval: useful content and return-visit improvement, simple homepage, validation and deployment. Existing GitHub exception retained; cache operations excluded.
- Scope: add Recently opened to the full Saved native sort menu; reuse existing six-entry recent history, newest-saved fallback, remembered preference and cross-tab updates without rewriting saved IDs/history.
- Main remains simple: no new section or card. Existing Play, Save, help, backup and compact previews unchanged.
- QA PASS: strict isolated Hugo --gc --minify, node syntax and Git hygiene; 128 pages / 7 aliases / four style hashes. Full output comparison differs only in index.html; all detail pages, sitemap and assets identical.
- Browser QA PASS: Chrome and WebKit each recency 45/8, storage isolation 39/8, search 70/16, backup 45/8, share 80/12 and guide-return 208/48 (487 assertions / 100 layouts). Mobile/desktop screenshots inspected. Play and sharing targets stubbed in isolated QA only.
- Source/QA detail: Docs/HotGames_Saved_Recency_Note.md and tools/check_saved_recency.js; existing regressions unchanged.
- Previous release: source c3ec512, verification 93f8e9c; details and ordinary-domain limitation in Docs/HotGames_Storage_Isolation_Note.md.
- DONE / HEAD: source f518cdd38799b83ecdc2ea2d189d208ded0c218e pushed normally. This documentation follow-up records evidence; use Git for its containing commit and WIP.
- Deployment PASS: GitHub Cloudflare check 120010411337; c98d1de1-7dc2-4fa0-9732-30d2d7e46d79, https://c98d1de1.hotgames-ai.pages.dev/.
- Deployed QA PASS: Chrome recency 45/8 on unique deployment and WebKit 45/8 on production Pages. External Play intercepted in isolated QA; no real gameplay.
- Ordinary-domain PENDING (03:31-03:32 KST): normal curl home, Chrome home/Saved and WebKit Saved still offer only newest/name sorting. Existing catalog retained; 390px WebKit Saved fits. No claim of completed domain rollout and no cache intervention.
- BLOCKER: none for source/build/Pages. Ordinary-domain acceptance pending; physical-device native picker and measured business effects NOT_RUN. Cache operations excluded.
- NEXT_SINGLE_TASK: ordinary-domain acceptance for Recently opened sorting, including a physical mobile native picker, once updated HTML is served.
- Existing watch server 1316 untouched; isolated QA server 1317 and task browser sessions stopped.
