# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification. Implementation, QA, GitHub push and Cloudflare Pages production deployment DONE. Ordinary-domain acceptance incomplete.
- Work ID / AI: HOTGAMES-WORKSHOP-DIRECT-ENTRY / CODEX (2026-11-18).
- Start: clean main 6201d4a matching origin/main after fetch; no other writer or WIP. Refetched: no divergence.
- Preflight (22:47 KST): ordinary Workshop returned HTTP 200/HIT without the two advanced exercises, boards, variations or copy controls. All three original exercise headings and fragment IDs remain present.
- Scope: add three native links from the directory to the original exercises. Keep homepage, Workshop, game guides and cache settings unchanged.
- QA PASS: strict Hugo build (129 pages, 7 aliases), Node syntax and Git hygiene. Generated output differs only at /games/index.html.
- Browser QA PASS: Chrome and WebKit each passed 504 assertions / 116 layouts (Workshop 246/60, recent puzzle 50/8, guide return 208/48). Three exact routes, keyboard/Back, unopened disclosures, no-JS, 44px targets and at most two rows from 320px through 1440px in both themes. Inspected 320px and 1440px screenshots.
- No cache changes or bypass, generated files, dependencies, tracking, storage or game repo changes. Physical-device and repeat-visit measures NOT_RUN.
- DONE / HEAD: source 70db4592958131622b8aac4e2f01f9d1d4ff4aff pushed normally to owner-approved GitHub main. This documentation-only follow-up records the results.
- Deployment PASS: Cloudflare Pages check 134850011843; https://cd9be940.hotgames-ai.pages.dev/. Chrome and WebKit both pass Workshop 246/60 on the deployment URL. The default Pages URL also passed the WebKit recheck after an initially older directory response.
- Ordinary-domain acceptance NOT PASS (22:53-22:55 KST): /games/ and /games/practice/ returned HTTP 200/HIT without the new shortcut group or the two advanced exercises. All three original anchors remain. No cache change or bypass.
- NEXT_SINGLE_TASK: verify the three direct entries, five boards, eight copy controls and three variation links at ordinary hotgames.ai without changing cache.
