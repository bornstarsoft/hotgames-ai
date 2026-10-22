# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification; implementation, local QA, normal GitHub push and Pages deployment verified. Ordinary-domain acceptance remains PARTIAL. Cache work remains excluded.
- Work ID / last AI: HOTGAMES-RETURN-RELIABILITY / CODEX (2026-10-23).
- Start: clean main at 9df4b6d, matching origin/main after fetch. Existing owner changes preserved.
- Scope: publish three historical guide stylesheet versions from exact Git source snapshots, keep original hash URLs and bytes, and guard the current and retained versions against accidental changes. Homepage/content/UI and existing game destinations remain unchanged.
- Owner approval: project-specific GitHub exception, relevant content, modest retention improvement, validation and deployment. Cache work excluded; no purge, rule edits, force push, remote changes or credentials accessed.
- QA PASS: strict isolated Hugo build, Git hygiene, 128 pages / 7 aliases, four output styles with correct SHA-256. Historical sources match Git byte-for-byte. Two negative manifest tests correctly fail the build.
- Browser QA PASS: Chrome and WebKit each passed 46 historical-page assertions / 16 layouts; current WebKit regression passed 117 assertions / 56 layouts. Mobile screenshots inspected. Home and four guide HTML outputs are byte-identical to the prior release build.
- Pre-release ordinary-domain issue reproduced: old list HTML requests 0a749f6f... CSS, old detail HTML requests ccb5ba78... CSS. The missing old CSS returned HTML. This release restores those original files, without changing cache rules or cached HTML.
- Source and QA detail: Docs/HotGames_Return_Reliability_Note.md. No other repository, new JavaScript, dependencies, analytics, backend, generated output or game code changed.
- Previous release: 9df4b6d (documentation), source 6667ace. See Docs/HotGames_Guide_Shortcuts_Note.md for the original public-site acceptance warning.
- DONE / HEAD: source c5f8dec3eec955852d8061155175386676a87fdb pushed to origin/main. This documentation-only follow-up records release evidence; use Git for its containing commit and current WIP.
- Deployment PASS by direct public verification: https://hotgames-ai.pages.dev/ serves all four exact CSS hashes with HTTP 200 / text/css. Deployed WebKit replay passed 46 assertions / 16 layouts; Chrome latest-feature regression passed 117 assertions / 56 layouts.
- Ordinary-domain QA PARTIAL (2026-10-23, 01:48 KST): three CSS versions pass. The 0a749f6f... URL still returns HTML, so /games/ remains unstyled and overflows at 390px. /games/daysudoku/ now parses its ccb5ba78... CSS (82 rules) and fits 390px. Exact Play links remain intact.
- BLOCKER: ordinary-domain directory acceptance is not complete. No cache changes, purge or bypass were performed. GitHub check-run metadata was unavailable due to its unauthenticated API rate limit; deployment ID/check conclusion not independently retrieved. Physical-device QA and business effects remain NOT_RUN.
- NEXT_SINGLE_TASK: recheck ordinary /games/ CSS MIME and mobile rendering without cache operations before selecting the next content improvement.
- Local preview remains at http://127.0.0.1:1316/.
