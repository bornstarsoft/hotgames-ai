# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-PRACTICE-RETRY; retry practice questions, validation and deployment; main; 2026-11-18)

- Phase: release preparation. Implementation and local QA DONE. Deployment pending.
- Work ID / last AI: HOTGAMES-PRACTICE-RETRY / CODEX (2026-11-18).
- Start clean main 8bbe84a matching origin/main after fetch. No other writer/WIP. Refetched before release: no divergence.
- Previous release acceptance: before implementation, normal hotgames.ai DaySudoku returned HTTP 200/HIT without either hint in Chrome or WebKit. Prior source deployment and partial custom-domain result documented at 8bbe84a.
- Scope: a Retry both questions control after the second answer closes that guide's two hints and answers, focuses the first question, and replaces the current fragment without adding a history entry. Table of contents, saved games, recently opened, Play, and next links stay intact. No-JS users retain native practice and links without a dead button.
- QA PASS: strict Hugo build, Node syntax, Git hygiene. Only three guide HTML files differ; directory, homepage, styles, assets, and sitemap byte-identical.
- Browser QA PASS: Chrome and WebKit each 912 assertions / 80 layouts (move checks 426/48, tip links 454/24, recent puzzle 32/8). Covers keyboard, current fragment, focus, collection isolation, no-JS and 44px non-overlapping targets. 320px light and 1440px dark screenshots inspected; pointer reset returns focus on both.
- Owner approval: existing GitHub main to Cloudflare Pages. No cache operations, force push, game repository changes, tracking, dependencies, or generated files. Physical-device and measured return-rate validation NOT_RUN.
- NEXT_SINGLE_TASK: push verified source, then check Pages and ordinary-domain retry plus previous DaySudoku hints.
