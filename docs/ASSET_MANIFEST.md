# Pirate Deck — Asset Manifest

## Boss source of truth

Master assets live in Dropbox:

`/[LinguaTurtle]/[Endbosse]/Tulas_Island_10_Original_Bosse_Einzeln_v2/[Freigestellt]/`

The Pirate Deck runtime uses the following canonical roster:

| Level | Boss | Master file | Runtime status |
|---:|---|---|---|
| 1 | Pirat Kai | `Level 1 - Pirat Kai.png` | Stable optimized WebP from `o-some/tulasisland` |
| 2 | Kapitän Brax | `Level 2 - Kapitän Brax.png` | Dropbox preview runtime source |
| 3 | Blackfinn | `Level 3 - Blackfinn.png` | Dropbox preview runtime source |
| 4 | Alt-Kapitän Roderick | `Level 4 - Alt-Kapitän Roderick.png` | Dropbox preview runtime source |
| 5 | Piratenbaron Vargas | `Level 5 - Piratenbaron Vargas.png` | Dropbox preview runtime source |
| 6 | Kapitän Ironhook | `Level 6 - Kapitän Ironhook.png` | Dropbox preview runtime source |
| 7 | Admiral Thorne | `Level 7 - Admiral Thorne.png` | Dropbox preview runtime source |
| 8 | Kartenmeister Corvin | `Level 8 - Kartenmeister Corvin.png` | Dropbox preview runtime source |
| 9 | Schattenfürst Azrak | `Level 9 - Schattenfürst Azrak.png` | Dropbox preview runtime source |
| 10 | Piratenkönig Varkos | `Level 10 - Piratenkönig Varkos.png` | Dropbox preview runtime source |

## Production hardening

The current prototype intentionally wires the real Dropbox master previews for levels 2–10 so every original boss is immediately visible and testable in-game. Before final app packaging, mirror levels 2–10 into this repository as optimized WebP assets under `public/assets/bosses/` and replace the preview URLs with local relative paths. Do not redraw or regenerate these characters.

## Ownership / handling

These are project-owned Tula’s Island assets. Do not replace them with generated lookalikes. Preserve the canonical names and level order above.
