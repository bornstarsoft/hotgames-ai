# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-GUIDE-SHORTCUTS; guide navigation and starting-tip discovery, validation and deployment; main; 2026-10-23)

- Phase: release preparation. Guide shortcuts implemented and local QA complete; source push and deployment acceptance pending.
- Work ID / last AI: HOTGAMES-GUIDE-SHORTCUTS / CODEX (2026-10-23).
- Start: clean main at 78e6852, matching origin/main after fetch. Existing owner changes and all previous features preserved.
- Scope: native collapsed contents on three game detail pages; three problem-focused starting-tip links on /games/. Homepage, Saved/Recently opened behavior, game destinations and content fragment IDs unchanged.
- Owner approval: project-specific GitHub exception, relevant content, modest retention improvement, validation and deployment. Cache work excluded; no purge, rule edits, force push, remote changes or credentials accessed.
- QA PASS: strict isolated Hugo build and Git hygiene, 128 pages / 7 aliases. Chrome and WebKit each passed 117 assertions including 56 layout/theme/disclosure combinations. Additional 26 no-JavaScript/sitemap assertions passed; 126 unique sitemap URLs retained. Mobile screenshots inspected.
- Source and QA detail: Docs/HotGames_Guide_Shortcuts_Note.md. No other repository, new JavaScript, dependencies, analytics, backend, generated output or game code changed.
- Previous release: 78e6852 (documentation), source 62cba21. See Docs/HotGames_Recent_Curation_Note.md for previous deployment and cache-scope evidence.
- BLOCKER: none. Physical-device testing and measured retention/business lift remain NOT_RUN.
- NEXT_SINGLE_TASK: push validated changes normally to GitHub main and verify Cloudflare Pages plus deployed guide navigation, without cache operations.
- Local preview remains at http://127.0.0.1:1316/.
