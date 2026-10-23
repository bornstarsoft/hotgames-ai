# Collection Focus Continuity

- Work ID: HOTGAMES-COLLECTION-FOCUS
- Date: 2026-10-23 (KST)
- Start: clean main 8b8b528, matching origin/main after fetch; no owner WIP or active writer.
- Approval: useful return-visit improvement, simple main, validation and deployment.
  The existing project-specific GitHub exception remains; cache operations excluded.

## Behavior

Removing a saved or recently opened game now keeps the same action focused on
the next visible card, or the previous card when removing the last item. Undo
returns focus to the restored game's control. Dismissing the notification returns
to the remaining neighbor. Empty lists and Undo after a view change safely fall
back to the page heading, never a hidden collection.

Collection re-renders preserve the focused game and action by identity, including
cross-tab reorder/removal. Search fields and controls outside the cards are not
refocused. Background updates preserve scroll; direct collection actions bring
the target into view. These descriptors exist only in memory, not localStorage.

Full collection save buttons grow from 36px to 44px. Compact home previews still
hide these buttons. While a notification is visible, extra bottom space lets the
last card's actions scroll clear of it. No new home section, card, menu or copy.

## Boundaries

Only layouts/index.html application code changes. No routes, game descriptions,
assets, guide CSS hashes, data formats or storage keys change. No new library,
backend, login, ads, analytics, ranking, game mode or cache operation. Blockzzle,
Ringzzle and DaySudoku repositories untouched. No claimed measured retention lift.

## Validation

- Strict isolated ./tools/check_site.sh and Hugo --gc --minify: PASS, 128 pages,
  seven aliases and four verified guide CSS hashes; no tracked generated output.
- Node syntax and git diff --check: PASS.
- New tools/check_collection_focus.js: Chrome and WebKit each PASS, 145 checks
  across 16 viewport/theme/view combinations (320/390/768/1440px, light/dark,
  Saved/Recent). Includes Enter/Space, pointer, Undo/dismiss, empty/filtered lists,
  sorted lists, cross-tab reorder/removal, input focus and compact preview fallback.
- Early runs exposed small save targets and a notification intercepting clicks;
  both were fixed in source, not bypassed with forced clicks.
- Existing regressions PASS in both engines: saved recency 45/8, storage isolation
  39/8, backup 45/8, search 70/16, share 80/12, guide-return 208/48 and move checks
  102/24 assertions/layouts. Total with new checks: 734 assertions / 140 layouts
  per engine. Isolated profiles only; external Play is intercepted in QA.
- Screenshots inspected: /private/tmp/hg-focus-mobile.png (320px light Chrome),
  /private/tmp/hg-focus-webkit.png (390px dark WebKit), and
  /private/tmp/hg-focus-home.png (1440px Chrome). Images load, home remains compact,
  focus is visible, and mobile remove passes a pointer hit-test above the toast.
- Deployed acceptance: pending.
- Physical iOS/Android and screen-reader announcements: NOT_RUN.

## Release

Pending validated normal GitHub push and Cloudflare Pages integration deployment.
No purge, cache rule/header edit or bypass request will be performed.

## Next Manual Check

Use a physical mobile screen reader to remove a game from Saved and Recent, then
Undo. Confirm the adjacent/restored control is announced and remains operable.
