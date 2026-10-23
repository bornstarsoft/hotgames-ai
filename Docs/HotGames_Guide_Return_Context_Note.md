# Return From Guides To The Original Game List

- Work ID: HOTGAMES-GUIDE-RETURN-CONTEXT
- Date: 2026-10-23 (KST)
- Start: clean main 638c2e6, matching origin/main after fetch; no owner WIP or other writer.
- Approval: useful return-visit improvement, simple main, validation and deployment.
  Existing project-specific GitHub exception retained; cache operations excluded.

## Behavior

The existing top and bottom guide links now return to the catalog context when
the browser provides a same-origin root-page referrer. Labels distinguish Saved,
Recently opened, filtered game results and the unfiltered catalog. The return URL
preserves only view, cat and q; unknown views, other parameters and fragments are
discarded. URLs are parsed and rebuilt, never treated as arbitrary redirect targets.

There are no additional controls. Direct entry, missing/invalid/external referrers,
entry from another guide and no-JavaScript browsing retain the original Puzzle
guides / Saved games destinations. The current document alone provides the context:
no cookies, localStorage keys, tracking, server calls or history APIs are added.
If browser privacy settings remove the referrer, context restoration is unavailable
and the normal fallback remains. This does not restore a game board or scroll offset.

Existing Play, Save, Undo and tip-copy actions remain separate. Shared tip links
still contain only the public guide URL and section, never private list/search
context. Reading a guide still does not count as opening a game.

## Boundaries

Only layouts/games/baseof.html and single.html application code changes. No home
section, menu, game copy, route, image, CSS hash, dependency, login, backend, ads,
analytics or unsupported claim. Other game repositories remain untouched.

## Validation

- ./tools/check_site.sh: PASS, strict isolated Hugo --gc --minify, 128 pages,
  seven aliases and four verified guide CSS hashes.
- Node syntax, git diff --check and generated-output hygiene: PASS.
- Main HTML and sitemap byte-identical to the previous release build.
- New tools/check_guide_context.js: Chrome and WebKit each 141 assertions / 24
  layouts, covering all three guides from Saved/Recent/Discover, keyboard return,
  query/category preservation, reload, unsafe/missing referrers, encoded query,
  no-JS fallback, unchanged collections and privacy of copied tip links.
- Existing guide-return 208/48, move-checks 102/24 and tip-links 274/24 PASS in
  both engines. Total: 725 assertions / 120 layouts per engine.
- Initial new-test failure read page.url before keyboard navigation completed;
  fixed the test with waitForURL. Application code was not changed to bypass it.
- Screenshots inspected: /private/tmp/hg-context-mobile.png and hg-context-end.png
  (320px Chrome light), hg-context-desktop.png (1440px WebKit dark).
- Tests use isolated profiles; existing external Play and clipboard actions are
  mocked. Physical mobile browser/privacy modes and screen readers: NOT_RUN.

## Release

Pending normal GitHub push, Cloudflare Pages deployment and ordinary-domain checks.
No cache purge, rule/header change or bypass request is authorized.

## Next Manual Check

On physical mobile, filter Saved or Recent, open Puzzle help, then follow either
return link. Confirm the same list and search return. With referrer information
disabled, confirm the ordinary guide/Saved fallback instead of promising context.
