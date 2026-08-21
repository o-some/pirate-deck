# Pirate Deck – Lockfile V29 verification

Verified on 2026-08-21 in GitHub Actions run `32506055554`.

- Node: `22.19.0`
- npm: `10.9.3`
- `package-lock.json`: lockfileVersion `3`
- `npm ci`: PASS
- `npm audit --audit-level=high`: `0 vulnerabilities`
- Runtime Source Guard: PASS
- Style Source Guard: PASS
- Asset Integrity Guard: PASS (`10` bosses + `8` monster images)
- Gameplay Contract V26: PASS (`186` checks)
- Release Integrity: PASS (`97` checks)
- Astro static production build: PASS

Deployment now uses `npm ci` so dependency resolution is taken from the committed lockfile instead of being recalculated on every Pages build.

No gameplay, CSS, sprites, cards, bosses, monster data, or visible UI were changed in V29.
