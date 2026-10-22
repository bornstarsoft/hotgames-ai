# Short Move Checks In Existing Puzzle Guides

- Work ID: HOTGAMES-MOVE-CHECKS
- Date: 2026-10-23 (KST)
- Start: clean main b888163, matching origin/main after fetch; no owner WIP or active writer.
- Approval: useful content and return-visit improvement, simple main, validation
  and deployment. Existing GitHub exception retained; cache work excluded.

## Content

Each existing game guide now has one `#try-a-move-check` section after its stuck
advice, with a short hypothetical question and an expandable explanation:

- Blockzzle: connected horizontal space versus separated empty squares.
- Ringzzle: an occupied small slot cannot accept another small ring; an empty
  medium slot is usable, but mixed colors do not form a same-color burst.
- DaySudoku: a row missing only 5, followed by a counterexample in which two
  possible digits are not enough to make a certain choice.

These are fixed editorial examples, not the player's current board, today's
Sudoku answer, a new game mode, a scored quiz or a Daily Challenge. No performance,
health, popularity or retention claims. They complement existing advice rather
than creating duplicate thin articles.

The directory's existing starting-tip columns link to the three examples. Each
guide's generated contents also includes the new heading. The main HTML is
byte-identical to the starting build: no extra banner, section or control.

## Sources And Implementation

Official public rules checked on 2026-10-23. The web reader could not access
these pages, so their rendered public HTML was read through ordinary curl:

- https://blockzzle.com/block-puzzle/
- https://ringzzle.com/how-to-play/
- https://daysudoku.com/how-to-play/

No game source was imported. The examples are original editorial applications
of the published rules; the Blockzzle shape is explicitly hypothetical.

A small Hugo shortcode renders native details/summary plus Markdown explanation.
It reuses the existing guide-detail 44px styling. No new JavaScript, dependency,
CSS hash, storage, input collection, API, account, analytics or ad. Native keyboard
and no-JavaScript opening work. Existing Play, Save, help, learning links and
legacy fragments remain. No Blockzzle/Ringzzle/DaySudoku repository changes.

The directory build fails if a linked move-check heading is absent. Lastmod on
the four changed guide pages is 2026-10-23T03:36:00+09:00; publication dates and
routes remain unchanged. Hugo also updates the home aggregate sitemap lastmod.

## Validation

- ./tools/check_site.sh: PASS; strict isolated Hugo --gc --minify, 128 pages,
  7 aliases and four unchanged guide stylesheet hashes. Node syntax and Git
  whitespace checks PASS. No generated output/dependencies tracked or staged.
- Sitemap parsed as XML: same 126 unique URLs, timestamps updated for the four
  guide pages plus Hugo's aggregate home entry. No new URLs.
- Main HTML and all guide CSS bytes match the starting build. HTML changes are
  limited to the directory and three details. Old temporary build folders no
  longer contained static assets during comparison, so a full old/new static
  output byte comparison is not claimed. Tracked static sources are unchanged;
  current game illustrations render successfully in both engines.
- tools/check_move_checks.js: Chrome and WebKit each PASS, 102 assertions and
  24 viewport/theme combinations. Covers links/fragments, answers, native click,
  Space/Enter, no-JS, unchanged collections, 44px controls, text fit and images.
- Existing guide-return regression: Chrome and WebKit each PASS, 208 assertions
  and 48 layouts. Combined per engine: 310 assertions / 72 viewport-theme cases.
  Existing outbound Play checks are intercepted in QA, not real gameplay.
- Screenshots inspected: /private/tmp/hg-move-sudoku.png (320px light Chrome),
  /private/tmp/hg-move-ringzzle.png (390px dark WebKit) and
  /private/tmp/hg-move-directory.png (1440px Chrome). No overlap or horizontal spill.
- Physical-device and screen-reader testing, measured business impact: NOT_RUN.

## Release

Pending normal GitHub push, Pages deployment and deployed validation.
Ordinary-domain acceptance will be checked separately without cache intervention.
