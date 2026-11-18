# HotGames Current State

ACTIVE_WRITER = CODEX (HOTGAMES-PRACTICE-RESUME; browser-local last question, QA, deployment; main; 2026-11-18)

- Phase: release preparation. Implementation and local QA DONE. Deployment pending.
- Work ID / last AI: HOTGAMES-PRACTICE-RESUME / CODEX (2026-11-18).
- Start clean main 4bf2779 matching origin/main after fetch. No other writer/WIP. Refetched before release: no divergence.
- Previous release preflight NOT PASS (21:42 KST): both engines received HTTP 200/HIT without either DaySudoku hint or a retry control on any of the three ordinary-domain guides. Chrome saw older Blockzzle/Ringzzle hints; WebKit did not.
- Scope: opening any practice hint or answer remembers one allowlisted game ID and question number locally. Retry updates it to question 1. The directory reuses its existing one-line shortcut to resume the exact question, or falls back to recent games. No saved game, launch history, answer visibility, network or analytics changes. Plain reading does not set a bookmark.
- QA PASS: strict isolated Hugo build, Node syntax, Git hygiene. Output diff limited to /games/ and the three guides; homepage, styles, assets, sitemap and routes are unchanged.
- Browser QA PASS: Chrome and WebKit each 930 assertions / 80 layouts (recent/resume 50/8, move checks 426/48, tip links 454/24). Tests cover persistence, cross-tab updates, exact fragment, collapsed answers, retry, invalid/blocked storage, no-JS fallback and saved/history isolation. Screenshots inspected at 320px light and 1440px dark.
- Owner approval: existing GitHub main to Cloudflare Pages. No cache changes or bypass, force push, game repository changes, new network calls, dependencies, or generated files. Physical-device and return-rate validation NOT_RUN.
- NEXT_SINGLE_TASK: push verified source, verify Pages and observe the ordinary-domain hint, retry and resume routes.
