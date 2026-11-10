# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification. Implementation, local QA, GitHub push and Cloudflare Pages deployment DONE. Ordinary-domain acceptance incomplete.
- Work ID / last AI: HOTGAMES-RECENT-PUZZLE / CODEX (2026-11-10).
- Start: clean main d95a0ee matching origin/main after fetch; no owner WIP or other writer. Refetched before release: no divergence.
- Previous release acceptance on normal hotgames.ai (21:05-21:06 KST): WebKit saw the FAQ and both practice links on all three guides; second exercise navigation left answers closed. Chrome received older HTML on all four pages. Prior practice deployment exists, but consistent ordinary-domain delivery was not established.
- Scope: /games/ shows one recent puzzle practice shortcut for the most recent recognized guide game in existing browser history, including legacy IDs. Links to the first move check and does not record reading as play. Hidden without valid history, JavaScript, or storage. Updates on Play, local storage changes, and page restoration; returns focus to The games if focused shortcut disappears.
- QA PASS: strict isolated Hugo build (128 pages, 7 aliases, four stylesheet hashes), Node syntax, Git hygiene, and generated output comparison. Only /games/index.html differs; homepage, detail pages, assets, and sitemap are byte-identical.
- Browser QA PASS: Chrome and WebKit each 32 assertions / 8 layouts on the final build (320/390/768/1440px, both themes). Prior build before label-only shortening also passed tip links 454/24 and save destination 123/32 per engine. 320px light and 1440px dark inspected; final 320px row is 44px high on one line.
- Owner approval: existing GitHub main to Cloudflare Pages. No cache changes, bypasses, new storage keys, tracking, dependency, or game code. Physical-device and measured retention checks NOT_RUN.
- DONE / HEAD: source 20c68b05876a560f8d359d7aab1f1110444d4be5 pushed normally. This documentation follow-up records release verification; use Git for its containing commit.
- Deployment PASS: GitHub Cloudflare check 129820921580; https://26b8ced9.hotgames-ai.pages.dev/. Chrome on unique deployment and WebKit on https://hotgames-ai.pages.dev/ each pass the new shortcut suite 32/8.
- Ordinary-domain acceptance NOT PASS (21:12 KST): Chrome and WebKit twice received HTTP 200 and older /games/ HTML (HIT), with neither the previous FAQ nor the new shortcut. Normal HEAD at 21:12:40 KST reported Age 1438 and Last-Modified 11:48:42 UTC. Earlier WebKit session did observe the previous exercise release; do not claim consistent rollout.
- BLOCKER: observed old HTML on the ordinary domain. No cache purge, rule/header change, or bypass performed.
- NEXT_SINGLE_TASK: verify /games/ shows the browser-local shortcut and it opens a visible first practice heading on ordinary hotgames.ai, without cache manipulation.
- Task browser profiles and isolated servers stopped. Existing sessions and generated repository files untouched.
