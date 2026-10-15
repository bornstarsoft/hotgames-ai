# Save Games From Puzzle Guides

- Work ID: HOTGAMES-GUIDE-SAVE
- Date: 2026-10-15 (Asia/Seoul)
- Starting HEAD: ad8ca42, clean main matching origin/main after fetch.
- Owner scope: choose a modest returning-user improvement, keep the homepage simple, preserve existing work, validate and deploy the actual site.
- GitHub hosting exception remains approved. Use the existing Git-integrated Cloudflare Pages project, not a new deployment destination.

## Change

- Add 44-by-44 CSS-pixel heart buttons next to Play on /games/ and the Blockzzle, Ringzzle, and DaySudoku detail pages.
- Reuse likedGames, the same browser-local collection used by the homepage. No new storage key, account, database, remote API, analytics, or dependency.
- Accessible names, tooltip titles, pressed state, keyboard activation, and a live status message follow save/remove actions.
- Read current storage before each write; preserve other catalog entries, normalize the guides' legacy URL IDs, and deduplicate them.
- Synchronize guide controls on storage events and pageshow, including Back/Forward cache restoration.
- Refresh the homepage's cached data on Back/Forward restoration. Keep its layout, content, recommendations, and navigation unchanged. Preserve its existing session-only fallback when persistence fails.
- Failed guide saves report failure without falsely showing a saved state. JavaScript-disabled users keep native Play links; unavailable save buttons stay hidden.
- No game facts, game repositories, images, URLs, rankings, ads, or Cloudflare settings changed.

## Validation

- PASS: strict isolated Hugo build via ./tools/check_site.sh, 128 pages, 11 paginator pages, 7 aliases; no warnings. git diff --check and generated-output tracking guard passed.
- Chrome Pixel emulation and WebKit iPhone emulation: save/remove, visible feedback, tooltip/pressed state, keyboard focus and activation, directory-to-home and home-to-detail persistence, two-way cross-tab sync, legacy/duplicate IDs, unrelated favorites, malformed storage, native Play links, recent history, blocked/quota-limited storage, and no-JavaScript behavior.
- Home restoration defect was reproduced before the fix (stored favorite present, displayed count still zero). Restored-page refresh and browser Back now show current saved data. Separate blocked/quota tests confirm existing session-only homepage favorites survive restoration.
- Responsive checks: /games/ plus all three detail pages, widths 320/390/768/1440, light/dark, two engines: 64 combinations. Save controls meet the 44-pixel target; no tested text/document overflow or missing cover images. Mobile and tablet screenshots inspected.
- Initial WebKit attempt was interrupted when the previously configured cached runtime path disappeared. Retried with the currently installed standard WebKit runtime; no project dependencies or global configuration were changed.
- Automated browser checks suppress existing analytics and mock external game navigation. They do not validate gameplay or establish improved return rates.
- Physical iPhone/Android hardware checks remain NOT_RUN.

## Deployment

- Deployment authorized through the existing GitHub main to Cloudflare Pages integration.
- Before pushing, stage only the intended source and documentation files; exclude public/, resources/_gen/, node_modules/, and temporary test artifacts.
- Verify the Cloudflare Pages check for the pushed source commit, then normal production URLs (without cache-busting queries), the fingerprinted CSS, and browser-local save/return behavior.
- Production verification is pending until the release result is recorded below; a successful Git push alone is not deployment evidence.

### Release Result and Cache Handoff

- Source commit: 9542761b33e12524e1c94bf20316e78dc65e26bc, Add saved-game controls to puzzle guides; pushed to GitHub main without force.
- Cloudflare Pages check: completed/success at 2026-10-15 15:17:50 KST. Deployment ID: 3bbf6fd9-1ccd-4f37-bc62-0434546f6dff.
- Unique deployment URL: https://3bbf6fd9.hotgames-ai.pages.dev/. WebKit verification passed directory save -> homepage collection -> detail removal -> browser Back.
- Actual https://hotgames.ai/games/daysudoku/ returned the new controls, but normal /games/ and / still served older HTML during production acceptance. The /games/ response at 15:23:34 KST was HTTP 200, CF-Cache-Status HIT, Age 348, with no save controls; the unique deployment URL contained the controls. Thus this is a confirmed stale-cache boundary, not proof of complete custom-domain acceptance.
- Cloudflare dashboard required login. Owner was asked to authenticate directly in the opened dashboard tab; no credentials were read, requested, stored, or entered by the agent. No cache or security settings changed.
- Final acceptance remains pending: clear affected HTML cache after owner login, then rerun the normal-domain save/home/detail/Back workflow and verify fingerprinted CSS and sitemap. No query-string cache bypass should be substituted for the normal URL checks.

## Regression Checklist

1. Save a puzzle from /games/ and open Saved games in the header; confirm it is present on the homepage.
2. Remove it on its detail page, go Back, and confirm the home collection is current.
3. Change a favorite in a second tab; confirm both homepage and guide controls update without reload.
4. Confirm an unrelated catalog favorite survives guide changes; test legacy IDs and malformed likedGames data in an isolated profile.
5. Deny storage or simulate quota failure; guide controls must report failure, not saved success. Existing homepage session-only records should survive persisted pageshow.
6. Check mobile touch and keyboard activation, native Play links, light/dark layout, and JavaScript-disabled navigation.
