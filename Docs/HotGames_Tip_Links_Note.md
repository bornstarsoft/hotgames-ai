# Direct Links To Useful Puzzle Tips

- Work ID: HOTGAMES-TIP-LINKS
- Date: 2026-10-23 (KST)
- Start: clean main bc35659, matching origin/main after fetch; no owner WIP or other writer.
- Approval: useful return-visit improvement, simple main, validation and deployment.
  Existing project-specific GitHub exception retained; cache operations excluded.

## Behavior

Blockzzle, Ringzzle and DaySudoku guides now have an icon button beside three
existing sections: starting strategy, getting unstuck and the practice move check.
Each copies the public canonical guide URL with its existing section fragment,
so readers can retain or share the specific tip without finding it again in the
whole article. There is no new bookmarking database or claim of measured retention.

The buttons have accessible names, tooltips and 44px targets, reusing existing
guide styles. Long headings wrap naturally. Copy success has its own live status;
it cannot replace or cancel a pending Save Undo. Repeated activation while copying
does not duplicate requests. Unavailable or denied clipboard access displays a
normal Open tip link, never a false success message. No query, preview host,
personal game IDs or browser history is included in the copied URL.

Without JavaScript the existing content, contents links and fragment destinations
remain usable, with no nonfunctional copy buttons. Directory and main UI do not
gain controls. No new article, thin copy, game feature, popularity claim, assets,
dependency, account, backend, analytics, ads or storage key. Game repositories and
existing URLs are untouched. Guide CSS source and all retained hashes are unchanged.

## Validation

- ./tools/check_site.sh: PASS, strict isolated Hugo --gc --minify, 128 pages,
  seven aliases and four verified guide CSS hashes.
- Node syntax, git diff --check and generated-output hygiene: PASS.
- Main index.html and sitemap.xml byte-identical to the previous release build.
- tools/check_tip_links.js: Chrome and WebKit each PASS, 274 assertions / 24
  game/viewport/theme combinations (320/390/768/1440px, light/dark).
- Existing guide-return 208/48 and move-check 102/24 suites PASS in both engines.
  Total: 584 assertions / 96 layouts per engine. One initial Chrome home geometry
  check failed just after viewport resizing; settled geometry and the unchanged
  suite rerun passed. No application code or assertion was changed to bypass it.
- Clipboard is stubbed only in isolated QA profiles. Tests cover canonical links,
  keyboard focus, missing/denied clipboard, duplicate pending requests, retry,
  unchanged saves/history, preserved Save Undo, existing routes and no-JS reading.
  External game Play is intercepted in the existing regression suite.
- Screenshots inspected: /private/tmp/hg-tip-mobile.png, hg-tip-fallback.png
  (320px light WebKit) and hg-tip-desktop.png (1440px dark Chrome).
- Physical mobile clipboard permission/paste and screen-reader announcements:
  NOT_RUN. No user clipboard or owner browser storage used by QA.

## Release

Pending normal GitHub push, Cloudflare deployment and ordinary-domain verification.
No purge, cache rule/header change or bypass request is authorized.

## Next Manual Check

On physical mobile, copy a guide tip and paste it into a note. Open that link and
confirm it lands on the matching section. If clipboard access is denied, verify
the fallback link and screen-reader feedback. Check normal-domain consistency
separately from the unique deployment.
