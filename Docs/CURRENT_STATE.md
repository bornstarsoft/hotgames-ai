# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification. Implementation, local QA, GitHub push and Cloudflare Pages deployment DONE. Ordinary-domain acceptance incomplete.
- Work ID / last AI: HOTGAMES-PRACTICE-LINKS / CODEX (2026-11-10).
- Start: clean main 1f684f7, matching origin/main after fetch. No other writer or owner WIP. Refetched before release: no divergence.
- Scope: two named practice headings with stable fragments, native contents links and canonical copy per guide. Existing section fragment and closed-by-default answers retained. Directory FAQ distinguishes saved shortcuts from game-board progress. No homepage, new storage, analytics, game code, CSS or cache changes.
- QA PASS: strict isolated Hugo build (128 pages, 7 aliases, four verified stylesheet hashes), Node syntax and Git hygiene. Exactly four generated guide HTML pages differ; homepage, sitemap and assets are byte-identical.
- Browser QA PASS: Chrome and WebKit each pass final link suite 454 assertions / 24 layout cases, plus answer 201/48 and saved destination 123/32 on the preceding build before title-only refinements. Covers 320/390/768/1440px, keyboard, canonical clipboard URLs, no-JS native fragments and closed answers. 320px light and 1440px dark screenshots inspected; final 320px title rows fit their controls.
- Previous release acceptance: normal hotgames.ai save destination suite PASS in Chrome (123/32) on 2026-11-10. Previous mixed delivery is historical in this observed session. See Docs/HotGames_Save_Destination_Note.md.
- Owner approval: use existing GitHub main to Cloudflare Pages. No force push or cache operations. Physical devices and measured business impact NOT_RUN.
- DONE / HEAD: source d52b262fc315f043f03d7242f84d15aa91a7c36f pushed normally. This documentation follow-up records the observed results; use Git for its containing commit.
- Deployment PASS: GitHub Cloudflare check 129813954187; https://e1a64e3b.hotgames-ai.pages.dev/. Chrome on unique deployment and WebKit on https://hotgames-ai.pages.dev/ pass link suite 454/24 each.
- Ordinary-domain acceptance NOT PASS (20:57-20:58 KST): Chrome normal URLs returned new markers and closed answers on all four pages (MISS). WebKit twice returned previous HTML on all four (HIT). Chrome full suite then encountered old Blockzzle HTML in a fresh JavaScript-disabled context. No claim of consistent visitor rollout.
- BLOCKER: mixed ordinary-domain delivery. No cache purge, rule/header change or bypass requested or performed.
- NEXT_SINGLE_TASK: rerun the direct practice and FAQ checks on the four normal-domain URLs in both browsers once delivery is consistent.
- Task browser profiles and isolated local servers stopped; existing sessions and generated repository files untouched.
