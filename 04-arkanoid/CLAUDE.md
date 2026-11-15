# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con el código de este repositorio.

## Ejecutar el juego

Abrir `index.html` directamente en el navegador, o servirlo localmente:

```bash
npx serve .
# luego abrir http://localhost:3000
```

Sin paso de build, sin bundler, sin dependencias.

## Arquitectura

Toda la lógica del juego vive en `game.js`. Los assets se cargan mediante `assets/spritesheet.js`, que debe incluirse antes que `game.js` en `index.html`.

**Helpers del spritesheet** (`assets/spritesheet.js`):
- `loadSpritesheet(cb)` — carga `assets/spritesheet-breakout.png` una sola vez; llama a `cb` cuando está listo.
- `drawSprite(ctx, name, x, y, w, h)` — dibuja un sprite por nombre (`'paddle'`, `'ball'`, `'block_red'`, etc.).
- `drawFrame(ctx, frame, x, y, w, h)` — dibuja un frame crudo (usado para animaciones de explosión).
- `SPRITES` — mapa de coordenadas para la paleta, la bola y los bloques (gray/red/yellow/cyan/magenta/hotpink/green).
- `EXPLOSION_FRAMES` — animación de 4 frames por color; `EXPLOSION_DURATION` = 150 ms por frame.

**Patrón de game loop esperado** (seguir el proyecto asteroids en `../02-asteroirds/`):
- `requestAnimationFrame` impulsa `loop(ts)` → `update(dt)` + `draw()`. Limitar `dt` a 50 ms.
- Variable `state` única (ej. `'playing'`, `'gameover'`).
- Cada clase de entidad tiene `update(dt)`, `draw()` y un booleano `dead`; filtrar entidades muertas cada frame.

**Sonidos:** `assets/sounds/ball-bounce.mp3` y `assets/sounds/break-sound.mp3`.
