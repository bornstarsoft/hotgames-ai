# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-WORKSHOP-COMPARE-CLEARS; new Blockzzle board, QA and deployment; main; 2026-11-18)

- Phase: release preparation. Owner approved implementation, QA and normal GitHub main to Cloudflare Pages deployment.
- Work ID / AI: HOTGAMES-WORKSHOP-COMPARE-CLEARS / CODEX (started 2026-11-18 KST).
- Start: clean main ff8958e matching origin/main after fetch; no other writer or WIP. Refetched: no divergence.
- Preflight (23:55 KST): ordinary Workshop returned HTTP 200/EXPIRED with the previous return link. Ordinary /games/ returned a cached response without directory resume markup.
- Scope: add one illustrated Blockzzle exercise comparing equally sized line clears, reachable from the grouped index, with hint, answer, replay, share and related practice. Homepage, guides and cache unchanged.
- QA PASS: strict Hugo build (129 pages, 7 aliases), Node syntax and Git hygiene. Generated diff limited to Workshop HTML and one added directory resume target. Homepage and all game guides byte-identical.
- Browser QA PASS: Chrome and WebKit each passed 502 assertions / 128 layouts (Workshop 436/112, resume 66/16). Simulated both line clears from rendered data, checked identical empty counts and a unique square fit, and verified index, replay, share, no-JS and directory resume. Inspected mobile light and desktop dark captures.
- No new storage, dependencies, tracking, generated files, cache changes or game repo edits. Physical devices and measured return rates NOT_RUN.
- NEXT_SINGLE_TASK: push and verify Pages and ordinary-domain responses.
