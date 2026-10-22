# Puzzle Help From Saved And Recent Games

- Work ID: HOTGAMES-PUZZLE-HELP
- Date: 2026-10-23 (KST)
- Start: clean main at 407acaa, matching origin/main after fetch. ACTIVE_WRITER was NONE.
- Owner scope: useful content discovery and a modest return-visit improvement, simple homepage, validation and deployment via the existing project-specific GitHub exception. Cache operations excluded.

## Change

- Full Saved and Recently opened collections replace the three puzzle cards' generic Details link with Puzzle help, linking to the existing #when-you-get-stuck section. Accessible names identify the game and purpose. Play links remain separate and unchanged.
- Discover source cards retain Details. Compact home collection previews still hide detail links and show only the existing two-game previews. No homepage section or additional button added.
- The guide directory adds one descriptive help link per game alongside its existing starting tip. Short helpTip metadata is based on the already-published guide content, not new gameplay claims or duplicate articles.
- Hugo resolves help URLs from the existing guide pages and fails the build if a declared help target is missing. Games without a supported guide do not acquire a help link.
- Reuse native links, fragments and browser Back. Help navigation is not a game launch and does not change saved/recent data. Existing filters and saved sort preference remain intact.
- A collection-scoped inline CSS rule raises the existing detail/help link to a 44px hit area. Guide CSS files and all four published hashes remain unchanged.
- Only the directory's lastmod changes to 2026-10-23T02:07:00+09:00. Detail page body/output and lastmod are unchanged; their new metadata is consumed by the directory and card template only.

## Boundaries

No new page, external service, JavaScript dependency, analytics, account, backend, game source, iframe, cache configuration, ranking or popularity claim. Existing illustrations retained. No Blockzzle, Ringzzle or DaySudoku repository changes. No measured retention/revenue improvement claimed.

## QA

- PASS: ./tools/check_site.sh, isolated hugo --gc --minify with strict warnings/path checks, node --check tools/check_guide_return.js and git diff --check. 128 pages / 7 aliases, four unchanged guide CSS versions. No generated public/, resources/_gen/ or node_modules/ tracked/staged.
- PASS: all three generated detail HTML files are byte-identical to the pre-change build. Sitemap keeps 126 unique URLs, the updated directory timestamp and unchanged detail timestamps.
- PASS: Chrome and WebKit each passed 208 assertions / 48 layout-theme combinations against completed build output (not the pre-existing watch server). Covers saved/recent contextual links, exact fragment targets, reading without collection writes, Back with query/category preservation, Undo, existing sort/guide behavior, legacy/malformed/blocked storage, no-JavaScript guide links and native Play destinations.
- PASS: mobile 320px Recent / 390px Saved and 1440px light directory screenshots visually inspected. Illustrations load; links wrap within the viewport. Initial mobile checks found the existing 34px detail link; the collection-only 44px fix passes final checks.
- PASS: an isolated copy of content with the help heading removed fails Hugo with Puzzle help target missing. Repository content was not altered for this fault test.
- A test initially compared a relative href attribute to an absolute URL; corrected to compare the browser-resolved URL. No application navigation change was needed for that test correction.
- External Play destinations are mocked only in isolated browser QA; no real game state is changed. Existing analytics suppressed in QA. Physical-device testing and business outcomes NOT_RUN.

## Release

Pending normal commit/push and deployed acceptance. Ordinary-domain prior-release content was still older at the start. Cache operations remain excluded; distinguish successful Pages deployment from ordinary-domain freshness.

Repeat the existing CLI smoke function in an isolated browser profile already open on the desired origin: run-code "$(cat tools/check_guide_return.js)". It seeds browser-local test collections; do not use the owner's personal browser profile.
