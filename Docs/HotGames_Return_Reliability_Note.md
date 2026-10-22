# Returning Visitor Style Reliability

- Work ID: HOTGAMES-RETURN-RELIABILITY
- Date: 2026-10-23 (KST)
- Start: clean main at 9df4b6d, matching origin/main after fetch. ACTIVE_WRITER was NONE.
- Scope: prioritize the unresolved public-page rendering issue over additional homepage features. Owner permits implementation, QA and GitHub deployment; cache operations remain excluded.

## Reproduced Problem

The ordinary /games/ response still referenced an earlier fingerprinted stylesheet. Its 0a749f6f... CSS URL returned HTTP 200 with text/html, not CSS. A new deployment publishes only its currently referenced resource unless older resources are explicitly retained. Previously visited HTML can therefore lose its styles when opened later.

## Change

- Retain the three previous readable CSS sources from this repository's Git history: ad8ca42, 9542761 and c5c5743. These are source snapshots, not copied public/ build output, remote downloads or another product's source.
- A Hugo partial publishes each minified historical stylesheet at its original SHA-256 URL. The old URL serves the original bytes, not a redirect or replacement with today's CSS. New pages still load only the current stylesheet.
- data/guide_style_versions.json records provenance and expected minified hashes. Build-time guards reject edits to historical bytes or an unregistered current CSS change.
- The existing site validator independently checks that all four styles are emitted and their file contents match the hash in their filename. Generated CSS stays outside the checkout.
- No homepage sections, game content, Play targets, JavaScript, storage format, API, accounts, ads, analytics, dependencies, redirects or cache headers/rules changed.

## Future CSS Changes

Before editing the current stylesheet, retain its previous readable source under assets/css/retained/ and add that original hash to the manifest. Then update current_sha256 for the new minified content. Never overwrite an already published hash with new bytes. Keep retained sources unchanged; any later removal requires a separate compatibility decision. A Hugo/minifier upgrade that changes output bytes must also be reviewed, not silently accepted.

Hugo APIs: https://gohugo.io/functions/resources/copy/ and https://gohugo.io/functions/resources/minify/.

## Validation And Release

- PASS: ./tools/check_site.sh, strict isolated hugo --gc --minify, required routes, four emitted styles with matching filename/content SHA-256, git diff --check and generated-file hygiene. 128 pages and 7 aliases retained.
- PASS: all three retained readable sources are byte-identical to git show <commit>:assets/css/puzzle-guide.css (cmp checks).
- PASS: isolated negative manifest fixtures cause Hugo to fail for an unregistered current hash and a changed historical hash. Repository sources were not modified for these fault tests.
- PASS: Chrome and WebKit each passed 46 assertions including 16 layout/theme combinations for captured previous list/detail HTML at 320, 390, 768 and 1440px. Four CSS URLs return text/css with correct SHA-256. Old layout, images, exact Play links, Save and existing saved/recent data survive. Mobile screenshots inspected.
- The captured list uses 0a749f6f... while the captured detail uses ccb5ba78...; both are covered. Replay tests preserve the old HTML rather than replacing it with today's page. Injected Cloudflare scripts are not part of the source change; replay-only script MIME/integrity messages were distinguished from stylesheet errors. Existing analytics suppressed in the isolated QA profile.
- PASS: latest-page WebKit regression suite, 117 assertions including 56 layout states. Current pages still load exactly one guide stylesheet at the unchanged URL.
- PASS: generated home, directory and all three detail HTML files are byte-identical to the prior release's build. No content or homepage controls were added in this reliability-first change.
- Physical-device QA, cache invalidation and measured retention/business effects: NOT_RUN.
- Release: pending normal GitHub push and production acceptance.
