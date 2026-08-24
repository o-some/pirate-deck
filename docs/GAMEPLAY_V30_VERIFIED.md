# Pirate Deck — Tactical Gameplay V30 verified

Verified on 2026-08-24 via GitHub Actions run `32680827634` on PR #8.

## Gameplay change

- `Zug beenden` now starts a real enemy/boss phase instead of resolving the fight immediately.
- Boss HP scales from 40 to 150 across the 10-boss route.
- Tula starts with 30 HP; player and boss shields are supported.
- Up to 3 persistent player crew units and 2 enemy crew units can occupy the battlefield.
- Bosses telegraph their next action and have individual mechanics.
- Language challenges rotate between DE→EN, EN→DE and sentence completion.
- Wrong answers play the card with a reduced effect instead of removing it from the boss fight.
- Consecutive correct answers build word combos for bonus damage and shield.
- Boss victories offer one of three persistent run upgrades before advancing.

## Verification

The one-time QA run completed successfully with Node 22.19.0 and locked dependencies:

- JavaScript syntax check: PASS
- Gameplay V30 contract: PASS (85 checks)
- Runtime Source Guard: PASS (3 core + 7 UI sources)
- Style Source Guard: PASS (13 foundation + 1 runtime stylesheet)
- Asset Integrity Guard: PASS (10 bosses + 8 monster images)
- Legacy Gameplay Contract V26: PASS (186 checks)
- Release Integrity: PASS (109 checks)
- Astro 7.2.4 static production build: PASS
- `npm audit --audit-level=high`: 0 vulnerabilities

The temporary QA workflow was removed before merge. Production keeps only `.github/workflows/deploy.yml`.

Rollback branch: `backup/pre-gameplay-v30-20260824`.
