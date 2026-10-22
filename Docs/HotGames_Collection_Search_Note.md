# Collection Search Recovery

- Work ID: HOTGAMES-COLLECTION-SEARCH
- Date: 2026-10-23 (KST)
- Scope: HotGames.ai only; existing GitHub publishing exception applies.
- Starting state: clean main at 1ed4b24, matching origin/main after fetch.

## Change

Saved and Recently opened searches now identify their scope in the input's
accessible label and placeholder. Empty-result text names the collection.
When matching games exist elsewhere in the catalog, a native "Search all games
(N)" link opens those results while preserving the query and category. The count
comes from unique matching catalog IDs, not popularity or traffic.

This recovery action appears only in filtered collections with zero visible
results. It is hidden on the normal home, when a collection has matches, and
when the whole catalog has no matches. Reset and Browse remain available.
Back/Forward, reload and keyboard Enter preserve ordinary navigation behavior.
No storage writes are introduced. Small screens use wrapping 44px actions.

## Boundaries

- No new home section, game, article, ranking or unsupported marketing claim.
- No accounts, ads, analytics, backend, dependencies, external scripts or game code.
- No Blockzzle, Ringzzle or DaySudoku repository changes.
- Existing illustrations, game pages, URLs, sitemap and guide CSS are unchanged.
- No cache configuration, purge or cache-bypass requests.
- Production build output is isolated outside the repository.

## Validation

- `./tools/check_site.sh`: PASS; Hugo --gc --minify with warnings fatal,
  128 pages, 7 aliases and four verified guide stylesheet hashes.
- Comparing with the previous release build: only index.html differs.
- `tools/check_collection_search.js`: Chrome and WebKit each PASS, 70 assertions
  and 16 viewport/theme combinations (320, 390, 768, 1440px; light/dark).
- Covered scoped empty results, real result counts, retained query/category,
  keyboard activation, Back/Forward/reload, reset, cross-tab save changes,
  special query characters, unchanged local lists and all three Play URLs.
- Initial fixture used a non-catalog ID (2048); corrected to registered Blockzzle
  before the passing runs. This was test data, not an application defect.
- Existing guide-return regression: Chrome and WebKit each PASS, 208 assertions
  and 48 viewport/theme combinations, including storage edge cases and no-JS links.
- Visual inspection PASS: 320px dark Chrome, 390px light WebKit and 1440px light
  Chrome. Actions fit, wrap as needed and do not overlap. Screenshots remain
  outside the repository in /private/tmp/hg-search-{mobile,webkit,desktop}.png.
- Deployment evidence: pending normal GitHub push and Pages verification.
- Physical devices and measured retention/business impact: NOT_RUN.
