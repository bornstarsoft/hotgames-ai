# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-GUIDE-RETURN; concise stuck-point tips and end-of-guide play/save actions, validation and GitHub deployment; main; 2026-10-23)

- Phase: release preparation; implementation and local QA DONE. Normal push and deployed acceptance pending.
- Work ID / last AI: HOTGAMES-GUIDE-RETURN / CODEX (2026-10-23).
- Start: clean main aaa88d5, matching origin/main after fetch; no other active writer or owner WIP.
- Owner approval: useful content, modest returning-user improvement, simple homepage, validation and deployment. Existing project-specific GitHub exception retained. Cache work excluded.
- Scope: concise When You Get Stuck content in the three existing puzzle guides; bottom native Play, shared Save and Saved games links. No homepage or directory changes, new CSS/JavaScript, storage keys, dependencies, analytics, backend or other repository changes.
- QA PASS: strict isolated Hugo --gc --minify via tools/check_site.sh, node syntax and Git hygiene. 128 pages / 7 aliases, four unchanged style hashes. Home and directory outputs byte-identical to before; sitemap 126 unique URLs with correct detail timestamps.
- Browser QA PASS: Chrome and WebKit each passed 116 assertions / 24 responsive-theme combinations on completed production output. Save/Undo/focus, native Play, recent history, cross-tab/legacy/malformed/blocked storage, no-JS, existing content and fragment checks included. Final desktop/mobile screenshots inspected.
- Preview warning: existing watch server at 1316 served transient partial content and stale sitemap; final QA used an isolated static production build at 1317. Existing server left untouched.
- Source and QA detail: Docs/HotGames_Guide_Return_Note.md; repeatable CLI smoke function tools/check_guide_return.js.
- Previous release: source c5f8dec, documentation aaa88d5; historical CSS retention and ordinary-domain limitation recorded in Docs/HotGames_Return_Reliability_Note.md.
- BLOCKER: none for this source/build. Ordinary /games/ still returned HTML for historical 0a749f6f... CSS at start; no purge, bypass or rule edits permitted. Physical-device QA and business effects NOT_RUN.
- NEXT_SINGLE_TASK: normal GitHub push, verify deployed guide content/actions, and report ordinary-domain acceptance separately without cache operations.
