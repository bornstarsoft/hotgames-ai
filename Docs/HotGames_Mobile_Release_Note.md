# Mobile Validation and GitHub Delivery

- Work ID: HOTGAMES-MOBILE-RELEASE
- Date: 2026-10-14 (Asia/Seoul)
- Repository: hotgames-ai; branch: main; starting HEAD: bb559f8.
- Owner explicitly authorized continued GitHub hosting as a project-specific exception, preserving existing changes, mobile validation, then commit and push if validation passes.
- Origin remains git@github.com:bornstarsoft/hotgames-ai.git. A successful fetch found no divergence before validation. No rebase or force push is needed.
- Earlier notes describing a GitHub/Gitea approval blocker are historical; this approval resolves that blocker for this repository.

## Preserved Release Contents

- Puzzle illustrations, responsive images, homepage recommendations, game directory comparison, and shared game detail layouts.
- Recently opened and saved homepage previews, existing full collections, search/filtering, and browser-local history.
- Duplicate article moved to Docs/ArchivedContent while retaining its full original text and the existing public URL through the earlier article.
- Existing isolated Hugo site validator and related implementation notes.
- No application code changes were necessary in this validation task. Only the current state and this release note were added/updated for delivery.

## Mobile QA

PASS in both installed browser engines:

- Chrome with Pixel 7 device emulation, touch input and Android user agent.
- WebKit with iPhone 13 device emulation and touch input. The CLI-default WebKit revision was not installed, so validation used the existing webkit-2358 executable through a temporary CLI config; no browser or project dependency was installed.
- Touch saving, two-item previews, View all, clearing and undo, native Play navigation, recent history on return, search, category filters, drawer navigation, comparison anchors, FAQ toggles, and theme persistence.
- Native Play tests used local test responses for game destinations. These verify link navigation, not remote gameplay.
- Five routes: /, /games/, /games/blockzzle/, /games/ringzzle/, /games/daysudoku/.
- Four viewport widths: 320, 390, 430, and 844 CSS pixels (844 tested in landscape at 390 height).
- Light and dark themes: 40 layout combinations per engine, 80 total. No document overflow, checked-text clipping, or missing local cover images; no runtime JavaScript exceptions.
- Mobile screenshots inspected in both engines. Test screenshots/configuration/scripts stayed outside the repository in /private/tmp.
- Existing analytics was suppressed in test routing; no new analytics or tracking was introduced.

## Build and Integrity

- PASS: ./tools/check_site.sh, including hugo --gc --minify --printPathWarnings --panicOnWarning with temporary output, cache, and resource directories. 128 pages, 11 paginator pages, 7 aliases; no warnings.
- PASS: git diff --check and generated-output tracking guard.
- PASS: exact crawlable Play destinations for all three games, retained Blockzzle/Ringzzle leaderboard links, and all three game detail pages in the 126-URL sitemap.
- PASS: archived duplicate text matches its original HEAD source; retained public article is unchanged.
- Only explicit intended source, asset, and documentation paths are to be staged. No public/, resources/_gen/, node_modules/, temporary test files, or credentials.

## Remaining Checks

- NOT_RUN: physical iPhone/Android hardware, real mobile keyboard/browser chrome and network behavior, remote game functionality, and production deployment/cache verification.
- This task authorizes a normal GitHub push, not an independent Cloudflare deployment, configuration change, or cache purge. An existing external build integration may react to the push; successful push alone does not prove deployment success.
- Confirm delivery using the containing commit and Git remote refs. After deployment is separately verified, check production homepage, game directory/details, image responses, and returning-user controls on a physical mobile device.
