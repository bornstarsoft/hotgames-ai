# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-WORKSHOP-PAIRED-PRACTICE; exercise-to-variation routes, QA and deployment; main; 2026-11-18)

- Phase: release preparation. Owner approved implementation, QA and normal GitHub main to Cloudflare Pages deployment.
- Work ID / AI: HOTGAMES-WORKSHOP-PAIRED-PRACTICE / CODEX (2026-11-18).
- Start: clean main 3b7ccb5 matching origin/main after fetch; no other writer or WIP. Refetched before release: no divergence.
- Preflight (22:27-22:28 KST): ordinary Workshop returned HTTP 200/HIT in Chrome and WebKit without the prior release's boards, variations or copy controls.
- Scope: three original Workshop answers link directly to their corresponding Blockzzle, Ringzzle and DaySudoku variations. Variation links back to each original board and game guide links remain. Linked answers remain closed.
- QA PASS: strict Hugo build (129 pages, 7 aliases, four existing guide style hashes), Node syntax and Git hygiene. Only Workshop HTML differs from the pre-change output; homepage, directory, guides, sitemap and assets byte-identical.
- Browser QA PASS: Chrome and WebKit each 1059 assertions / 108 layout cases (Workshop 179/36, tip links 454/24, move checks 426/48); keyboard, Back, no-JS, closed answers and 44px targets. 320px mobile and 1440px desktop screenshots inspected.
- No cache changes or bypass, force push, game repo changes, new dependencies, tracking, storage or generated files. Physical-device and return-rate validation NOT_RUN.
- NEXT_SINGLE_TASK: push and verify Workshop practice on Pages and the ordinary domain.
