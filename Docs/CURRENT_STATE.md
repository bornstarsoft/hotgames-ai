# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-PRACTICE-PAIRS; paired practice content, existing-guide QA and approved GitHub deployment; main; 2026-10-23)

- Phase: release preparation; implementation and local QA DONE, deployment pending.
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
- HEAD/WIP: use Git; changes limited to three game Markdown files, guide list/shortcode, two QA scripts and two documentation files.
- BLOCKER: none for local practice QA. Prior ordinary-root freshness and physical mobile/screen-reader checks remain open. No retention or revenue lift measured.
- NEXT_SINGLE_TASK: normal GitHub push, verify Pages deployment and ordinary-domain practice pages without cache manipulation.
- Existing watch server 1316 untouched; isolated QA server 1317 and task browser profiles currently running.
