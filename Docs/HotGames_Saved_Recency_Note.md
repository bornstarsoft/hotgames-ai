# Recently Opened Sorting For Saved Games

- Work ID: HOTGAMES-SAVED-RECENCY
- Date: 2026-10-23 (KST)
- Start: clean main 93f8e9c, matching origin/main after fetch; no owner WIP or active writer.
- Approval: useful return-visit improvement, simple main, validation and deployment.
  Existing project-specific GitHub exception retained; cache operations excluded.

## Behavior

The existing full Saved list's native sort menu now includes Recently opened,
between Recently saved and Name A-Z. It puts saved games present in this browser's
retained recent history first, in that history's order. Other saved games retain
newest-saved order. Missing or malformed history falls back to newest-saved order.
The existing recent-history limit remains six; no timestamps, additional history
or background activity are collected. This is not an all-time last-played ranking.

Only a copy is sorted. Saved IDs, insertion order and recent history are not
rewritten by selecting a sort. The existing savedGameOrder preference accepts
`recent`; invalid values still use `newest`. The choice survives reload and syncs
across tabs. Failed persistence is labeled temporary, as for the existing choices.

Opening a saved game through its existing Play link updates recent history and
therefore its visible position. History removal/clear and Undo update the ordering.
Saved removal/Undo, search, category filters and backups keep their existing
semantics. Empty Saved hides the collection header as before but retains the choice.

The main remains unchanged: compact Saved previews show the newest two saves,
not the recency sorting, and no sorting control or section is added to Discover
or Recently opened. The existing illustrations and game copy are unchanged.

## Boundaries

Only layouts/index.html application code changes. No new route, guide article,
dependency, account, backend, analytics, ads, cache configuration or game code.
Blockzzle, Ringzzle and DaySudoku repositories untouched. No claims about
popularity, rankings, revenue or measured retention improvement.

## Validation

- ./tools/check_site.sh: PASS, strict isolated Hugo --gc --minify, 128 pages,
  7 aliases, four guide stylesheet hashes. Build differs only in index.html;
  detail pages, sitemap and assets are byte-identical to the starting release.
- Node syntax and git diff --check: PASS.
- tools/check_saved_recency.js: Chrome and WebKit each PASS, 45 assertions and
  8 viewport/theme combinations (320/390/768/1440px, light/dark).
- Covers ranking/fallback, unchanged storage, remembered preference, filters,
  compact previews, empty list, remove/clear Undo, actual cross-tab storage
  changes, native Play launch, malformed/legacy/duplicate history, invalid
  preferences, failed storage, mobile geometry and focus.
- Tests use isolated browser profiles and intercept Ringzzle Play with a QA
  response; no real gameplay or owner storage is affected. The first test run
  incorrectly expected the empty collection's hidden sort to be visible; the
  assertion was corrected without changing existing empty-list behavior.
- Existing regressions PASS in both engines: storage isolation 39/8, backup
  45/8, search 70/16, share 80/12 and guide-return 208/48 assertions/layouts.
  Including this feature: 487 assertions and 100 viewport/theme combinations
  per engine. Share/clipboard APIs stubbed only in isolated QA profiles.
- Screenshots inspected: /private/tmp/hg-recency-mobile.png (320px light Chrome),
  /private/tmp/hg-recency-webkit.png (390px dark WebKit), and
  /private/tmp/hg-recency-home.png (1440px Chrome). Native select text fits,
  game illustrations load, and compact home sections remain unchanged.
- Physical-device native picker and measured business effects: NOT_RUN.

## Release

Pending normal GitHub push, Pages deployment and deployed validation.
Ordinary-domain rollout will be checked separately without cache intervention.
