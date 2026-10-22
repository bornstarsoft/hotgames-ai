# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: production deployment complete; ordinary-domain acceptance not passed because responses still mix old HTML with unavailable old stylesheet URLs. Cache work is excluded by owner instruction.
- Work ID / last AI: HOTGAMES-GUIDE-SHORTCUTS / CODEX (2026-10-23).
- DONE: implementation, local QA, source commit/push and Cloudflare Pages deployment. Source HEAD: 6667ace37ae8555dcbb230a0fe65c394ce16721e. This documentation-only follow-up records release evidence; use git log/status for its containing commit and current WIP.
- Start: clean main at 78e6852, matching origin/main after fetch. Existing owner changes and all previous features preserved.
- Scope: native collapsed contents on three game detail pages; three problem-focused starting-tip links on /games/. Homepage, Saved/Recently opened behavior, game destinations and content fragment IDs unchanged.
- Owner approval: project-specific GitHub exception, relevant content, modest retention improvement, validation and deployment. Cache work excluded; no purge, rule edits, force push, remote changes or credentials accessed.
- QA PASS: strict isolated Hugo build and Git hygiene, 128 pages / 7 aliases. Chrome and WebKit each passed 117 assertions including 56 layout/theme/disclosure combinations. Additional 26 no-JavaScript/sitemap assertions passed; 126 unique sitemap URLs retained. Mobile screenshots inspected.
- Deployment PASS: Cloudflare Pages check succeeded for 6667ace, deployment 228460c2-1ee7-4df0-ae75-d54b9a23c97f, https://228460c2.hotgames-ai.pages.dev/. Chrome repeated 117 assertions / 56 layout states and 26 no-JavaScript/sitemap checks on that URL around 01:29 KST. Latest CSS returns text/css from both deployment and normal domain.
- Ordinary domain NOT ACCEPTED: plain HTTP requests saw new guide markers, but WebKit still received old /games/ HTML without Starting tips, referencing the old 0a749f6f... CSS URL. That URL returned HTML, producing a stylesheet MIME error. See the note for exact URLs. No cache work performed; do not equate deployment success with consistent normal-domain rendering.
- Source and QA detail: Docs/HotGames_Guide_Shortcuts_Note.md. No other repository, new JavaScript, dependencies, analytics, backend, generated output or game code changed.
- Previous release: 78e6852 (documentation), source 62cba21. See Docs/HotGames_Recent_Curation_Note.md for previous deployment and cache-scope evidence.
- BLOCKER: normal-domain HTML/asset version consistency for full public-site acceptance; not a source/build blocker. Physical-device testing and measured retention/business lift remain NOT_RUN.
- NEXT_SINGLE_TASK: verify current HTML and matching CSS on the ordinary domain before further feature work, followed by physical-phone acceptance; no cache operations without separate approval.
- Writer released. Local preview remains at http://127.0.0.1:1316/.
