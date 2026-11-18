# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-WORKSHOP-TWO-MOVE; new Blockzzle exercise, QA and deployment; main; 2026-11-18)

- Phase: release preparation. Owner approved implementation, QA and normal GitHub main to Cloudflare Pages deployment.
- Work ID / AI: HOTGAMES-WORKSHOP-TWO-MOVE / CODEX (2026-11-18).
- Start: clean main e2ea550 matching origin/main after fetch; no other writer or WIP. Refetched before release: no divergence.
- Preflight (22:35 KST): ordinary Workshop returned HTTP 200/HIT with no practice boards, share controls or answer-to-variation links for the previous release.
- Scope: add one illustrated two-move Blockzzle exercise to Puzzle Workshop and an exact, shareable heading. Keep homepage, other guides and cache settings unchanged.
- QA PASS: strict Hugo build (129 pages, 7 aliases), Node syntax and Git hygiene. Only Workshop HTML differs from the previous build.
- Browser QA PASS: Chrome and WebKit each passed Workshop 206 assertions / 44 layouts. Tested both placements against the rendered board, hint and answer disclosure, exact canonical share link, direct entry, keyboard, no-JS and related guide link. Inspected 320px light and 1440px dark captures.
- No cache changes or bypass, force push, new dependencies, tracking, generated files or changes to game repositories. Physical-device and repeat-visit measurement NOT_RUN.
- NEXT_SINGLE_TASK: push and confirm the Pages production and ordinary-domain Workshop responses.
