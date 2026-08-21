# Release Integrity V24 verification

Purpose: recover safely after the previous chat reached its length limit and verify that Pirate Deck was not left partially uploaded or structurally inconsistent.

- Starting `main`: `75bc3fbbd3cf4555ed120a06220d3392d40c536b`
- Rollback branch: `backup/pre-release-integrity-v24-20260821`
- V20 Runtime Source Guard records present: PASS
- V21 Style Source Guard records present: PASS
- V22 Asset Integrity records present: PASS
- V23 Accessibility records present: PASS
- V23 Pages deployment record present: PASS
- Astro Pages base remains `/pirate-deck`: PASS
- Production workflow remains `deploy.yml`: PASS
- One-time V24 workflow removed after successful deployment: PASS
- Workflow directory clean (only `deploy.yml`): PASS
- Generated Foundation CSS remains build-generated and gitignored: PASS
- Generated UI Runtime V18 remains build-generated and gitignored: PASS
- UI Runtime V18 builder still includes Accessibility V23: PASS
- `index.astro` still uses exactly four runtime script tags: PASS
- Boss asset set remains 10 files: PASS via V22 asset guard
- Monster asset set remains 8 files plus manifest: PASS via V22 asset guard
- Release Integrity V24 guard added to every `dev`/`build` verification chain: PASS
- Release Integrity V24 guard checks 74 repository/release invariants: PASS
- Astro production build with V20/V21/V22/V24 guards: PASS
- GitHub Pages deployment: PASS
- Gameplay, card rules, visual CSS and image assets changed by V24: NO

Release code SHA: `1b96ba49f573bde44fae52e988733fd2d0e9b01b`
Pages verification commit: `b21f67f9cab086657b37cab485f0cb8b611e9dd4`
One-time workflow cleanup commit: `bc3b172d61025db3024b45d21923224f7f84e4ee`

Live: https://o-some.github.io/pirate-deck/
