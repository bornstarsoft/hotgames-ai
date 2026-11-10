# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-RECENT-PUZZLE; directory practice shortcut, validation and deployment; main; 2026-11-10)

- Phase: release preparation. Implementation and local QA DONE. Deployment and normal-domain acceptance pending.
- Work ID / last AI: HOTGAMES-RECENT-PUZZLE / CODEX (2026-11-10).
- Start: clean main d95a0ee matching origin/main after fetch; no owner WIP or other writer. Refetched before release: no divergence.
- Previous release acceptance on normal hotgames.ai (21:05-21:06 KST): WebKit saw the FAQ and both practice links on all three guides; second exercise navigation left answers closed. Chrome received older HTML on all four pages. Prior practice deployment exists, but consistent ordinary-domain delivery was not established.
- Scope: /games/ shows one recent puzzle practice shortcut for the most recent recognized guide game in existing browser history, including legacy IDs. Links to the first move check and does not record reading as play. Hidden without valid history, JavaScript, or storage. Updates on Play, local storage changes, and page restoration; returns focus to The games if focused shortcut disappears.
- QA PASS: strict isolated Hugo build (128 pages, 7 aliases, four stylesheet hashes), Node syntax, Git hygiene, and generated output comparison. Only /games/index.html differs; homepage, detail pages, assets, and sitemap are byte-identical.
- Browser QA PASS: Chrome and WebKit each 32 assertions / 8 layouts on the final build (320/390/768/1440px, both themes). Prior build before label-only shortening also passed tip links 454/24 and save destination 123/32 per engine. 320px light and 1440px dark inspected; final 320px row is 44px high on one line.
- Owner approval: existing GitHub main to Cloudflare Pages. No cache changes, bypasses, new storage keys, tracking, dependency, or game code. Physical-device and measured retention checks NOT_RUN.
- NEXT_SINGLE_TASK: push verified source, then validate Pages and ordinary-domain shortcut behavior.
