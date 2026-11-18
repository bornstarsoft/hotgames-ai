# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-WORKSHOP-DIRECT-RESUME; directory resume link, QA and deployment; main; 2026-11-18)

- Phase: release preparation. Owner approved implementation, QA and normal GitHub main to Cloudflare Pages deployment.
- Work ID / AI: HOTGAMES-WORKSHOP-DIRECT-RESUME / CODEX (2026-11-18).
- Start: clean main df8820c matching origin/main after fetch; no other writer or WIP. Refetched: no divergence.
- Preflight (23:24 KST): ordinary /games/ contains the three static shortcuts; /games/practice/ still returns HTTP 200/HIT without the index, resume or next-exercise markup.
- Scope: add a conditional shortcut on /games/ that reads the existing Workshop bookmark and links to the exact known exercise. No new storage key, main-page changes, cache changes or game repo edits.
- QA PASS: strict Hugo build (129 pages, 7 aliases), Node syntax and Git hygiene. Only /games/index.html differs from baseline; homepage and Workshop outputs byte-identical.
- Browser QA PASS: Chrome and WebKit each passed 624 assertions / 148 layouts (resume 63/16, Workshop 303/76, recent puzzle 50/8, guide return 208/48). Verified read-only bookmark reuse, exact routes, Back, cross-tab update/clear and focus, unknown/denied storage and no-JS. Inspected 320px light and 1440px dark.
- No new storage keys, cache changes or bypass, tracking, dependencies, generated files or game repo changes. Physical devices and measured return rate NOT_RUN.
- NEXT_SINGLE_TASK: push and verify Pages and the ordinary domain.
