# HotGames Puzzle Discovery Visual Update

- Work ID: HOTGAMES-PUZZLE-VISUALS
- Phase: implementation and local validation. No release or deployment.
- Repository: /Users/seongjinkim/BornStarSoft_Publishing/github_hugo/hotgames-ai
- Starting state: main, clean, HEAD bb559f8; matched the locally recorded origin/main. No remote fetch was performed.

## Changes

- Generated three editorial puzzle illustrations with the built-in image generation tool. These are not actual game screenshots and are labeled as illustrations.
- Replaced the Blockzzle homepage cover and Ringzzle/DaySudoku icon fallbacks with optimized WebP covers.
- Each cover has 960x640 and 480x320 variants. All six files total 148,476 bytes; no new image or build dependency was installed.
- Homepage featured cards show the complete descriptions, clear puzzle-type labels, prominent Play links, and a link to the comparison section.
- /games/ now presents the three games, a play-style comparison, and native expandable pre-play questions.
- /games/blockzzle/, /games/ringzzle/, and /games/daysudoku/ use a shared game-specific layout with artwork, immediate Play links, and the existing Markdown content. Unrelated news recommendations are absent from these game pages.
- The original three game Markdown files are unchanged. The game-specific templates do not change news, other categories, or article templates.
- Existing search, categories, saved games, recently opened, native external-link behavior, and homepage theme preferences are retained.
- Play links on game guides and the directory also record the opened game in the existing browser-local recentGames history. No event is sent to an analytics service, and native navigation is not intercepted.
- The existing /games/page/1/ alias is preserved through Hugo pagination.

## Destinations

| Anchor | URL |
| --- | --- |
| Play Blockzzle | https://blockzzle.com/play/ |
| Play Ringzzle | https://ringzzle.com/play/ |
| Play DaySudoku | https://daysudoku.com/ |

All three are normal crawlable links without nofollow. Existing Ringzzle and Blockzzle leaderboard links remain in their original Markdown.

## Assets

- static/images/games/blockzzle-cover.webp
- static/images/games/blockzzle-cover-480.webp
- static/images/games/ringzzle-cover.webp
- static/images/games/ringzzle-cover-480.webp
- static/images/games/daysudoku-cover.webp
- static/images/games/daysudoku-cover-480.webp

Source illustrations were generated as 1536x1024 PNGs. The bundled Sharp runtime was used only for proportional resizing and WebP encoding (quality 82). Source PNGs remain in the image tool's generated-images directory. The site depends only on the six local WebP assets.

## Scope And Claims

- Blockzzle remains a block puzzle, Ringzzle a color rings puzzle, DaySudoku a daily Sudoku/Key9 puzzle.
- Game facts come from the owner-provided brief and existing approved content; no new gameplay feature is asserted.
- No fabricated rankings, popularity, reviews, traffic, health, or cognitive-benefit claims.
- No DaySudoku leaderboard, account, archive, synchronized streak, or unsupported difficulty claims.
- No game source, iframe, backend, login, ads, analytics, email capture, API, dependency, or build tool added. Existing GA4 and icon stylesheet are untouched.
- No Blockzzle, Ringzzle, DaySudoku, Unity, or other repository modifications.
- No public/, resources/_gen/, or node_modules/ generated files are intended for staging. Builds and optimized-resource caches are redirected to /private/tmp.
- Git hosting is not changed. This implementation is not committed or pushed; the current GitHub remote and latest global Gitea-only instruction need a project-specific decision before release work.

## Validation

- No pre-existing repository-local check script was found. No project validation dependency was added.
- Hugo 0.152.2: `hugo --gc --minify --destination /private/tmp/hotgames-visual-build --cacheDir /private/tmp/hotgames-visual-build-cache` with `HUGO_RESOURCEDIR=/private/tmp/hotgames-visual-build-resources`: PASS (129 pages, 11 paginator pages, 7 aliases).
- `git diff --check`: PASS.
- Compared a HEAD archive build with the working build: all 144 HTML paths and all 126 unique sitemap URLs are retained. Intended HTML changes are homepage, /games/, and the three game detail pages. One unrelated, pre-existing duplicate output path can also differ between builds; see the warning below.
- HTMLParser checks: all three exact Play anchors/destinations remain crawlable; internal links and comparison anchors resolve; cover files, alt text, dimensions, and responsive srcsets exist; both existing leaderboard links remain.
- Playwright: search visibility/reload, 24-game catalog, saved games, native popup navigation, recently opened/clear/undo, directory Play history, comparison anchor, expandable questions, theme persistence, and mobile menu/Escape: PASS.
- Responsive image/overflow checks on homepage, /games/, and DaySudoku detail at 320, 390, 768, 1024, 1280, and 1440 pixels: all 18 combinations PASS; no broken cover images or runtime errors.
- Desktop/mobile and dark/light screenshots were inspected. JavaScript-disabled game directory still exposes Play links and comparison content.
- Malformed recentGames history recovers on the next guide Play click; blocked localStorage does not break guide theme controls or native Play navigation: PASS.
- External game destinations were mocked in automated interaction tests; no game scores or remote state were changed. Production deployment and live destination uptime are not verified by these local tests.
- No generated public/, resources/_gen/, or node_modules/ files are tracked or staged. No files are staged and no commit/push/deployment is performed.

### Existing Build Warning (Resolved In Follow-Up)

- `hugo --printPathWarnings` on the unchanged HEAD archive reports a duplicate output target: /posts/anticipating-hozy-cleaning-sandbox-puzzle-game/index.html.
- Existing sources content/posts/2026-01-20-game-191735.md:4 and content/posts/2026-01-20-game-192215.md:4 share the same slug. Their competing article body output caused the final strict byte-for-byte comparison to fail for that path.
- Neither source nor the news template was changed. The scoped comparison excludes only that known collision and verifies the other unchanged HTML outputs exactly. URL-set, sitemap, and all puzzle-specific checks pass.
- Follow-up HOTGAMES-URL-CLEANUP retains the earlier draft at the same URL and preserves the later draft under Docs/ArchivedContent/. The warning is now resolved. See HotGames_Duplicate_URL_Cleanup_Note.md for the source-preservation checks and new `./tools/check_site.sh` validation command.

## Handoff

- Local preview: http://127.0.0.1:1315/ and http://127.0.0.1:1315/games/.
- Before publishing, confirm the project-specific GitHub hosting exception or the applicable Gitea policy. Do not change remotes automatically or force push.
- After an explicitly approved release, check production homepage, /games/#compare, all three Play destinations, image requests/content types, and mobile layout through the existing Cloudflare cache setup.
- This is a usability/visual update, not evidence of increased traffic, retention, satisfaction, or revenue. Those outcomes require actual usage data.

## Exact Generation Prompts

### Blockzzle

```text
Use case: stylized-concept. Asset type: editorial game cover for HotGames.ai, wide landscape 1536x1024. Create a polished playful 3D editorial illustration for Blockzzle, a browser BLOCK puzzle, showing tangible cobalt blue, mint green, coral and golden-yellow small square blocks joined into clear L, T, short line and square polyomino pieces arranged loosely over a clean pale mint surface with a subtle square board beneath. All blocks are sharply visible, matte resin with soft bevels, close overhead three-quarter product composition, soft daylight, clean modern game editorial art. Board and pieces fill the central 75 percent, generous safety area at edges, no cropped objects. This is an illustration of block puzzle pieces, NOT a screenshot or invented game interface. Do not show text, logos, letters, digits, scores, UI, hands, trophies, characters, gradients, floating decorative orbs, or bokeh. Landscape composition optimized for 3:2 cover; distinct square silhouettes. Crisp, inviting, professional.
```

### Ringzzle

```text
Use case: stylized-concept. Asset type: editorial cover illustration for Ringzzle, a COLOR RINGS browser puzzle on HotGames.ai. Wide landscape 1536x1024. Polished tactile 3D illustration, overhead three-quarter angle. Nine clear positions in a 3-by-3 arrangement on a pale lilac square tray; each position holds one, two or three flat concentric colorful rings of different diameters, with hollow centers visible. Rings in vivid coral red, lemon yellow, cyan blue, mint green, violet. Several matching coral rings visually align across the middle row. Only a few spare colorful rings rest near the tray. Matte resin with rounded smooth edges, soft studio daylight, very light cool lavender background, subtle shadows, all central objects sharp. Board and rings fill the central 75 percent with edge safety area. This is an editorial illustration of a color ring puzzle, NOT an actual game screenshot. No text, logos, numbers, invented interface, scoreboard, medals, hands, people, sparkles, bokeh or decorative floating orbs. Clearly ring-shaped, never solid disks. Clean premium playful cover, landscape 3:2.
```

### DaySudoku

```text
Use case: stylized-concept. Asset type: editorial cover illustration for DaySudoku, a daily Sudoku browser puzzle with a Key9-first flow. Wide landscape 1536x1024. Create a polished tactile 3D illustration of a white square Sudoku board clearly divided into a 9 by 9 grid with heavier lines after each 3 cells. Sparse cobalt-blue numeric givens, many empty cells, a single coral-red tile bearing the digit 9 near the board. The 9 is a visual motif only, not a claim about an interface. Overhead three-quarter angle, soft daylight, clean pale sky-blue studio surface, matte porcelain board, precise grid, premium approachable puzzle editorial artwork. Digits on the grid from this valid Sudoku, with zeros left blank: 530070000 / 600195000 / 098000060 / 800060003 / 400803001 / 700020006 / 060000280 / 000419005 / 000080079. Board centered, entire board visible, 15 percent safe margin, avoid cropping. Light blue and white palette accented by coral, sharp all-over, attractive but restrained. This is an editorial illustration NOT a DaySudoku screenshot; do not invent game UI. No words, title, logos, buttons, scores, medals, timer, dates, hands, people, ornamental spheres, bokeh or gradients. Landscape 3:2.
```
