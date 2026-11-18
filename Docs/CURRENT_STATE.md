# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-WORKSHOP-RESUME; local Workshop shortcut, QA and deployment; main; 2026-11-18)

- Phase: release preparation. Owner approved implementation, QA and normal GitHub main to Cloudflare Pages deployment.
- Work ID / AI: HOTGAMES-WORKSHOP-RESUME / CODEX (2026-11-18).
- Start: clean main a5299f2 matching origin/main after fetch; no other writer or WIP. Refetched before release: no divergence.
- Preflight (23:02-23:03 KST): ordinary directory and Workshop returned HTTP 200/HIT without the prior shortcuts or advanced exercises.
- Scope: Workshop-only last-exercise shortcut. Save only a known exercise ID in this browser after an intentional hint/answer opening; offer clear and no-JS fallback. No change to homepage, directory, guide return storage, cache or game repos.
- QA PASS: strict Hugo build (129 pages, 7 aliases), Node syntax and Git hygiene. Only Workshop HTML differs from the baseline.
- Browser QA PASS: Chrome and WebKit each passed 315 assertions / 76 layouts (new resume 45/8, Workshop regression 270/68). Covered all nine anchors, reload, cross-tab, clearing and keyboard focus, invalid/denied storage, no-JS and unrelated data isolation. Inspected 320px light and 1440px dark.
- Browser storage contains only one exercise ID, not an answer, score or progress claim. No cache changes or bypass, new dependencies, tracking, generated files or game repo edits. Physical devices and measured return rate NOT_RUN.
- NEXT_SINGLE_TASK: push and verify Pages and ordinary hotgames.ai.
