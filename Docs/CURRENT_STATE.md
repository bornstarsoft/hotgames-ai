# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-WORKSHOP-DIRECT-ENTRY; directory shortcuts, QA and deployment; main; 2026-11-18)

- Phase: release preparation. Owner approved implementation, QA and normal GitHub main to Cloudflare Pages deployment.
- Work ID / AI: HOTGAMES-WORKSHOP-DIRECT-ENTRY / CODEX (2026-11-18).
- Start: clean main 6201d4a matching origin/main after fetch; no other writer or WIP. Refetched: no divergence.
- Preflight (22:47 KST): ordinary Workshop returned HTTP 200/HIT without the two advanced exercises, boards, variations or copy controls. All three original exercise headings and fragment IDs remain present.
- Scope: add three native links from the directory to the original exercises. Keep homepage, Workshop, game guides and cache settings unchanged.
- QA PASS: strict Hugo build (129 pages, 7 aliases), Node syntax and Git hygiene. Generated output differs only at /games/index.html.
- Browser QA PASS: Chrome and WebKit each passed 504 assertions / 116 layouts (Workshop 246/60, recent puzzle 50/8, guide return 208/48). Three exact routes, keyboard/Back, unopened disclosures, no-JS, 44px targets and at most two rows from 320px through 1440px in both themes. Inspected 320px and 1440px screenshots.
- No cache changes or bypass, generated files, dependencies, tracking, storage or game repo changes. Physical-device and repeat-visit measures NOT_RUN.
- NEXT_SINGLE_TASK: push and validate the Pages deployment and ordinary domain.
