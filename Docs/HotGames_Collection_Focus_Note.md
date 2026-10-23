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
- Deployed QA PASS: Chrome on the unique deployment and WebKit on production
  Pages each passed 145 assertions / 16 layouts.
- Physical iOS/Android and screen-reader announcements: NOT_RUN.

## Release

- Source commit: 14e9040224c4dac2bf765f398114dcb621aaf30a, normal GitHub main push.
- Cloudflare GitHub check 120411224542: Deployed successfully.
- Deployment: 04cbc75f-8784-4a30-8ba8-0b4d7ac0637b,
  https://04cbc75f.hotgames-ai.pages.dev/.
- Ordinary-domain acceptance PARTIAL (21:24-21:25 KST): normal Chrome direct
  /?view=saved has 44px save controls and preserves Ringzzle button focus after
  removing Blockzzle at 390px, with no overflow. The root home still serves old
  markup; WebKit home-to-Saved navigation retains the old 36px/H1 behavior.
  The normal /games/ directory exposes all three previous move-check links.
  Full root-to-collection acceptance is not claimed.
- QA suppresses existing third-party beacons. The expected SRI console failures
  for those stubbed resources are not application runtime failures. No analytics
  was added or configured by this work.
- No purge, cache rule/header edit or bypass request performed.
- Temporary server 1317 and both task profiles stopped; existing 1316 untouched.
  No public/, resources/_gen/ or node_modules/ files tracked or staged.

## Next Manual Check

Verify the ordinary root home serves the new release, then use a physical mobile
screen reader to remove a game from Saved and Recent and Undo. Confirm the
adjacent/restored control is announced and remains operable. Cache operations
remain outside approval.
