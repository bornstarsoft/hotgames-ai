# Saved Game List Backup

- Work ID: HOTGAMES-SAVED-BACKUP
- Date: 2026-10-23 (KST)
- Start: clean main e326b5a, matching origin/main after fetch; no owner WIP.
- Approval: useful return-visit improvement, simple main, validation and deployment.
  Existing project-specific GitHub exception retained; cache work excluded.

## Behavior

The full Saved view has two 44px icon actions, Export saved game list and Import
saved game list. They are absent from Discover, Recent and compact home previews.
Import stays available when the saved list or filtered results are empty.

Export downloads the whole saved list, independent of current search/category.
The JSON contains only format `hotgames-saved-games`, version `1` and canonical
`savedGames` IDs in their existing order. It does not include game progress,
recent history, preferences, browser identity or account data. This is manual
file transfer, not cloud sync or a backup of the games themselves.

Import reads a user-selected local file in the browser. It accepts at most 32 KB,
1,000 string IDs and 128 characters per ID, with the recognized format/version.
Unknown catalog IDs are skipped, never converted to HTML, URLs or code. A native
confirmation names the number of additions and unavailable games. Cancel leaves
the list unchanged. Accepted imports merge without replacing existing saves;
duplicates are ignored. The persistent list is re-read after confirmation to
preserve edits from another tab. Undo removes only the newly imported IDs.

Invalid, empty, already-saved and unavailable-only files get factual feedback.
If browser storage fails, the list works for that visit and is labeled temporary.
Export reports a download request, not guaranteed completion. There is no file
upload endpoint, new dependency, account, tracking, ad, API or backend.

## Scope and Validation

- Application change: layouts/index.html only. No new public route or article.
- Existing game copy, links, guide styles, sitemap and generated assets unchanged.
- No Blockzzle, Ringzzle or DaySudoku repository/code changes.
- Strict isolated `./tools/check_site.sh`: PASS; Hugo --gc --minify, 128 pages,
  7 aliases, four guide CSS hashes. Build comparison differs only in index.html.
- `tools/check_saved_backup.js`: Chrome and WebKit each PASS, 43 assertions and
  8 viewport/theme combinations (320/390/768/1440px, light/dark).
- Covers round-trip download/import, filtered export, invalid/oversize/versioned
  files, duplicate and unknown IDs, cancellation, merge/Undo, cross-tab changes,
  failed storage, no-JS controls and unchanged recent history/sort preference.
- The bulk test controls confirmation decisions because the CLI interrupts at
  native modals. Separately verified actual keyboard file chooser in both engines,
  native Chrome cancellation and native WebKit confirmation/merge without stubs.
- Screenshots inspected: /private/tmp/hg-backup-mobile.png (320px dark Chrome)
  and /private/tmp/hg-backup-webkit.png (390px light WebKit). No overflow/overlap
  in backup controls. Existing illustrations load correctly.
- Existing regressions PASS in both Chrome and WebKit: search 70 assertions / 16
  layouts; guide-return 208 assertions / 48 layouts. Total per engine: 321
  assertions / 72 viewport-theme combinations, plus native dialog checks.
- Deployment evidence: pending normal GitHub push and Pages verification.
- Physical-device file-provider testing and measured business impact: NOT_RUN.

## Manual Check

1. In Saved, download a list while a search is active; all saved games must be in it.
2. On another browser, import that file, confirm additions and verify existing
   saved games remain. Game progress must not be presented as transferred.
3. Try Cancel, Undo and the same file again; no duplicates or unrelated losses.
4. Verify the file provider/download experience on actual iOS and Android devices.
