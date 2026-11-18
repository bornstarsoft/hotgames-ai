# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-WORKSHOP-REPLAY; retry one exercise, QA and deployment; main; 2026-11-18)

- Phase: release preparation. Owner approved implementation, QA and normal GitHub main to Cloudflare Pages deployment.
- Work ID / AI: HOTGAMES-WORKSHOP-REPLAY / CODEX (2026-11-18).
- Start: clean main 3c6f614 matching origin/main after fetch; no other writer or WIP. Refetched: no divergence.
- Preflight (23:30-23:31 KST): ordinary /games/ still contains the three static shortcuts; neither /games/ nor /games/practice/ contains its newer resume markup.
- Scope: Workshop-only retry control closes the current exercise's own hint and answer, returns focus to its heading and preserves browser history, other exercises and existing bookmarks. Homepage, directory, guides and cache unchanged.
- QA PASS: strict Hugo build (129 pages, 7 aliases), Node syntax and Git hygiene. Only Workshop HTML differs from baseline.
- Browser QA PASS: Chrome and WebKit each passed 434 assertions / 110 layouts (Workshop 371/94, resume 63/16). Tested all nine retry controls, heading scroll/focus, other disclosures, untouched storage/history and native no-JS behavior. Inspected 320px light and 1440px dark, plus post-retry focus.
- No cache changes or bypass, new storage, tracking, dependencies, generated files or game repo edits. Physical devices and measured return rate NOT_RUN.
- NEXT_SINGLE_TASK: push and verify Pages and ordinary-domain responses.
