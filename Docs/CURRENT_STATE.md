# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification. Implementation, local QA, normal GitHub push and Cloudflare Pages production deployment DONE. Ordinary-domain acceptance incomplete.
- Work ID / last AI: HOTGAMES-PRACTICE-RETRY / CODEX (2026-11-18).
- Start clean main 8bbe84a matching origin/main after fetch. No other writer/WIP. Refetched before release: no divergence.
- Previous release acceptance NOT PASS: before implementation and after deployment, normal hotgames.ai DaySudoku returned HTTP 200/HIT without either hint in Chrome or WebKit. Both hints are present and work on Pages. Prior release documented at 8bbe84a.
- Scope: a Retry both questions control after the second answer closes that guide's two hints and answers, focuses the first question, and replaces the current fragment without adding a history entry. Table of contents, saved games, recently opened, Play, and next links stay intact. No-JS users retain native practice and links without a dead button.
- QA PASS: strict Hugo build, Node syntax, Git hygiene. Only three guide HTML files differ; directory, homepage, styles, assets, and sitemap byte-identical.
- Browser QA PASS: Chrome and WebKit each 912 assertions / 80 layouts (move checks 426/48, tip links 454/24, recent puzzle 32/8). Covers keyboard, current fragment, focus, collection isolation, no-JS and 44px non-overlapping targets. 320px light and 1440px dark screenshots inspected; pointer reset returns focus on both.
- Owner approval: existing GitHub main to Cloudflare Pages. No cache operations, force push, game repository changes, tracking, dependencies, or generated files. Physical-device and measured return-rate validation NOT_RUN.
- DONE / HEAD: source 9438df4d1fc3b3eb4531d36ec0b8a8f3d6c8bccc pushed normally. This documentation-only follow-up records release verification; use Git for its containing commit.
- Deployment PASS: GitHub Cloudflare check 134806899773; https://c47317dc.hotgames-ai.pages.dev/. Chrome on the unique URL and WebKit on https://hotgames-ai.pages.dev/ each pass the expanded move-check suite (426/48).
- Ordinary-domain acceptance NOT PASS (21:38 KST): both engines returned HTTP 200/HIT but no Retry button on any of the three guides. Chrome saw previous hints on Blockzzle and Ringzzle; WebKit got an older response without hints there. DaySudoku had neither hint in either engine. Read-only DaySudoku HEAD: Last-Modified 12:17:33 UTC and Age 1274 at 21:38:47 KST. No attempt to alter or bypass cache.
- BLOCKER: older guide HTML observed on the ordinary domain. This is not a Pages build failure.
- NEXT_SINGLE_TASK: without cache changes, confirm both DaySudoku hints and the guide-only retry on all three ordinary-domain URLs.
- Task browser profiles and local server stopped. Existing sessions and generated repository files untouched.
