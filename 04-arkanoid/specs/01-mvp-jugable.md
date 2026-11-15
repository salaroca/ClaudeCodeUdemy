# SPEC 01 — MVP jugable de Arkanoid

**Estado:** Aprobado  
**Depende de:** —  
**Fecha:** 2026-11-15  
**Objetivo:** Crear un Arkanoid jugable con paleta, bola, bloques, 3 vidas y puntuación en un único nivel fijo.

---

## Scope

### Dentro

- `index.html` + `game.js` (canvas 2D, sin bundler)
- Paleta controlada con flechas izq/der
- Bola que rebota en paredes, techo, paleta y bloques
- 1 nivel: grid fijo 10×5 de bloques de colores (usando sprites del spritesheet existente)
- 3 vidas; se pierde una cuando la bola cae por el fondo
- Score: +10 por bloque roto, visible en HUD
- Estado `ready` — bola pegada a la paleta, Space para lanzar
- Estado `playing` — juego en curso
- Estado `gameover` — 0 vidas; pantalla con score, R para reiniciar
- Estado `win` — 0 bloques; pantalla con score, R para reiniciar
- Animación de explosión al romper bloque (`EXPLOSION_FRAMES` del spritesheet)

### Fuera

- Power-ups (spec posterior)
- Múltiples niveles o progresión (spec posterior)
- Highscore / persistencia localStorage
- Control por ratón o touch
- Bloques con múltiples golpes
- Efectos de partículas adicionales
- Audio / sonidos (spec posterior)

---

## Modelo de datos

```js
// Paddle
{ x, y, w, h, speed }

// Ball
{ x, y, vx, vy, radius, dead }

// Block
{ x, y, w, h, color, dead, explosion: { frame, timer } | null }

// Estado global
state   // 'ready' | 'playing' | 'gameover' | 'win'
lives   // número entero, empieza en 3
score   // número entero, empieza en 0
blocks  // Block[]
ball    // Ball
paddle  // Paddle
```

Colores disponibles en el spritesheet: `gray`, `red`, `yellow`, `cyan`, `magenta`, `hotpink`, `green`.  
El grid 10×5 asigna un color por fila (5 filas → 5 colores del set anterior).

---

## Plan de implementación

Cada paso deja el sistema en un estado funcional/ejecutable.

1. **index.html** — canvas 800×600, incluir `assets/spritesheet.js` y `game.js` en ese orden.
2. **Esqueleto game.js** — obtener contexto canvas, llamar `loadSpritesheet`, arrancar `requestAnimationFrame` con `loop(ts)` → `update(dt)` + `draw()`; limitar `dt` a 50 ms.
3. **Paddle** — clase con `update(dt)` (mover con flechas, clampar a los bordes) y `draw()` (usar `drawSprite` con nombre `'paddle'`).
4. **Ball** — clase con `update(dt)` (mover según `vx`/`vy`, rebotar en paredes y techo) y `draw()` (sprite `'ball'`). En estado `ready`, la bola sigue a la paleta sin moverse.
5. **Layout de bloques** — función `createBlocks()` que genera el grid 10×5 hardcodeado; los colores se asignan por fila.
6. **Colisión bola-bloque** — AABB simple; al colisionar: `block.dead = true`, iniciar animación de explosión, `score += 10`, invertir componente de velocidad correspondiente.
7. **Colisión bola-paleta** — AABB; al colisionar, invertir `vy`; el ángulo de salida varía según la distancia al centro de la paleta (opcional para MVP pero recomendado).
8. **Lógica de vidas** — cuando `ball.y > canvas.height`: `lives--`; si `lives === 0` → `state = 'gameover'`; si no → `state = 'ready'`, reposicionar bola sobre paleta.
9. **Lógica de victoria** — cada frame, si `blocks.filter(b => !b.dead).length === 0` → `state = 'win'`.
10. **HUD y pantallas de estado** — durante `playing`/`ready`: dibujar vidas y score. En `gameover` y `win`: texto centrado con score + "R para reiniciar". Tecla R → reiniciar todo el estado.

---

## Criterios de aceptación

- [ ] El juego arranca abriendo `index.html` sin errores en consola
- [ ] La paleta se mueve con flechas izq/der y no sale del canvas
- [ ] Space lanza la bola desde la paleta en estado `ready`
- [ ] La bola rebota en paredes laterales y en el techo
- [ ] La bola rebota al tocar la paleta
- [ ] Al romper un bloque: desaparece, se reproduce la animación de explosión, score sube 10
- [ ] Al caer la bola por el fondo: se pierde una vida y el juego vuelve a estado `ready`
- [ ] Al llegar a 0 vidas: se muestra pantalla `Game Over` con el score final
- [ ] Al romper todos los bloques: se muestra pantalla `You Win` con el score final
- [ ] Tecla R en `gameover` o `win` reinicia el juego al estado inicial
- [ ] HUD muestra vidas y score durante el juego

---

## Decisiones tomadas

| Decisión | Alternativa descartada | Motivo |
|---|---|---|
| Canvas 800×600 | Tamaños responsive | Decisión explícita del usuario; más espacio de juego |
| Grid 10×5 hardcodeado | Generación aleatoria | Suficiente para MVP; niveles = spec posterior |
| Score +10 plano | Multiplicadores / combos | Simplicidad; puntuación avanzada fuera de MVP |
| Solo teclado (flechas) | Ratón / touch | Reduce complejidad; ratón puede añadirse después |
| Power-ups excluidos | 1–2 power-ups básicos | MVP = mecánica core; power-ups tienen su propia spec |
| 1 golpe por bloque | Bloques con HP | Mecánica más simple y verificable |
| Sin audio | Sonidos en MVP | Decisión explícita; se añadirá en spec posterior |
