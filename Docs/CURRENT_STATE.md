# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification; implementation, QA, normal GitHub push and Pages deployment DONE. Ordinary-domain acceptance PENDING.
- Work ID / last AI: HOTGAMES-STORAGE-ISOLATION / CODEX (2026-10-23).
- Start: clean main bb37693, matching origin/main after fetch; no other writer or owner WIP.
- Owner approval: useful content and return-visit improvement, simple homepage, validation and deployment. Existing GitHub exception retained; cache operations excluded.
- Scope: preserve temporary collection/sort state on unrelated cross-tab changes; invalidate only the changed localStorage key, while respecting direct same-key writes/removal and explicit clear.
- Main remains simple: no new section or card. Existing Play, Save, help, backup and compact previews unchanged.
- QA PASS: strict isolated Hugo --gc --minify, node syntax and Git hygiene; 128 pages / 7 aliases / four style hashes. Full output comparison differs only in index.html; all detail pages, sitemap and assets identical.
- Browser QA PASS: Chrome and WebKit each storage isolation 39/8, search 70/16, backup 45/8, share 80/12 and guide-return 208/48 (442 assertions / 92 layouts). Mobile/desktop screenshots inspected. Pre-fix Chrome test reproduced temporary recent removal loss after another tab changed theme.
- Source/QA detail: Docs/HotGames_Storage_Isolation_Note.md and tools/check_storage_isolation.js; existing regressions unchanged.
- Previous release: source d0c2aa2, verification bb37693; details and ordinary-domain limitation in Docs/HotGames_Public_Share_Note.md.
- DONE / HEAD: source c3ec5121ef11217fd4dac05724034e776228bf73 pushed normally. This documentation follow-up records evidence; use Git for its containing commit and WIP.
- Deployment PASS: GitHub Cloudflare check 120005466684; 72e1461f-3b8a-48fd-81fa-783a7e8e1423, https://72e1461f.hotgames-ai.pages.dev/.
- Deployed QA PASS: Chrome storage isolation 39/8 on unique deployment and WebKit 39/8 on production Pages. Quota failures injected only in isolated QA profiles; real cross-tab localStorage events tested.
- Ordinary-domain PENDING (03:22-03:23 KST): curl home and Chrome home/Saved/puzzle search still lack the storageArea guard. Existing catalog retained; no claim of completed domain rollout and no cache intervention.
- BLOCKER: none for source/build/Pages. Ordinary-domain acceptance pending; physical-device quota and measured business effects NOT_RUN. Cache operations excluded.
- NEXT_SINGLE_TASK: confirm the new handler on ordinary hotgames.ai and repeat cross-tab Saved/Recent acceptance, including physical mobile QA; no cache intervention without renewed owner approval.
- Existing watch server 1316 untouched; isolated QA server 1317 and task browser sessions stopped.
