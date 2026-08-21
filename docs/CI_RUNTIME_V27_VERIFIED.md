# Pirate Deck – CI Runtime V27 verification

Date: 2026-08-21

## Scope

- Align GitHub Pages CI with Node 22.19.0, matching the current `undici` engine requirement.
- Move `actions/checkout` and `actions/setup-node` from v4 to v5 so the workflow no longer depends on deprecated Node 20 action runtimes.
- Pin the project runtime in `.nvmrc` and `package.json`.
- Extend the existing release-integrity guard so the Node/action versions cannot silently regress.
- No gameplay, CSS, sprites, cards, bosses, or visible UI changes.

## QA

One-time PR workflow run `32504813941`: **PASS**.

Verified:

- Node runtime: `v22.19.0`
- `actions/checkout@v5`
- `actions/setup-node@v5`
- dependency install completed without the previous `EBADENGINE` warning for `undici`
- no critical npm audit findings
- Runtime Source Guard: PASS
- Style Source Guard: PASS
- Asset Integrity Guard: PASS
- Gameplay Contract V26: PASS (186 checks)
- Release Integrity V24: PASS (90 checks)
- Astro static build: PASS

## Follow-up

`npm audit` still reports 3 known dependency findings (1 low, 2 high) in the current Astro dependency chain. The available automated fix upgrades Astro to 7.2.4 and is a breaking major-version change, so it is intentionally deferred to a separate dependency-upgrade branch with its own rollback point and regression testing.
