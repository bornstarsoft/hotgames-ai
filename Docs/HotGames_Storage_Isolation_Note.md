# Collection State Isolation Across Tabs

- Work ID: HOTGAMES-STORAGE-ISOLATION
- Date: 2026-10-23 (KST)
- Start: clean main bb37693, matching origin/main after fetch; no owner WIP or active writer.
- Approval: useful return-visit improvement, simple main, validation and deployment.
  Existing project-specific GitHub exception retained. Cache work excluded.

## Reproduced Problem

When localStorage writes fail, the homepage keeps changes in memory for the
current visit and labels them temporary. Its storage-event handler nevertheless
cleared every in-memory value when any recognized key changed in another tab.
A theme or sort change could therefore silently discard a temporary saved-game
addition or restore a recently removed game.

The new two-tab browser regression fails against the previous implementation at
`unrelated theme preserves temporary recent removal`, before the source fix.
Storage write failure is injected only in the isolated test page; the other
page generates real same-origin localStorage events.

## Change

- Invalidate only the key changed by another tab, preserving unrelated temporary
  Saved, Recent and sort state. Ignore sessionStorage and unrelated-key events.
- A direct write/removal of the same localStorage key remains authoritative,
  including a temporary value in this tab. An explicit localStorage.clear()
  still clears all local collection state; deleted data is not resurrected.
- Existing storage-recovery behavior is retained: the next successful save
  persists the current temporary collection too, and it survives reload.
- Temporary changes remain per-page memory, not durable backup or cloud sync.
  Closing/reloading before a successful write can still lose temporary data.
- Application change is only the homepage storage-event handler. No new section,
  control, game copy, URL, dependency, API, analytics, account or ad. No game
  repositories changed. Existing exact Play links and generated assets retained.

## Validation

- Strict isolated ./tools/check_site.sh and Hugo --gc --minify: PASS, 128 pages,
  7 aliases, four guide CSS hashes. Node syntax and git diff --check: PASS.
- Full build comparison against previous release: only index.html differs;
  game pages, sitemap and assets are byte-identical.
- tools/check_storage_isolation.js: Chrome and WebKit each PASS, 39 assertions
  and 8 viewport/theme combinations (320/390/768/1440px, light/dark).
- Covers temporary add/remove/sort, real cross-tab theme/recent/sort/saved
  changes, unrelated keys, authoritative remove/clear, recovery and reload.
  sessionStorage and persisted pageshow events are synthetic regression probes;
  a physical-device BFCache cycle is not claimed.
- Existing regressions PASS in both engines: backup 45/8, search 70/16, share
  80/12 and guide-return 208/48 assertions/layouts. Total per engine: 442
  assertions and 92 viewport/theme combinations. Share/clipboard APIs stubbed.
- Screenshots inspected: /private/tmp/hg-storage-mobile.png (320px light Saved)
  and /private/tmp/hg-storage-home.png (1440px dark home), both Chrome. Existing
  controls and game images fit; no new UI. The mobile capture was repeated after
  viewport transition settled rather than accepting an intermediate slide frame.
- Physical-device storage-quota behavior and measured retention/business effect:
  NOT_RUN. No user browser storage or clipboard used by the isolated profiles.

## Release

- Source commit: c3ec5121ef11217fd4dac05724034e776228bf73, normal GitHub main push.
- Cloudflare GitHub check 120005466684: Deployed successfully.
- Deployment: 72e1461f-3b8a-48fd-81fa-783a7e8e1423,
  https://72e1461f.hotgames-ai.pages.dev/.
- Deployed QA PASS: Chrome 39 assertions / 8 layouts on unique deployment;
  WebKit 39/8 on https://hotgames-ai.pages.dev/.
- Ordinary-domain acceptance PENDING (03:22-03:23 KST): normal curl of / and
  Chrome /, /?view=saved, /?cat=puzzle&q=Ringzzle still lack the new storageArea
  guard and serve the earlier handler. The browser routes retain all 24 source
  cards. Full domain rollout is not claimed; no purge, rule/header changes or
  cache bypass requests were made.
- Temporary QA server 1317 and both task browser profiles stopped; existing
  watch server 1316 untouched. Generated output/dependencies not tracked/staged.
- Next single task: confirm the new handler on ordinary hotgames.ai and repeat
  cross-tab Saved/Recent acceptance, including a physical mobile browser; no
  cache intervention without renewed owner approval.
