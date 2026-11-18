# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification. Implementation, local QA, GitHub push and Cloudflare Pages production deployment DONE. Ordinary-domain acceptance incomplete.
- Work ID / last AI: HOTGAMES-WORKSHOP-BOOKMARK-LINKS / CODEX (2026-11-18).
- Start: clean main 32a9a61 matching origin/main after fetch; no other writer or WIP. Refetched before release: no divergence.
- Preflight (22:18 KST): ordinary Blockzzle, Ringzzle and DaySudoku pages returned HTTP 200/HIT and omitted the previous release's Workshop links in both engines.
- Scope: six Workshop exercises expose copy controls at stable heading fragments using the existing guide copy mechanism. Public canonical URL only, with no private queries. Clipboard denial provides a normal link; no JS still supports direct fragments. Hint/answer, collections and recent history are unchanged.
- QA PASS: strict Hugo build (129 pages, 7 aliases, four existing hashes), Node syntax and Git hygiene. Only Workshop HTML differs; homepage, directory, old guides, sitemap and fingerprinted assets byte-identical.
- Browser QA PASS: Chrome and WebKit each 1041 assertions / 108 layout cases before scoped mobile spacing polish (Workshop 161/36, tip links 454/24, move checks 426/48); final Workshop 161/36 again in both engines. Tested canonical URL via clipboard stub, rejection fallback, keyboard, no-JS and default-closed answers. 320px and 1440px inspected; all six final targets fit next to labels at 320px.
- Owner approval: GitHub main to Cloudflare Pages. No cache changes or bypass, forced push, external/game repo changes, new dependencies, tracking or generated output. Physical-device and return-rate validation NOT_RUN.
- DONE / HEAD: source b3126f0934406bcf5c5b1324723206488f8d88a6 pushed normally. This documentation-only follow-up records evidence; see Git for its containing commit.
- Deployment PASS: GitHub Cloudflare check 134832370446; https://87baa072.hotgames-ai.pages.dev/. Chrome unique and WebKit production Pages each pass Workshop 161/36.
- Ordinary-domain acceptance NOT PASS (22:24-22:25 KST): normal Workshop returned HTTP 200/HIT in both engines, with no boards, variations or copy buttons. Read-only HEAD at 22:24:34 KST: Age 1746, Last-Modified 12:55:27 UTC. The normal-URL recheck showed the same result. No cache change or bypass.
- NEXT_SINGLE_TASK: verify all six copy controls and a canonical direct exercise link on ordinary hotgames.ai without cache changes.
- Task browser profiles and local servers stopped. Existing sessions and generated repository files untouched.
