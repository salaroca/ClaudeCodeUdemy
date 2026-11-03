# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the game

Open `index.html` directly in a browser, or serve it locally:

```bash
npx serve .
# then open http://localhost:3000
```

No build step, no bundler, no dependencies.

## Architecture

All game logic lives in a single file: `game.js`. No modules, no imports.

**Game loop:** `requestAnimationFrame` drives `loop(ts)` → `update(dt)` + `draw()`. Delta time (`dt`) is capped at 50 ms to prevent tunneling after tab switches.

**Game state machine:** a single `state` variable with three values: `'playing'`, `'dead'` (respawn countdown), `'gameover'`. The `update()` function branches on this at the top.

**Entity classes:** `Bullet`, `Asteroid`, `Ship`, `Particle`. Each has `update(dt)`, `draw()`, and a `dead` boolean. Dead entities are filtered out of their arrays each frame.

**Asteroid splitting:** size 3 → two size-2 fragments; size-2 → two size-1; size-1 → nothing. The `RADII`, `SPEEDS`, and `POINTS` arrays are indexed by size (index 0 is unused).

**Toroidal space:** `wrap(v, max)` handles edge wrapping for all moving entities.

**Input:** `keys` tracks held keys; `justPressed` tracks one-frame presses (consumed on read via `pressed(code)`).

**HUD:** score (top-left), level (top-center), life icons drawn as mini ship shapes (top-right).
