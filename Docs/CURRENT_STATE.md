# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-WORKSHOP-GUIDE-LINKS; contextual practice links, QA and deployment; main; 2026-11-18)

- Phase: release preparation. Implementation and local QA DONE. Deployment pending.
- Work ID / last AI: HOTGAMES-WORKSHOP-GUIDE-LINKS / CODEX (2026-11-18).
- Start: clean main 7546101 matching origin/main after fetch; no other writer or WIP. Refetched before release: no divergence.
- Previous release preflight (22:11-22:12 KST): both engines saw HTTP 200 on ordinary Workshop and /games/. Workshop served only three original answers with no diagrams or variations. Directory had no entry. No cache operations.
- Scope: one descriptive link after each game's move checks to the relevant Workshop exercise; existing Workshop answer links lead back to the matching guide. Native navigation, stable anchors and no new state, dependencies or styles.
- QA PASS: strict Hugo build (129 pages, 7 aliases, four guide style hashes), Node syntax and Git hygiene. Only three game guide HTML files differ. Homepage, directory, Workshop, styles, assets and sitemap unchanged.
- Browser QA PASS: Chrome and WebKit each 704 assertions / 108 layouts before label-only polish (Workshop 137/36, move checks 426/48, guide context 141/24), and each passed Workshop 137/36 on final build. Native keyboard and no-JS round trips, correct destinations and default-closed answers. 320px light and 1440px dark screenshots inspected; final three labels fit on one line at 320px.
- Owner approval: existing GitHub main to production Cloudflare Pages. No cache changes/bypass, force push, game repo changes, tracking, generated files or physical-device or return-rate validation.
- NEXT_SINGLE_TASK: deploy the verified source, then check Pages and ordinary-domain guide-to-Workshop navigation.
