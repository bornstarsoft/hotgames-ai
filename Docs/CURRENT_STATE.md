# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification. Implementation, local QA, GitHub push and Cloudflare Pages deployment DONE. Ordinary-domain acceptance incomplete.
- Work ID / last AI: HOTGAMES-WORKSHOP-GUIDE-LINKS / CODEX (2026-11-18).
- Start: clean main 7546101 matching origin/main after fetch; no other writer or WIP. Refetched before release: no divergence.
- Previous release preflight (22:11-22:12 KST): both engines saw HTTP 200 on ordinary Workshop and /games/. Workshop served only three original answers with no diagrams or variations. Directory had no entry. No cache operations.
- Scope: one descriptive link after each game's move checks to the relevant Workshop exercise; existing Workshop answer links lead back to the matching guide. Native navigation, stable anchors and no new state, dependencies or styles.
- QA PASS: strict Hugo build (129 pages, 7 aliases, four guide style hashes), Node syntax and Git hygiene. Only three game guide HTML files differ. Homepage, directory, Workshop, styles, assets and sitemap unchanged.
- Browser QA PASS: Chrome and WebKit each 704 assertions / 108 layouts before label-only polish (Workshop 137/36, move checks 426/48, guide context 141/24), and each passed Workshop 137/36 on final build. Native keyboard and no-JS round trips, correct destinations and default-closed answers. 320px light and 1440px dark screenshots inspected; final three labels fit on one line at 320px.
- Owner approval: existing GitHub main to production Cloudflare Pages. No cache changes/bypass, force push, game repo changes, tracking, generated files or physical-device or return-rate validation.
- DONE / HEAD: source a7019081f5bb371b418590a8225316cd2e3d3a57 pushed normally. This documentation-only follow-up records evidence; use Git for its containing commit.
- Deployment PASS: GitHub Cloudflare check 134827866387; https://7ee0e091.hotgames-ai.pages.dev/. Chrome unique and WebKit production Pages each pass Workshop 137/36 with native round trips.
- Ordinary-domain acceptance NOT PASS (22:16 KST): all three guides returned HTTP 200/HIT with no new link in either engine. Workshop direct URL still showed the three original answers only, without diagrams or variations; /games/ had no Workshop entrance. No cache modification or bypass attempted.
- NEXT_SINGLE_TASK: verify guide-to-Workshop links and visible target boards on ordinary hotgames.ai without cache changes.
- Task browser profiles and local servers stopped. Existing sessions and generated repository files untouched.
