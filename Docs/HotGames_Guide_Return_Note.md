# Guide Reading To Return Play

- Work ID: HOTGAMES-GUIDE-RETURN
- Date: 2026-10-23 (KST)
- Start: clean main at aaa88d5, matching origin/main after fetch; ACTIVE_WRITER was NONE.
- Scope: useful content and a small returning-user improvement, keeping the homepage simple. Existing project-specific GitHub exception and deployment approval retained. Cache work excluded.

## Changes

- Add a concise When You Get Stuck section to the three existing game guides. Sudoku covers checking every possible cell for one missing digit; Blockzzle distinguishes connected shape-sized space from scattered gaps; Ringzzle distinguishes occupied size slots from a completely blocked tray.
- Add an end-of-guide action row: the game's existing native Play link, the shared Save control and a Saved games link. Readers no longer need to scroll back to the top to save or open the game after reading.
- Reuse existing CSS and JavaScript. Top and bottom Save controls share state, Undo and cross-tab synchronization. Reading and saving do not imply playing or completing a game. The existing outbound-link handler alone records recently opened game IDs.
- Homepage, directory, CSS hashes, storage keys, game URLs and old heading fragments remain unchanged. The existing table of contents includes the new content heading automatically.
- Update only the three detail pages' lastmod timestamps; retain publication dates and routes.

## Factual Basis

Read public rendered official pages on 2026-10-23; no game source imported:

- https://daysudoku.com/sudoku-tips/ (one missing digit's only possible location; check every empty cell).
- https://ringzzle.com/guides/keep-space-open/ (size slots, remaining tray pieces and game-over condition).
- https://blockzzle.com/block-puzzle/ (block placement and complete row/column clears). The connected-space advice is an editorial placement suggestion, not an asserted score outcome or new game mechanic.

No new ranking, popularity, score guarantee, cognitive/health benefit, account, leaderboard feature, archive, challenge mode, analytics, external JavaScript, dependency or backend. No other repository modified. Existing illustrations retained; no new assets needed for this text/action-only change.

## Validation And Release

- PASS: ./tools/check_site.sh (strict isolated hugo --gc --minify, warnings/path collisions fatal), git diff --check and node --check tools/check_guide_return.js. 128 pages / 7 aliases and four unchanged stylesheet hashes retained; generated directories are not tracked or staged.
- PASS: home and directory generated HTML are byte-identical to the pre-change build. Sitemap still has 126 unique URLs; all three detail lastmod entries are 2026-10-23T01:52:00+09:00.
- PASS: tools/check_guide_return.js passes 116 assertions and 24 responsive/theme layouts in each of Chrome and WebKit against the completed static build. Covers both Save controls, Undo/focus, reload, cross-tab updates, legacy/malformed/blocked storage, exact native Play destinations, recent-history isolation, Saved navigation, existing content/links/fragments, no-JavaScript access and no application runtime errors.
- PASS: Chrome Tab navigation and Space activation; WebKit focused Space activation. Final 390px dark mobile and 1440px light desktop screenshots visually inspected. Existing illustrations load. Physical-device keyboard/navigation testing remains NOT_RUN.
- An initial test fixture used the wrong legacy alias; corrected to the existing Hugo urlize value https//daysudoku.com/. Application compatibility logic was not changed.
- The existing watch-mode server at 1316 temporarily served partially rendered content/stale sitemap metadata after edits. It was not modified or restarted. Final acceptance was rerun against an isolated completed production build at 1317, including assertions that pre-existing final sections and learning links remain intact. Do not use watch-mode output as release evidence.
- Existing analytics suppressed in isolated test profiles. External game Play requests fulfilled with a local QA response; no game visit/score state changed.
- Previous ordinary-domain /games/ CSS MIME failure was reproduced before editing. Cache operations and measured business effects are outside this task; do not claim complete ordinary-domain acceptance unless actually verified.
- Source commit: d483c9bcf797ee155c41486a2c4137b6325211aa, Improve puzzle guide tips and return-to-play actions. Normally pushed to origin/main without rebase or force push.
- Deployment PASS: Cloudflare check succeeded in the public GitHub checks page, deployment 7b92b3bc-8822-4fdb-8e9e-113217d61ab3, https://7b92b3bc.hotgames-ai.pages.dev/. Verified around 02:01-02:03 KST. The API was rate-limited; public web check 119964783039 confirmed Deployed successfully without credentials.
- Deployed QA PASS: all three routes have the new content/actions. WebKit on hotgames-ai.pages.dev and Chrome on the unique deployment each repeated 116 assertions / 24 layouts. Deployed sitemap has 126 unique URLs and the correct three updated lastmod entries.
- Ordinary-domain acceptance PARTIAL: Chrome at 390px checked /games/ and all three details; WebKit checked /games/ and DaySudoku. All these observations now loaded current 3a8dcd7c... CSS (88 rules) without horizontal overflow. The earlier unstyled-directory symptom was not reproduced in these final browser checks, but the detail HTML still lacked this release's stuck-point content and bottom action row. Do not claim ordinary-domain freshness or universal cache convergence.
- No cache operations or bypass performed. Remaining manual check: ordinary-domain new-content visibility and physical-mobile saved/play flow. The isolated validation server is stopped after QA; the pre-existing watch server is untouched.

## Repeat Browser QA

Use an isolated Playwright CLI session, open the desired preview/deployment origin, then run from the repository:

```sh
"$PWCLI" -s=guide-return run-code "$(cat tools/check_guide_return.js)"
```

The test deliberately seeds and changes browser-local saved/recent collections. Never run it in the owner's personal browser profile. No npm dependency or build tool is installed by this test file.
