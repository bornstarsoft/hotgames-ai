# HotGames.ai Cloudflare Cache Rules Note

Date: 2026-07-26

## Changes

- The site owner ran Cloudflare Purge Everything after deploying `llms.txt`.
- The existing `Static assets 30d` rule remains active for its configured static file extensions.
- The site owner narrowed the `HTML cache` rule from all `https://hotgames.ai/*` requests to HTML-style paths with no file extension or an `html` extension.
- No Cloudflare credentials, tokens, or account data were added to the repository.

## Validation

- `https://hotgames.ai/games/daysudoku/` returned HTML and changed from `MISS` to `HIT` on a repeated request.
- `https://hotgames.ai/llms.txt` returned `text/plain` and was excluded from the HTML cache rule.
- `https://hotgames.ai/robots.txt` returned `text/plain`.
- `https://hotgames.ai/sitemap.xml` returned `application/xml` and was excluded from the HTML cache rule.
- `https://hotgames.ai/manifest.json` returned `application/json` and was excluded from the HTML cache rule.
- The deployed `llms.txt` matched `static/llms.txt`.
- PageSpeed Insights reported 3/3 for agentic browsing after the purge.

## Scope

- No game listing or game detail content changed.
- No DaySudoku, Blockzzle, or Ringzzle repository was modified.
- No generated `public/` or `resources/_gen/` output is intended for version control.
