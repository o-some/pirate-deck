# Pirate Deck — Asset Manifest

## Boss source of truth

Master assets live in Dropbox:

`/[LinguaTurtle]/[Endbosse]/Tulas_Island_10_Original_Bosse_Einzeln_v2/[Freigestellt]/`

The Pirate Deck runtime now uses local optimized copies of all ten canonical sprites:

| Level | Boss | Master file | Runtime asset |
|---:|---|---|---|
| 1 | Pirat Kai | `Level 1 - Pirat Kai.png` | `public/bosses/level-01-pirat-kai.webp` |
| 2 | Kapitän Brax | `Level 2 - Kapitän Brax.png` | `public/bosses/level-02-kapitaen-brax.webp` |
| 3 | Blackfinn | `Level 3 - Blackfinn.png` | `public/bosses/level-03-blackfinn.webp` |
| 4 | Alt-Kapitän Roderick | `Level 4 - Alt-Kapitän Roderick.png` | `public/bosses/level-04-alt-kapitaen-roderick.webp` |
| 5 | Piratenbaron Vargas | `Level 5 - Piratenbaron Vargas.png` | `public/bosses/level-05-piratenbaron-vargas.webp` |
| 6 | Kapitän Ironhook | `Level 6 - Kapitän Ironhook.png` | `public/bosses/level-06-kapitaen-ironhook.webp` |
| 7 | Admiral Thorne | `Level 7 - Admiral Thorne.png` | `public/bosses/level-07-admiral-thorne.webp` |
| 8 | Kartenmeister Corvin | `Level 8 - Kartenmeister Corvin.png` | `public/bosses/level-08-kartenmeister-corvin.webp` |
| 9 | Schattenfürst Azrak | `Level 9 - Schattenfürst Azrak.png` | `public/bosses/level-09-schattenfuerst-azrak.webp` |
| 10 | Piratenkönig Varkos | `Level 10 - Piratenkönig Varkos.png` | `public/bosses/level-10-piratenkoenig-varkos.webp` |

## Production status

All ten original boss PNGs were copied from the canonical Dropbox master folder, converted to optimized WebP while preserving transparency, and committed directly to this repository. Boss rendering in `public/pirate-deck.js` uses only local relative `bosses/...` paths. The game no longer depends on Dropbox preview URLs for boss rendering.

Dropbox remains the source of truth for the original high-resolution PNG files. The WebP files in this repository are runtime derivatives for the web/mobile game.

## Ownership / handling

These are project-owned Tula’s Island assets. Do not replace them with generated lookalikes. Preserve the canonical names and level order above.
