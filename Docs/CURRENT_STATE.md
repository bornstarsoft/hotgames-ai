# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-RECENT-CURATION; recent-list removal and official reading links, validation and deployment; main; 2026-10-23)

- Phase: release preparation; implementation and local QA DONE, source push and deployment verification pending.
- Work ID / last AI: HOTGAMES-RECENT-CURATION / CODEX (2026-10-23).
- Start: clean main at a9025e2, matching origin/main after fetch. Existing owner changes and all previous features preserved.
- Scope: individual removal with Undo only in full Recently opened view; two official further-reading links each on DaySudoku and Ringzzle guides. Homepage previews, Saved behavior, Blockzzle and game URLs remain unchanged.
- Undo restores the original slot if history is unchanged; otherwise restores at the end without reverting other edits. Six-entry history cap retained; a previously reopened target keeps its new position.
- Owner approval: project-specific GitHub exception, relevant content, modest retention improvement, validation and deployment. Cache work excluded; no purge, rule edits, force push, remote changes or credentials accessed.
- QA PASS: strict isolated Hugo build, required routes, git diff checks, 128 pages / 7 aliases; Chrome and WebKit each passed 65 assertions and 24 layout/theme combinations. Screenshots inspected. Additional 17 sitemap/no-JavaScript assertions passed, including 126 unique sitemap URLs and all existing Play links.
- Source and QA detail: Docs/HotGames_Recent_Curation_Note.md. No other repository, dependencies, analytics, backend, generated output or game code changed.
- Previous release: a9025e2 (documentation), source 2e0d6c4. See Docs/HotGames_Saved_Sort_And_Guides_Note.md for saved sorting and strategy release evidence. Previous normal-domain freshness was deferred by owner instruction; not a reason to perform cache work.
- BLOCKER: none. Physical-device testing and measured retention/business lift remain NOT_RUN.
- NEXT_SINGLE_TASK: push the validated source normally to GitHub main, then verify its Cloudflare Pages build and deployed pages without cache operations.
- Local preview remains at http://127.0.0.1:1316/.
