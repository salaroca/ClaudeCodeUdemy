# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con el código de este repositorio.

## Ejecutar el juego

Abrir `index.html` directamente en el navegador, o servirlo localmente:

```bash
npx serve .
# luego abrir http://localhost:3000
```

Sin paso de build, sin bundler, sin dependencias.

## Flujo de trabajo: spec-driven design

Este proyecto usa un flujo de spec-driven design. **No escribir código sin un spec aprobado.**

### Skills disponibles

- `/spec <descripción>` — diseña un nuevo spec guiado (`.agents/skills/spec/`). Pregunta antes de proponer estructura.
- `/spec-impl <NN-slug>` — implementa un spec cuyo estado sea `Aprobado` (`.agents/skills/spec-impl/`). Paso a paso, con pausas para revisar el diff.

### Carpeta `specs/`

```
specs/
  .spec-config.yml          # AutoCreateBranch: true, AutoCommitSteps: false
  01-mvp-jugable.md         # Implementado
  02-destruccion-bloques-animacion.md  # Implementado
  03-sonidos-y-niveles.md   # Implementado
```

Estados válidos: `Borrador` → `En revisión` → `Aprobado` → `Implementado` / `Obsoleto`.

`/spec-impl` solo arranca si el estado es `Aprobado`. Cambiar el estado manualmente en el archivo `.md` antes de lanzarlo.

### Config del workflow (`specs/.spec-config.yml`)

- `AutoCreateBranch: true` — `/spec-impl` crea y cambia a la rama `spec-NN-slug` automáticamente.
- `AutoCommitSteps: false` — los commits de cada paso son responsabilidad del desarrollador.

## Arquitectura

| Archivo | Responsabilidad |
|---|---|
| `game.js` | Toda la lógica del juego (loop, entidades, estados, HUD, colisiones) |
| `levels.js` | `const LEVELS` — 5 layouts de bloques (array de filas de strings/null) |
| `assets/spritesheet.js` | Helpers de spritesheet; debe incluirse antes que `game.js` en `index.html` |

**Helpers del spritesheet** (`assets/spritesheet.js`):
- `loadSpritesheet(cb)` — carga `assets/spritesheet-breakout.png` una sola vez; llama a `cb` cuando está listo.
- `drawSprite(ctx, name, x, y, w, h)` — dibuja un sprite por nombre (`'paddle'`, `'ball'`, `'block_red'`, etc.).
- `drawFrame(ctx, frame, x, y, w, h)` — dibuja un frame crudo (usado para animaciones de explosión).
- `SPRITES` — mapa de coordenadas para la paleta, la bola y los bloques (gray/red/yellow/cyan/magenta/hotpink/green).
- `EXPLOSION_FRAMES` — animación de 4 frames por color; `EXPLOSION_DURATION` = 150 ms por frame.

**Game loop:**
- `requestAnimationFrame` impulsa `loop(ts)` → `update(dt)` + `draw()`. `dt` limitado a 50 ms.
- `state` único: `'ready'` | `'playing'` | `'levelcomplete'` | `'gameover'` | `'win'`.
- Cada entidad tiene `update(dt)`, `draw()` y `dead`; filtrar muertas cada frame.

**Sonidos** (instancias reutilizables, `.catch(() => {})` para autoplay policy):
- `bounceSfx` → `assets/sounds/ball-bounce.mp3` (pared y paleta)
- `breakSfx` → `assets/sounds/break-sound.mp3` (rotura de bloque)

**Niveles** (`levels.js`):
- `LEVELS[i]` — array de filas; cada celda es un color (`'red'`, `'cyan'`, etc.) o `null`.
- `createBlocks(levelIndex)` construye `blocks` a partir de `LEVELS[levelIndex]`.
- Al completar niveles 1–4 → estado `'levelcomplete'`; nivel 5 → `'win'`.
