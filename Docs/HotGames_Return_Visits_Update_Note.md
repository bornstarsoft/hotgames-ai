# Search And Return Visits Update

Date: 2026-09-08
Phase: Implementation and validation, followed by the existing GitHub deployment workflow.

## Changes

- Fixed a reproduced display bug: searching for `sudoku` reported one result but rendered Blockzzle, Ringzzle, and DaySudoku because card display styles overrode the native `hidden` attribute.
- Added Discover, Saved, and Recently opened collection navigation with local counts and useful empty states. Opening a collection resets unrelated filters; filters can then be applied within that collection.
- Search supports multiple words and the browser platform label. Search text, category, and collection are preserved in `q`, `cat`, and `view` URL parameters, reloads, and browser history. Unrelated query parameters remain intact.
- Renamed Recently played to Recently opened: HotGames observes outbound link activation, not actual gameplay or completion.
- Preserved native link opening from saved/recent cards and modifier or middle clicks. Only game IDs are recorded locally, with at most six recent IDs.
- Restored compatibility with the older URL-based favorite IDs and raw theme preference shared by detail/list pages.
- Validated stored data types, removed unknown or duplicate IDs from rendered lists, and added in-memory fallback when persistent browser storage is unavailable.
- Added cross-tab collection updates and Undo for clearing saved or recent collections.
- Gave saved/recent cards the catalog layout, aligned card actions, and protected featured titles from the save control.
- Added a mobile menu close control, Escape/focus handling, and inert background/closed-menu handling.
- Removed the page-hiding initialization in the shared head; normal game links remain available without JavaScript.

## Validation

- `hugo --gc --minify --destination /private/tmp/hotgames-return-build` succeeds (129 pages). Build output remains outside the repository.
- `git diff --check` passes. No repository-local check script was present.
- Playwright checked actual rendered card visibility, not just the `hidden` property: `sudoku` shows only DaySudoku; `browser rings` shows only Ringzzle.
- Passed combined filters, search reload, Back/Forward, invalid category fallback, empty-state recovery, saved collection access, and saved/recent clear plus Undo.
- Undo preserves games added in another tab after clearing. Checked filtered Surprise me on mobile, unrelated URL parameters, and theme consistency when navigating to a detail page and back.
- Verified saved and recent play links open the expected native popup. External game responses were mocked for these click tests; no game scores or external game state were changed.
- Passed legacy favorite/theme data, malformed stored data, duplicate/unknown IDs, persistence after reload, cross-tab updates, blocked storage fallback, and a JavaScript-disabled catalog.
- Checked 320, 390, 768, 1280, and 1440px viewports: no document overflow or card titles/actions outside their card bounds. Inspected desktop/mobile screenshots in light and dark themes.
- Checked mobile close control placement, keyboard focus containment, Escape, focus restoration, and hidden-menu exclusion. No JavaScript runtime errors in the checked flows.

## Boundaries

- Existing routes, game destinations, and Blockzzle/Ringzzle/DaySudoku detail content remain unchanged.
- No other repository was modified. No new analytics, ads, backend, account, API, npm dependency, or build tool was added to HotGames.
- No ranking, popularity, review, or gameplay-completion claim was added.
- Saved/recent collections are local to the browser, not account-synced. Storage blocking permits use for the current visit only; reload persistence is unavailable in that case.
- Follow-up: verify the production homepage and the shared `/?q=sudoku` search after deployment. The existing detail/list-page theme handlers are otherwise unchanged.
