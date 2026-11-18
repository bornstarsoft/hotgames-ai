# HotGames Current State

ACTIVE_WRITER = NONE

- Phase: release verification. Implementation, local QA, GitHub push and Cloudflare Pages production deployment DONE. Ordinary-domain acceptance incomplete.
- Work ID / last AI: HOTGAMES-PRACTICE-RESUME / CODEX (2026-11-18).
- Start clean main 4bf2779 matching origin/main after fetch. No other writer/WIP. Refetched before release: no divergence.
- Previous release preflight NOT PASS (21:42 KST): both engines received HTTP 200/HIT without either DaySudoku hint or a retry control on any of the three ordinary-domain guides. Chrome saw older Blockzzle/Ringzzle hints; WebKit did not.
- Scope: opening any practice hint or answer remembers one allowlisted game ID and question number locally. Retry updates it to question 1. The directory reuses its existing one-line shortcut to resume the exact question, or falls back to recent games. No saved game, launch history, answer visibility, network or analytics changes. Plain reading does not set a bookmark.
- QA PASS: strict isolated Hugo build, Node syntax, Git hygiene. Output diff limited to /games/ and the three guides; homepage, styles, assets, sitemap and routes are unchanged.
- Browser QA PASS: Chrome and WebKit each 930 assertions / 80 layouts (recent/resume 50/8, move checks 426/48, tip links 454/24). Tests cover persistence, cross-tab updates, exact fragment, collapsed answers, retry, invalid/blocked storage, no-JS fallback and saved/history isolation. Screenshots inspected at 320px light and 1440px dark.
- Owner approval: existing GitHub main to Cloudflare Pages. No cache changes or bypass, force push, game repository changes, new network calls, dependencies, or generated files. Physical-device and return-rate validation NOT_RUN.
- DONE / HEAD: source d901ba90f39d436402f8c346393d57000bccf791 pushed normally. This documentation-only follow-up records verification; use Git for its containing commit.
- Deployment PASS: GitHub Cloudflare check 134811854584; https://6327aa4b.hotgames-ai.pages.dev/. Chrome on unique Pages and WebKit on https://hotgames-ai.pages.dev/ each pass recent/resume 50/8.
- Ordinary-domain acceptance NOT PASS (21:48 KST): both engines received HTTP 200/HIT on normal URLs. Neither DaySudoku hint nor the retry controls on all three guides were present. The directory and DaySudoku guide also lacked the resume markup. Blockzzle/Ringzzle hints worked in Chrome but were absent in WebKit, confirming mixed versions in observed sessions. No cache changes or bypass attempted.
- BLOCKER: older normal-domain pages observed. Pages production build verified separately.
- NEXT_SINGLE_TASK: on ordinary hotgames.ai, confirm DaySudoku hints and all three retry controls, then open the second DaySudoku hint and verify the directory resumes the exact question. Do not alter cache.
- Task browser profiles and local server stopped; pre-existing server on 1328 untouched. No generated output tracked.
