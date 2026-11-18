# SPEC 03 — Sonidos de rebote y progresión de 5 niveles

**Estado:** Implementado  
**Depende de:** SPEC 01, SPEC 02  
**Fecha:** 2026-11-18  
**Objetivo:** Reproducir `ball-bounce.mp3` al rebotar en paredes y paleta, y añadir 5 niveles hardcodeados con progresión (pantalla intermedia, +1 vida por nivel, score acumulado).

---

## Scope

### Dentro

- `game.js`: lógica de sonido, datos de niveles, nuevo estado `'levelcomplete'`, HUD actualizado
- `ball-bounce.mp3` suena al rebotar en pared lateral, pared superior y paleta
- 5 layouts de bloques distintos definidos como datos en `game.js`
- Estado `'levelcomplete'` con pantalla "Level X Complete" y tecla Space/R para continuar
- Al pasar de nivel: `lives++`, `score` acumulado, `currentLevel++`
- Al completar el nivel 5: estado `'win'` (victoria final)
- HUD muestra número de nivel actual durante `ready` y `playing`
- R en `gameover` o `win` reinicia al nivel 1 con estado inicial

### Fuera

- `break-sound.mp3` (ni perdida de vida ni otras acciones sonoras)
- Control de volumen o mute
- Dificultad creciente por nivel (velocidad de bola, etc.)
- Niveles desde ficheros externos (JSON)
- Touch / ratón
- Power-ups

---

## Modelo de datos

```js
// Nuevas variables globales
currentLevel  // entero 1–5
LEVELS        // array de 5 definiciones de nivel (ver abajo)

// Cada nivel es un array de filas; cada fila es un array de strings o null
// string → color del bloque ('red', 'cyan', etc.); null → celda vacía
// Ejemplo:
LEVELS[0] = [
  ['red',  'red',  'red',  'red',  'red',  'red',  'red',  'red',  'red',  'red'],
  ['yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow'],
  // …
]

// Estado global ampliado (añadir a lo existente)
state  // 'ready' | 'playing' | 'levelcomplete' | 'gameover' | 'win'

// Audio (instancias reutilizables)
bounceSfx  // new Audio('assets/sounds/ball-bounce.mp3')
```

Los layouts de los 5 niveles los decide el implementador; deben ser visualmente distintos (distintas formas, densidades y distribuciones de colores). Restricciones: máximo 10 columnas × 8 filas, mínimo 20 bloques por nivel.

---

## Plan de implementación

Cada paso deja el sistema funcional.

1. **Audio** — crear `bounceSfx = new Audio('assets/sounds/ball-bounce.mp3')`. Añadir función `playBounce()` que hace `bounceSfx.currentTime = 0; bounceSfx.play()`. Llamar `playBounce()` en los tres puntos de rebote: pared izquierda/derecha, pared superior, paleta.

2. **Datos de niveles** — definir `const LEVELS = [level1, level2, level3, level4, level5]` al inicio de `game.js`, donde cada `levelN` es un array 2D de colores/null. Los 5 layouts deben ser visualmente distintos.

3. **`createBlocks(levelIndex)`** — modificar la función existente para aceptar un índice (0-based) y construir el array `blocks` a partir de `LEVELS[levelIndex]`. Las celdas `null` se saltan.

4. **Variable `currentLevel`** — añadir `currentLevel = 1` al estado global. Usar `currentLevel - 1` como índice al llamar `createBlocks`.

5. **Condición de fin de nivel** — modificar la comprobación de victoria: si `blocks.filter(b => !b.dead).length === 0`:
   - Si `currentLevel < 5` → `state = 'levelcomplete'`
   - Si `currentLevel === 5` → `state = 'win'`

6. **Estado `'levelcomplete'`** — en `draw()`, mostrar centrado: "Level `currentLevel` Complete! +1 Life" y "Press Space or R to continue". En `update()` o manejador de teclado: Space o R → `currentLevel++`, `lives++`, `createBlocks(currentLevel - 1)`, reposicionar bola y paleta, `state = 'ready'`.

7. **HUD** — añadir "Lvl X" al HUD existente durante los estados `ready` y `playing`.

8. **Reinicio completo** — tecla R en `gameover` y `win` resetea `currentLevel = 1`, `lives = 3`, `score = 0`, `createBlocks(0)`, `state = 'ready'`.

---

## Criterios de aceptación

- [X] `ball-bounce.mp3` suena al rebotar en pared izquierda
- [X] `ball-bounce.mp3` suena al rebotar en pared derecha
- [X] `ball-bounce.mp3` suena al rebotar en pared superior (techo)
- [X] `ball-bounce.mp3` suena al rebotar en la paleta
- [X] No suena ningún audio al romper un bloque ni al perder una vida
- [X] Existen 5 niveles con layouts visualmente distintos (distinta forma/densidad/colores)
- [X] Al destruir todos los bloques de los niveles 1–4 aparece pantalla "Level X Complete"
- [X] La pantalla de nivel completado muestra el número de nivel correcto
- [X] Space o R en la pantalla "Level X Complete" avanza al nivel siguiente
- [X] Al avanzar de nivel `lives` incrementa en 1
- [X] El score no se resetea al cambiar de nivel
- [X] Al destruir todos los bloques del nivel 5 aparece la pantalla de victoria final (`win`)
- [X] El HUD muestra el número de nivel durante `ready` y `playing`
- [X] R en `gameover` reinicia al nivel 1 con 3 vidas y score 0
- [X] R en `win` reinicia al nivel 1 con 3 vidas y score 0
- [x] No hay errores en consola durante toda la partida de 5 niveles

---

## Decisiones tomadas

| Decisión | Alternativa descartada | Motivo |
|---|---|---|
| Un solo spec para sonidos y niveles | Dos specs separados | Ambas features son pequeñas y complementarias; juntas no superan el límite de complejidad |
| Solo rebote de bola suena (`ball-bounce.mp3`) | Incluir rotura + pérdida de vida | El usuario seleccionó explícitamente solo rebotes en paredes y paleta |
| `'levelcomplete'` como estado nuevo | Reutilizar `'win'` para todo | Estados distintos evitan lógica condicional en `draw()`; más legible |
| Lives++ al pasar de nivel, sin tope | Tope en 5 vidas / vida extra cada 2 niveles | Simplicidad; el usuario no indicó ninguna restricción |
| Layouts diseñados por el implementador | Layouts definidos en el spec | El spec describe restricciones (mínimo 20 bloques, máximo 10×8); el diseño concreto no es funcional |
| Score acumulado entre niveles | Reset de score por nivel | Decisión explícita del usuario; el score refleja toda la partida |

---

## Riesgos identificados

- **Autoplay policy del navegador:** `Audio.play()` puede fallar si no hay interacción previa del usuario. Mitigación: ignorar silenciosamente el rechazo con `.catch(() => {})` en `playBounce()`.
- **Rebotes múltiples en el mismo frame:** si la bola toca pared y paleta simultáneamente, `playBounce()` se llama dos veces en un frame → doble sonido. Mitigación aceptable: es un caso raro y el `.currentTime = 0` lo recorta.
