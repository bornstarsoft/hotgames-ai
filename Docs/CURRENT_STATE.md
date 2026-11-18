# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-WORKSHOP-EXERCISE-INDEX; grouped index, QA and deployment; main; 2026-11-18)

- Phase: release preparation. Owner approved implementation, QA and normal GitHub main to Cloudflare Pages deployment.
- Work ID / AI: HOTGAMES-WORKSHOP-EXERCISE-INDEX / CODEX (2026-11-18).
- Start: clean main be773b1 matching origin/main after fetch; no other writer or WIP. Refetched with no divergence.
- Preflight (23:10 KST): ordinary directory and Workshop returned HTTP 200/HIT without the previous shortcuts, advanced exercises or last-exercise feature.
- Scope: one collapsed, game-grouped index replaces the generic Workshop contents and the introductory jump-link sentence. Keep all exercise anchors, existing Puzzle Workshop resume behavior, homepage and cache unchanged.
- QA PASS: strict Hugo build (129 pages, 7 aliases), Node syntax and Git hygiene. Build rejects missing/duplicate exercise targets. Only Workshop HTML differs from baseline; no new routes.
- Browser QA PASS: Chrome and WebKit each passed 330 assertions / 84 layouts (Workshop 285/76, resume 45/8). Covered nine links grouped by game, native mobile/keyboard/no-JS navigation, canonical share links and last-exercise persistence, clearing and focus. Inspected 320px light and 1440px dark.
- No new storage behavior, cache changes or bypass, tracking, dependencies, generated files or game repo changes. Physical devices and repeat-visit measurements NOT_RUN.
- NEXT_SINGLE_TASK: push and confirm actual Pages and ordinary-domain responses.
