# Search Input Continuity

- Work ID: HOTGAMES-SEARCH-INPUT
- Date: 2026-10-23 (Asia/Seoul)
- Repository: /Users/seongjinkim/BornStarSoft_Publishing/github_hugo/hotgames-ai
- Baseline: clean main ac95ca0, synchronized with origin/main after fetch.
- Approval: incremental return-visit improvements and deployment using this project's existing GitHub exception. No cache operations.

## Change

Discover, Saved and Recently opened share one search field. During input-method composition, keep the last committed results and URL until composition ends. Ignore shortcut events associated with composition, including the legacy 229 boundary signal. Avoid rendering twice when the final input repeats the committed value.

Escape and the existing clear button now leave search focused, so the next query can be typed immediately. Clearing preserves the current collection and category. Enlarge the existing icon button from 34px to 44px, with matching input padding; no new UI element or section.

This is input handling, not translated catalog search. Queries still match the existing catalog text. No claim that Korean, Japanese or Chinese game names have been added.

Only layouts/index.html changes application behavior. No new dependencies, external scripts, APIs, analytics, accounts, ads or storage keys. No game source, iframe, fabricated ranking, gameplay promise or other repository changes. Blockzzle, Ringzzle and DaySudoku remain distinct; all three Play URLs stay unchanged.

## Validation

- Baseline reproduction: tools/check_search_input.js fails against ac95ca0 output at intermediate-input URL preservation.
- After fix: Chrome and WebKit each pass 100 assertions / 24 layout cases in the new suite, including lifecycle and event-flag protection, cancellation, Unicode query encoding, duplicate final input, Escape retry, clear button, reload/history and unchanged personal lists.
- Existing regression suites, each engine: collection search 70/16, collection focus 145/16, saved recency 45/8, storage isolation 39/8, saved backup 45/8, public share 80/12, guide context 141/24. Combined with the new suite: 665 assertions / 116 layout cases per engine.
- Widths: 320, 390, 768, 1440; light/dark; 44px target geometry and no horizontal overflow. Screenshots inspected: /private/tmp/hg-search-input-mobile.png and /private/tmp/hg-search-input-desktop.png.
- ./tools/check_site.sh: warning-free isolated Hugo --gc --minify, 128 pages, 7 aliases and four verified stylesheet hashes. node --check for the new test and Node VM parse of generated inline scripts pass.
- Entire generated-tree comparison against the baseline differs only in index.html. All guide HTML, sitemap and static assets unchanged.
- git diff --check passes; public/, resources/_gen/ and node_modules/ are not tracked or staged. Build output stays outside the repository.
- Tests use isolated browser profiles. IME events are synthetic. No real game sessions or owner browser data were used; outbound Play is mocked by the relevant existing tests.
- Physical iOS/Android/desktop IME candidate selection, private browsing and screen-reader testing: NOT_RUN. Retention/business impact: not measured or claimed.

## Deployment

- Source commit: f9874b4be47f672c25f5a7bee01ddd236e1e112b, pushed normally to origin/main.
- GitHub Cloudflare check 120427746135: Deployed successfully.
- Deployment: 50d2bf12-9829-4e19-8ae4-527727c8b4ab, https://50d2bf12.hotgames-ai.pages.dev/.
- Post-deploy search suite PASS: Chrome on unique deployment and WebKit on https://hotgames-ai.pages.dev/ each pass 100 assertions / 24 layout cases.
- Ordinary-domain acceptance NOT PASS at 22:03 KST: normal https://hotgames.ai/ navigation in both engines serves the old 34px clear target, updates query during composition and blurs on Escape. It does not yet demonstrate the new deployed behavior. No global production-domain consistency claim.
- No force push, remote migration, purge, cache-rule/header changes or cache-bypass query was used. This remaining response mismatch is recorded rather than changed, following the owner's exclusion of cache work.
- Isolated server and browser profiles stopped; existing watch server untouched.

## Reference

- [MDN: compositionend](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event)
- [MDN: KeyboardEvent.isComposing](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing)

Next single check: verify normal production root serves the deployed search behavior, without cache manipulation. After that, on physical iOS and Android keyboards, start and cancel a composed query in Saved/Recently opened, clear it, then type a game name without refocusing. Confirm expected candidate handling and unchanged personal lists.
