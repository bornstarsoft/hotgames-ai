# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-PRACTICE-LINKS; practice links, saved-progress clarification, validation and deployment; main; 2026-11-10)

- Phase: release preparation; implementation and local QA DONE. Deployment and normal-domain acceptance pending.
- Work ID / last AI: HOTGAMES-PRACTICE-LINKS / CODEX (2026-11-10).
- Start: clean main 1f684f7, matching origin/main after fetch. No other writer or owner WIP. Refetched before release: no divergence.
- Scope: two named practice headings with stable fragments, native contents links and canonical copy per guide. Existing section fragment and closed-by-default answers retained. Directory FAQ distinguishes saved shortcuts from game-board progress. No homepage, new storage, analytics, game code, CSS or cache changes.
- QA PASS: strict isolated Hugo build (128 pages, 7 aliases, four verified stylesheet hashes), Node syntax and Git hygiene. Exactly four generated guide HTML pages differ; homepage, sitemap and assets are byte-identical.
- Browser QA PASS: Chrome and WebKit each pass final link suite 454 assertions / 24 layout cases, plus answer 201/48 and saved destination 123/32 on the preceding build before title-only refinements. Covers 320/390/768/1440px, keyboard, canonical clipboard URLs, no-JS native fragments and closed answers. 320px light and 1440px dark screenshots inspected; final 320px title rows fit their controls.
- Previous release acceptance: normal hotgames.ai save destination suite PASS in Chrome (123/32) on 2026-11-10. Previous mixed delivery is historical in this observed session. See Docs/HotGames_Save_Destination_Note.md.
- Owner approval: use existing GitHub main to Cloudflare Pages. No force push or cache operations. Physical devices and measured business impact NOT_RUN.
- NEXT_SINGLE_TASK: push verified source, then confirm Pages deployment and ordinary-domain practice links.
