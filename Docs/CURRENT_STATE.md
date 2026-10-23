# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification; implementation, local QA, normal push and Pages deployment DONE. Ordinary-domain acceptance remains incomplete because older detail pages are still served.
- Work ID / last AI: HOTGAMES-PRACTICE-PAIRS / CODEX (2026-10-23).
- Start: clean main 1a8a7c4, matching origin/main after fetch; no other writer or owner WIP.
- Owner approval: useful return-visit improvement, simple homepage, validation and deployment. Existing project GitHub exception retained; cache operations excluded.
- Scope: each of the three game guides has two hypothetical move checks, with separately numbered native answer disclosures. Existing section fragments and links preserved; /games/ link labels updated. No new route or homepage control.
- QA PASS: strict isolated Hugo --gc --minify, Node test syntax and Git hygiene; 128 pages / 7 aliases / four verified style hashes.
- Browser QA PASS: Chrome and WebKit each 824 assertions / 144 layout cases: practice 201/48, tip links 274/24, guide context 141/24, guide return 208/48. Native keyboard/no-JS behavior and unchanged saved/recent data verified; external Play mocked.
- Test maintenance: Chrome initially read stale geometry immediately after viewport resize in existing guide-return test. Settled geometry passed; same predicate now waits up to 5s for responsive layout, and both engines pass. No related application changes.
- Visual QA PASS: three 390px light exercise screenshots and 1440px dark directory inspected. Generated changes limited to four guide HTML pages and sitemap timestamps. Homepage, assets and style hashes byte-identical; sitemap URL set unchanged.
- Details: Docs/HotGames_Practice_Pairs_Note.md. Official public rules reviewed in browser; no game source copied.
- Previous release: source f9874b4, verification 1a8a7c4; Docs/HotGames_Search_Input_Note.md. Prior root response mismatch remains an independent follow-up; no cache operations.
- DONE / HEAD: source f7565024a6d1ea4dfc43f20abf87c9f0181b399f pushed normally. This documentation follow-up records results; use Git for its containing commit and WIP.
- Deployment PASS: GitHub Cloudflare check 120434996155, deployment bd147a7a-71a6-4a6c-9a84-c53ae21a0ff9; https://bd147a7a.hotgames-ai.pages.dev/.
- Deployed QA PASS: Chrome unique deployment and WebKit production Pages each pass practice 201 assertions / 48 layouts.
- Ordinary-domain acceptance NOT PASS (22:19 KST): Chrome and WebKit each see one exercise on all three detail pages. /games/ has zero new link labels in Chrome and three in WebKit. Root still has the prior 34px search-clear behavior. No general live-domain rollout claim.
- BLOCKER: ordinary-domain responses differ from verified Pages. Cache operations remain excluded; no purge, header/rule change or bypass performed. Physical devices/screen readers and measured business impact NOT_RUN.
- NEXT_SINGLE_TASK: verify ordinary-domain /games/ and all three detail pages consistently show the paired exercises, without cache manipulation; carry forward the separate root-response follow-up.
- Existing watch server 1316 untouched; isolated QA server 1317 and both task browser profiles stopped.
