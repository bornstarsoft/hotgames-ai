# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification; implementation, local QA, normal GitHub push and Pages deployment DONE. Ordinary-domain acceptance remains incomplete.
- Work ID / last AI: HOTGAMES-SAVE-DESTINATION / CODEX (2026-10-24).
- Start: clean main 25121b8, matching origin/main after fetch; no owner WIP or other writer. Refetched before release: no divergence.
- Owner approval: useful return-visit improvement, simple homepage, validation and deployment. Existing project GitHub exception retained; cache operations excluded.
- Scope: successful guide save/Undo offers native Saved games destination. Actionable feedback persists until dismissed or superseded. Dismiss/Escape restores focus; cross-tab removal/restoration closes stale success without stealing unrelated focus. Only localStorage events refresh saved controls.
- QA PASS: strict isolated Hugo --gc --minify, Node test syntax, eight generated inline scripts parsed and Git hygiene; 128 pages / 7 aliases / four verified style hashes.
- Browser QA PASS: Chrome and WebKit each 1061 assertions / 208 layout cases: destination 123/32, theme 114/32, practice 201/48, tip links 274/24, guide context 141/24, guide return 208/48. External Play mocked and owner browser data untouched.
- Baseline reproduction: new destination suite fails on 25121b8 at successful-save destination; passes after implementation. Restored-page events and blocked storage are simulated; real two-tab changes and native Back also tested.
- Visual QA PASS: 320px light DaySudoku and 1440px dark Ringzzle screenshots inspected. Generated changes limited to four guide HTML files; homepage, content, assets, styles and sitemap unchanged.
- Details: Docs/HotGames_Save_Destination_Note.md and tools/check_save_destination.js.
- Previous release: source f135b59, verification 25121b8; Docs/HotGames_Guide_Theme_Note.md. Prior root mismatch tracked separately in Docs/HotGames_Search_Input_Note.md; practice follow-up in Docs/HotGames_Practice_Pairs_Note.md.
- Pre-release live check (2026-10-24): normal hotgames.ai guide theme PASS in Chrome (114/32); prior homepage search suite also PASS (100/24). Paired exercises observed on all three normal-domain guides. These are observed sessions, not proof of every edge.
- DONE / HEAD: source 6deccdb4625257ed4d1e06159ff85e3a5cd7370c pushed normally. This documentation follow-up records release evidence; use Git for its containing commit/WIP.
- Deployment PASS: final GitHub Cloudflare check 120564342706, deployment e3f36815-8001-4b02-b817-3ca266e79420, https://e3f36815.hotgames-ai.pages.dev/. The initial Building check 120564094087 was superseded by the successful check.
- Deployed QA PASS: Chrome unique deployment and WebKit production Pages each pass destination 123 assertions / 32 layouts.
- Ordinary-domain acceptance NOT PASS (02:45-02:46 KST): responses vary. WebKit first showed no shortcut on all four guides; Chrome briefly showed it on three detail pages but not /games/. Final inspection in both engines showed no shortcut on any of the four pages. No complete custom-domain rollout claim.
- Read-only header check: normal DaySudoku response HTTP 200, cf-cache-status HIT, Age 723, Last-Modified Fri, 23 Oct 2026 17:33:46 GMT. No purge, cache/header rule change or bypass.
- BLOCKER: inconsistent ordinary-domain delivery; cache operations excluded. Physical-device private modes/screen readers and measured business impact NOT_RUN.
- NEXT_SINGLE_TASK: verify native save -> Saved games -> Back on all four ordinary-domain guide pages once responses match Pages, without cache manipulation.
- Existing watch server untouched; task QA servers and both isolated browser profiles stopped. Browser artifacts moved outside the repo to /private/tmp/hg-save-artifacts.pG8fWI/.
