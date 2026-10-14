# Returning-user homepage access

- Work ID: HOTGAMES-RETURN-HOME
- Date: 2026-10-14 (Asia/Seoul)
- Phase: local implementation and validation, not release or deployment.
- Scope: improve access to recently opened and saved games while preserving existing WIP.

## Changes

- Reuse the existing collection sections above discovery recommendations on the homepage.
- Show up to two recently opened games and two most recently saved games when Discover has no search or category filter.
- Show only nonempty collections. New visitors retain the existing discovery experience.
- Add normal View all links to `/?view=recent` and `/?view=saved`, with accessible total counts.
- Keep complete collection views, saved ordering, search, filters, clear controls, and undo unchanged.
- Use compact illustrated rows, side by side when space permits and stacked on mobile.
- Keep destructive clear controls in full collection views only.
- Hide previews during discovery search/filtering; do not duplicate filtered results.
- Keep catalog counts and Surprise me based on source cards, not preview clones.

## Data and boundaries

- Reuse `likedGames` and `recentGames`; no new storage keys or tracking events.
- Recently opened means a game link was activated, not completed play or resumable progress.
- Preserve legacy ID normalization, invalid-data handling, cross-tab updates, and session-only fallback when storage is blocked.
- No new dependencies, external scripts, analytics, login, backend, game mechanics, ranking, or popularity claims.
- Existing analytics was not changed; its requests were blocked during automated checks.
- No changes to other game repositories, remotes, production cache, or deployment configuration.
- Earlier illustrations, game guides, comparison content, and duplicate URL cleanup remain in the working tree.

## Validation

- PASS: `./tools/check_site.sh`, including isolated `hugo --gc --minify --printPathWarnings --panicOnWarning`, `git diff --check`, and generated-file tracking check.
- PASS: Chromium checks for empty, recent-only, saved-only, and combined collections; two-card limits and correct ordering; valid totals with duplicates/unknown IDs; full-list links; search/filter/reset; reload and back/forward navigation.
- PASS: save/remove, clear/undo for both collections, cross-tab changes and clearing, legacy saved IDs, malformed data, blocked storage, and JavaScript-disabled native discovery links.
- PASS: native primary and middle-click game links; keyboard View all; mobile menu and Escape; 24 unique Surprise me source selections.
- PASS: all 24 game titles fit in mobile previews. Layout checks at 320, 390, 768, 1024, and 1440 pixels in light and dark themes found no page or preview-text overflow; local preview images loaded.
- PASS: screenshots inspected at mobile and desktop widths after fonts loaded. No JavaScript runtime exceptions in the main regression suite; blocked analytics requests produced expected network console messages.
- Automated game-destination checks used test responses where routed; they do not validate remote gameplay. No production return-rate or revenue effect has been measured.
- NOT_RUN: Safari/iOS physical-device testing, production deployment, and post-deployment cache verification.

## Manual follow-up

1. Review the local homepage after saving/opening a game in the same browser and origin. Production storage is not shared with localhost or a different localhost port.
2. Check a physical mobile browser before release, including keyboard focus and opening external games.
3. Resolve the GitHub-project exception versus the newer Gitea-only instruction before any commit/push or release work.
