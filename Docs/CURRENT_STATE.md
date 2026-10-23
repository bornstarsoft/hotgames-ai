# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-GUIDE-THEME; guide theme continuity, scoped QA and approved GitHub deployment; main; 2026-10-23)

- Phase: release preparation; implementation and local QA DONE, deployment pending.
- Work ID / last AI: HOTGAMES-GUIDE-THEME / CODEX (2026-10-23).
- Start: clean main 1386a09, matching origin/main after fetch; no other writer or owner WIP.
- Owner approval: useful return-visit improvement, simple homepage, validation and deployment. Existing project GitHub exception retained; cache operations excluded.
- Scope: restore guide theme from current preference on persisted pageshow, synchronize only actual local-storage preference/reset events, retain an in-page choice after storage failure. No new UI or storage key.
- QA PASS: strict isolated Hugo --gc --minify, Node test syntax and Git hygiene; 128 pages / 7 aliases / four verified style hashes.
- Browser QA PASS: Chrome and WebKit each 938 assertions / 176 layout cases: theme 114/32, practice 201/48, tip links 274/24, guide context 141/24, guide return 208/48. External Play mocked and owner browser data untouched.
- Baseline reproduction: new theme suite fails on 1386a09 output at persisted page restoration; passes after fix. Restored-page events and blocked storage are simulated; real two-tab changes and native Back also tested.
- Visual QA PASS: 320px light Ringzzle guide and 1440px dark directory screenshots inspected. Generated changes limited to four guide HTML files; homepage, content, assets, styles and sitemap unchanged.
- Details: Docs/HotGames_Guide_Theme_Note.md and tools/check_guide_theme.js.
- Previous release: source f756502, verification 1386a09; Docs/HotGames_Practice_Pairs_Note.md. Prior root mismatch also tracked in Docs/HotGames_Search_Input_Note.md.
- Read-only live check (22:22 KST): ordinary DaySudoku guide returns old single-exercise HTML with cf-cache-status HIT, Age 2037 and Last-Modified 12:48:09 UTC; production Pages returns paired exercises. No cache manipulation performed.
- HEAD/WIP: use Git; intended changes only layouts/games/baseof.html, tools/check_guide_theme.js and these two documentation files.
- BLOCKER: previous ordinary-domain response mismatch remains; cache work excluded. Physical-device private modes/screen readers and measured business impact NOT_RUN.
- NEXT_SINGLE_TASK: normal GitHub push and verify Pages and ordinary-domain guide theme behavior without cache manipulation.
- Existing watch server 1316 untouched; isolated QA server 1317 and task browser profiles currently running.
