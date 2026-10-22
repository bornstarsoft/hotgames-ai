# Public Game Search Sharing

- Work ID: HOTGAMES-PUBLIC-SHARE
- Date: 2026-10-23 (KST)
- Start: clean main 6f9de2b, matching origin/main after fetch; no owner WIP.
- Approval: useful return-visit improvement, simple homepage, QA and deployment.
  Existing project-specific GitHub exception retained; cache operations excluded.

## Behavior

The existing Share action now sends a canonical public Discover URL. Only the
current recognized category and trimmed search query are included. Saved/Recent
view selection, personal list IDs, fragments, unrelated URL parameters and
local/preview hostnames are excluded. The sender's current view and lists remain
unchanged. An unfiltered collection shares the public homepage, not a promise to
transfer that collection. Labels distinguish Share game search from Share
HotGames.ai.

On screens at most 620px wide, where the header Share action is already hidden,
the same action is available inside the existing menu. No new homepage section,
banner or card is added. Closing the menu restores keyboard focus and interaction.

Native sharing is attempted when supported for the payload. Cancellation stops
without copying. Unsupported or failed native sharing falls back to copying the
public URL, with truthful success/failure feedback. Overlapping requests are
ignored until the first completes. Sharing does not modify browser-local saves
or recent history. Search terms are intentionally included when sharing a search.

## Scope and Validation

- Application change: layouts/index.html only; no new route or article.
- Existing game copy, Play links, guide styles, sitemap and assets unchanged.
- No game repository changes, backend, account, external JavaScript, dependency,
  analytics, ads, leaderboard, fake ranking or unsupported product claims added.
- Strict isolated ./tools/check_site.sh: PASS; Hugo --gc --minify, 128 pages,
  7 aliases and four guide stylesheet hashes. Output differs only in index.html.
- tools/check_public_share.js: Chrome and WebKit each PASS, 80 assertions and
  12 viewport/theme combinations (320/390/620/621/768/1440px, light/dark).
- Covers public destination, fresh-recipient results, unchanged private lists,
  encoded query, rejected route state, native success/cancel/failure, clipboard
  fallback/denial, duplicate clicks, Back, keyboard focus, responsive controls,
  no-JS menu behavior and application runtime errors.
- Native share and clipboard are stubbed only in isolated QA profiles. No actual
  share target was contacted and no user clipboard was changed by the tests.
- Existing regressions PASS in both engines: search 70/16, backup 45/8 and
  guide-return 208/48 assertions/layouts. Total per engine: 403 assertions and
  84 viewport/theme combinations.
- Screenshots inspected: /private/tmp/hg-share-mobile.png (320px dark Chrome),
  /private/tmp/hg-share-webkit.png (390px light WebKit), and
  /private/tmp/hg-share-desktop.png (1440px light Chrome). Menu text fits and
  existing homepage images render; no new section or control overlap.
- Physical-device native share sheets and measured business effects: NOT_RUN.

## Release Evidence

- Source commit: d0c2aa28c5e92b050c20bc0e8c65e1eaf84fe95d, pushed normally to
  GitHub main. No force push; origin/main matched before release.
- Cloudflare GitHub check 120000205719: Deployed successfully.
- Deployment: e2ad7a90-74a8-4d94-95d1-72f6ea80cf3e,
  https://e2ad7a90.hotgames-ai.pages.dev/.
- Deployed QA PASS: Chrome 80 assertions / 12 layouts on the unique deployment,
  WebKit 80/12 on https://hotgames-ai.pages.dev/. Share/clipboard stubs retained.
- Ordinary-domain acceptance PARTIAL (03:13-03:14 KST): Chrome / and
  /?view=saved returned older HTML without shareMenuBtn. WebKit / also lacked
  that control while its existing mobile menu worked without overflow.
  Chrome /?cat=puzzle&q=Ringzzle included the new action, displayed Ringzzle,
  and generated exactly https://hotgames.ai/?cat=puzzle&q=Ringzzle when clicked.
  A normal curl of / also lacked the new action. Full domain-wide acceptance is
  not claimed. No purge, rule changes, bypass parameters or bypass headers used.
- Temporary QA server 1317 and both task browser sessions stopped. Existing
  watch server 1316 untouched. Generated output/dependencies not tracked/staged.
- Next single task: ordinary-domain acceptance on physical iOS/Android, including
  native share cancellation and recipient open, without changing cache policy.

## Manual Check

1. On physical iOS and Android, open Saved or Recent, enter a game search and use
   Share game search from the menu. Cancel once; nothing should be copied.
2. Share to a chosen destination and open the link in another browser. It should
   show public matching games, not the sender's personal collection.
3. Verify an unfiltered share opens the homepage and existing saves remain intact.
