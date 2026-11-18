# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification. Implementation, QA, GitHub push and Cloudflare Pages production deployment DONE. Ordinary-domain acceptance incomplete.
- Work ID / AI: HOTGAMES-WORKSHOP-DIRECT-RESUME / CODEX (2026-11-18).
- Start: clean main df8820c matching origin/main after fetch; no other writer or WIP. Refetched: no divergence.
- Preflight (23:24 KST): ordinary /games/ contains the three static shortcuts; /games/practice/ still returns HTTP 200/HIT without the index, resume or next-exercise markup.
- Scope: add a conditional shortcut on /games/ that reads the existing Workshop bookmark and links to the exact known exercise. No new storage key, main-page changes, cache changes or game repo edits.
- QA PASS: strict Hugo build (129 pages, 7 aliases), Node syntax and Git hygiene. Only /games/index.html differs from baseline; homepage and Workshop outputs byte-identical.
- Browser QA PASS: Chrome and WebKit each passed 624 assertions / 148 layouts (resume 63/16, Workshop 303/76, recent puzzle 50/8, guide return 208/48). Verified read-only bookmark reuse, exact routes, Back, cross-tab update/clear and focus, unknown/denied storage and no-JS. Inspected 320px light and 1440px dark.
- No new storage keys, cache changes or bypass, tracking, dependencies, generated files or game repo changes. Physical devices and measured return rate NOT_RUN.
- DONE / HEAD: source 52633f398f976b247388d39baeb70b2c71941677 pushed normally to owner-approved GitHub main. This documentation-only follow-up records release evidence.
- Deployment PASS: Cloudflare Pages check 134872516652; https://5c7e395c.hotgames-ai.pages.dev/. Chrome on the deployment URL and WebKit on the production Pages URL passed resume 63/16 and Workshop 303/76.
- Ordinary-domain acceptance NOT PASS (23:29 KST): both engines received HTTP 200/HIT without the new directory resume markup or the prior Workshop resume markup. The directory still contains all three static entries. No cache changes or bypass.
- NEXT_SINGLE_TASK: confirm the real hint-to-directory-to-exercise flow on ordinary hotgames.ai once both routes return the new markup.
