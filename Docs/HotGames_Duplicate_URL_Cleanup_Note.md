# HotGames Duplicate URL Cleanup

- Work ID: HOTGAMES-URL-CLEANUP
- Phase: source maintenance and local validation, not deployment.
- Repository: /Users/seongjinkim/BornStarSoft_Publishing/github_hugo/hotgames-ai
- Starting HEAD: bb559f8 on main. The working changes are the previous puzzle visual update; they have been retained.

## Resolution

Two articles shared the title, date, original source, and slug
anticipating-hozy-cleaning-sandbox-puzzle-game. Hugo could overwrite that
output with either body depending on build order.

- Keep content/posts/2026-01-20-game-191735.md unchanged as the single published article at the existing URL.
- Move the later duplicate to Docs/ArchivedContent/2026-01-20-game-192215.md. Its entire original draft is preserved below an archive note.
- Do not introduce another public URL, redirect chain, or duplicate thin page.
- Do not change game facts, game repositories, generated public files, analytics, or hosting settings.

## Repeatable Check

Run `./tools/check_site.sh` from the repository. It uses only the existing
Hugo, Git, and system shell, redirects output/cache/resources to a temporary
directory, and treats Hugo warnings (including duplicate paths) as failures.
It also checks whitespace and rejects tracked/staged public/,
resources/_gen/, or node_modules/ output.

## Validation Results

- `./tools/check_site.sh`: PASS, Hugo 0.152.2 builds 128 pages, 11 paginator pages, and 7 aliases with zero warnings.
- `sh -n tools/check_site.sh` and `git diff --check`: PASS.
- Applied the warning-fatal Hugo flags to the pre-change HEAD snapshot: expected exit code 2 on the duplicate target. The guard detects the original defect.
- Compared generated paths with the HEAD snapshot: all 144 HTML paths and all 126 unique sitemap URLs are retained. The duplicate sitemap entry is eliminated.
- Verified the retained article is byte-for-byte unchanged from HEAD.
- Verified the full archived draft text matches its HEAD source, apart from an archive header and trailing newline normalization.
- Verified Docs/ and docs/ are absent from generated output; the archived draft is not published.
- No files are staged. No generated output or node_modules files are tracked or staged.

## Release Boundary

The existing remote is GitHub. The latest global instructions specify Gitea
only. No remote change, commit, push, or deployment is performed without
clarifying the project-specific hosting decision.
