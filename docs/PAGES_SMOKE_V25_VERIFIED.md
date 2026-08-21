# Pages Smoke V25 verification

Purpose: make the GitHub Pages release self-checking after deployment so missing or partially uploaded runtime files are detected automatically instead of leaving a silently broken live game.

- Starting `main`: `e23d84cc0480153bde7e40a31fd3e00c4febea0b`
- Rollback branch: `backup/pre-pages-smoke-v25-20260821`
- Feature branch: `feat/pages-smoke-v25-20260821`
- Main V25 merge: `9a94ce2538d1d69a7b81c0af9dd4fb072d99f01a`
- Production workflow still triggers only from `main`: PASS
- Production workflow still builds Astro before deployment: PASS
- New smoke job runs only after the Pages deploy job: PASS
- Smoke verifier syntax check: PASS
- Production Astro build with V20/V21/V22/V24 guards: PASS
- Pre-merge QA workflow run `32502932574`: PASS
- Post-merge live Pages QA workflow run `32503193408`: PASS
- Live index HTML: PASS
- Generated Foundation CSS: PASS
- Runtime CSS: PASS
- Four runtime JavaScript payloads: PASS
- 10 boss WebP assets: PASS
- 8 monster WebP assets: PASS
- Monster manifest v2 / individual-webp mode: PASS
- Empty deployed payload detection: ENABLED
- HTTP failure/retry handling: ENABLED
- Source-tree path leak detection: ENABLED
- Workflow directory after QA cleanup: only `deploy.yml`
- Gameplay logic changed by V25: NO
- Card rules changed by V25: NO
- Visual CSS changed by V25: NO
- Boss/monster image assets changed by V25: NO

The permanent deployment chain is now:

`build -> deploy -> smoke`

The smoke step executes:

`npm run verify:pages -- https://o-some.github.io/pirate-deck/`

It checks the live page plus 25 required deployed assets and fails the workflow if the Pages payload is incomplete.

Live: https://o-some.github.io/pirate-deck/
