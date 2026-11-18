# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-PUZZLE-WORKSHOP; practice content, QA and deployment; main; 2026-11-18)

- Phase: release preparation. Implementation and local QA DONE. Deployment pending.
- Work ID / last AI: HOTGAMES-PUZZLE-WORKSHOP / CODEX (2026-11-18).
- Start: clean main 78afd46 matching origin/main after fetch; no other writer or WIP. Refetched before release: no divergence.
- Previous release preflight (21:51 KST): Chrome and WebKit on ordinary hotgames.ai received HTTP 200/HIT with no DaySudoku hints, retry control or resume link.
- Scope: editorial /games/practice/ has three original Blockzzle, Ringzzle and DaySudoku scenarios. Native optional hints and answers, stable fragments and links to each corresponding guide. One entrance in /games/ starting tips. Workshop reading does not alter bookmarks, saved games or recent opens.
- QA PASS: strict Hugo build (129 pages, 7 aliases, four style hashes), Node syntax and Git hygiene. Output adds Workshop HTML, changes directory HTML and adds the canonical sitemap entry. Homepage, existing guides, assets and styles byte-identical.
- Browser QA PASS: Chrome and WebKit each 532 assertions / 80 layouts (Workshop 56/24, resume 50/8, move checks 426/48). Verified keyboard, no-JS, spoiler isolation, content and navigation. 320px light and 1440px dark screenshots inspected.
- Owner approval: existing GitHub main to production Cloudflare Pages. No forced push, cache change or bypass, analytics, new dependencies, game repos or generated output. Physical-device and return-rate validation NOT_RUN.
- NEXT_SINGLE_TASK: push verified source, then verify Pages and ordinary-domain Workshop, directory entrance and outstanding DaySudoku resume.
