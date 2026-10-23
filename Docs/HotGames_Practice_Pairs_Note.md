# Paired Puzzle Practice

- Work ID: HOTGAMES-PRACTICE-PAIRS
- Date: 2026-10-23 (Asia/Seoul)
- Repository: /Users/seongjinkim/BornStarSoft_Publishing/github_hugo/hotgames-ai
- Baseline: clean main 1a8a7c4, synchronized with origin/main after fetch; no other writer or owner WIP.
- Approval: useful return-visit improvements, simple main, validation and deployment through the existing project-specific GitHub exception. Cache work excluded.

## Content

Extend the existing practice section in each game guide from one situation to two. The first checks a basic rule; the second applies it to a more useful placement decision:

- Blockzzle: preserve the only two-by-two space by using a separate single-square gap, under an explicit no-line-clear assumption.
- Ringzzle: matching blue rings of different sizes clear; a red ring in the same row remains and still occupies its own size slot.
- DaySudoku: with candidates A={2,5}, B={5,8}, C={5,8}, only A can contain the row's missing 2. The example does not decide between 5 and 8 in B/C.

All are hypothetical examples, not live-board advice, daily answers, predictions of upcoming pieces, or guarantees of better scores. No new popularity, ranking, health or cognitive-benefit claims.

Each answer uses the existing native details/summary shortcode with an optional label. "Check answer 1" and "Check answer 2" distinguish the independent disclosures. Both work without JavaScript and can be closed to retry. No score, completion flag, streak, storage key, randomizer or submission is introduced.

## Routes And Scope

- /games/blockzzle/#try-a-move-check
- /games/ringzzle/#try-a-move-check
- /games/daysudoku/#try-a-move-check
- Existing /games/ links use "Try two move checks" while retaining these URLs.
- Section headings explicitly preserve the old fragment. Existing contents navigation, canonical tip sharing, save controls and Play links remain available.
- The main HTML, images and stylesheets are unchanged. No duplicate article or new route. Lastmod values reflect the updated guide content; sitemap URLs stay identical, with guide and inherited homepage timestamps updated by Hugo.
- Only this repository was edited. No Blockzzle/Ringzzle/DaySudoku source, backend, login, iframe, dependency, analytics, ads, email capture, leaderboard or fake ranking was added.

## Sources Reviewed

Reviewed public guide pages in an isolated browser on 2026-10-23 after the web lookup tool could not retrieve them:

- https://blockzzle.com/block-puzzle/ : placement and full row/column clears. The shapes in the exercise are hypothetical, not a promised tray.
- https://ringzzle.com/how-to-play/ : one ring per size slot, mixed-size color lines, matching-color-only clears, and Color Burst distinction.
- https://daysudoku.com/how-to-play/ : each digit appears once per row/column/box. Candidate example and explanation are original illustrative reasoning, not today's solution.

## Validation

- ./tools/check_site.sh PASS: isolated warning-free Hugo --gc --minify, 128 pages, 7 aliases and four stylesheet hashes. No generated files written to the checkout.
- Node syntax checks for both changed QA scripts and git diff --check PASS. public/, resources/_gen/ and node_modules/ are not tracked or staged.
- Chrome and WebKit each PASS 824 assertions / 144 layout cases: practice 201/48, tip links 274/24, guide context 141/24, guide return 208/48.
- Coverage includes pointer/Space/Enter, independent closed answers, unchanged browser history, no-JS disclosure, 320/390/768/1440 widths, light/dark, 44px controls, wrapping and unchanged saved/recent lists.
- Existing guide-return test initially failed Chrome geometry immediately after resizing to 320px. Subsequent coordinate inspection passed the same condition. Added a bounded responsive-layout wait using the same predicate, not relaxed bounds; both engines then passed. No homepage source change.
- Visual inspection: /private/tmp/hg-practice-{blockzzle,ringzzle,daysudoku}-mobile.png and /private/tmp/hg-practice-directory-desktop.png. Existing artwork loads.
- Complete output comparison: only the three detail pages, /games/ and sitemap differ. Sitemap URL sets equal; homepage HTML, static assets and CSS unchanged.
- No real game launch or score submission; relevant Play checks are intercepted in isolated QA. No owner browser storage was used.
- Physical devices, screen readers and measured business/retention impact: NOT_RUN.

## Deployment

Pending normal GitHub push and Pages / ordinary-domain verification. The earlier root response mismatch is separate and remains recorded in Docs/HotGames_Search_Input_Note.md. No purge, cache rule/header changes or bypass planned.
