# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-RETURN-RELIABILITY; retain published guide styles, validation and deployment; main; 2026-10-23)

- Phase: release preparation; retained-style implementation and local QA DONE, push and deployment acceptance pending. Cache work remains excluded.
- Work ID / last AI: HOTGAMES-RETURN-RELIABILITY / CODEX (2026-10-23).
- Start: clean main at 9df4b6d, matching origin/main after fetch. Existing owner changes preserved.
- Scope: publish three historical guide stylesheet versions from exact Git source snapshots, keep original hash URLs and bytes, and guard the current and retained versions against accidental changes. Homepage/content/UI and existing game destinations remain unchanged.
- Owner approval: project-specific GitHub exception, relevant content, modest retention improvement, validation and deployment. Cache work excluded; no purge, rule edits, force push, remote changes or credentials accessed.
- QA PASS: strict isolated Hugo build, Git hygiene, 128 pages / 7 aliases, four output styles with correct SHA-256. Historical sources match Git byte-for-byte. Two negative manifest tests correctly fail the build.
- Browser QA PASS: Chrome and WebKit each passed 46 historical-page assertions / 16 layouts; current WebKit regression passed 117 assertions / 56 layouts. Mobile screenshots inspected. Home and four guide HTML outputs are byte-identical to the prior release build.
- Pre-release ordinary-domain issue reproduced: old list HTML requests 0a749f6f... CSS, old detail HTML requests ccb5ba78... CSS. The missing old CSS returned HTML. This release restores those original files, without changing cache rules or cached HTML.
- Source and QA detail: Docs/HotGames_Return_Reliability_Note.md. No other repository, new JavaScript, dependencies, analytics, backend, generated output or game code changed.
- Previous release: 9df4b6d (documentation), source 6667ace. See Docs/HotGames_Guide_Shortcuts_Note.md for the original public-site acceptance warning.
- BLOCKER: none for source/build. Public-domain rendering acceptance pending deployment; cache freshness is excluded scope. Physical-device QA and business effects remain NOT_RUN.
- NEXT_SINGLE_TASK: push and verify retained CSS bytes/MIME plus real ordinary-domain guide rendering, without cache operations.
- Local preview remains at http://127.0.0.1:1316/.
