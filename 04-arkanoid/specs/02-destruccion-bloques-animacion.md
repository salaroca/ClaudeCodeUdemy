# SPEC 02 — Destrucción de bloques con animación de explosión

**Estado:** Aprobado 
**Depende de:** SPEC 01  
**Fecha:** 2026-11-16  
**Objetivo:** Separar la muerte de un bloque (colisión) de su desaparición visual, mostrando la animación de explosión completa con soporte de múltiples explosiones en paralelo.

---

## Scope

### Dentro

- `game.js`: lógica de colisión, actualización de animación y renderizado de bloques
- Bloque marcado como `dead = true` inmediatamente al ser golpeado (deja de colisionar)
- Animación de explosión: 4 frames × 150 ms/frame usando `EXPLOSION_FRAMES` y `drawFrame` del spritesheet existente
- Bloque eliminado del array solo cuando termina la animación (`explosion === null`)
- Múltiples explosiones simultáneas en bloques distintos

### Fuera

- Audio / sonidos (spec posterior)
- Power-ups ni cambios en la lógica de score
- Cambios en assets (spritesheet, frames, duración)
- Control de touch o ratón

---

## Modelo de datos

Sin cambios de estructura respecto a SPEC 01. Se confirma el uso del campo ya definido:

```js
// Block (sin cambios en la forma)
{ x, y, w, h, color, dead, explosion: { frame, timer } | null }

// explosion === null  → bloque vivo sin animación activa
// dead === false      → colisionable y visible como bloque
// dead === true,
//   explosion !== null → no colisionable, renderiza animación de explosión
// dead === true,
//   explosion === null → animación terminada, listo para filtrar del array
```

---

## Plan de implementación

Cada paso deja el sistema funcional.

1. **Colisión bola-bloque** — al detectar colisión con un bloque donde `dead === false`: establecer `block.dead = true`, `block.explosion = { frame: 0, timer: 0 }`, invertir componente de velocidad correspondiente, `score += 10`.
2. **Filtro de colisión** — la detección de colisiones solo itera bloques donde `dead === false`.
3. **Actualización de animación** — cada frame, para cada bloque con `block.explosion !== null`: `timer += dt`; si `timer >= EXPLOSION_DURATION` → `frame++`, `timer = 0`; si `frame >= EXPLOSION_FRAMES[block.color].length` → `block.explosion = null`.
4. **Limpieza del array** — al final de cada `update()`, filtrar del array `blocks` los elementos donde `dead === true && explosion === null`.
5. **Renderizado** — en `draw()`, para cada bloque: si `dead === false` → `drawSprite(ctx, 'block_' + block.color, x, y, w, h)`; si `dead === true && explosion !== null` → `drawFrame(ctx, EXPLOSION_FRAMES[block.color][explosion.frame], x, y, w, h)`.
6. **Verificación de victoria** — asegurarse de que la condición `state = 'win'` evalúa solo bloques con `dead === false` (no espera a que terminen las animaciones).

---

## Criterios de aceptación

- [ ] Al golpear un bloque, deja de colisionar en el mismo frame en que es golpeado
- [ ] La animación de explosión se reproduce completamente (4 frames, ~600 ms en total)
- [ ] El bloque desaparece visualmente al terminar el último frame de la animación
- [ ] Golpear dos bloques con un único rebote muestra dos explosiones simultáneas sin interferencia
- [ ] La condición de victoria se activa aunque haya explosiones en curso
- [ ] No hay errores en consola durante ni después de las explosiones

---

## Decisiones tomadas

| Decisión | Alternativa descartada | Motivo |
|---|---|---|
| `explosion` vive en el propio bloque | Array separado `explosions[]` | Más simple; no requiere sincronización entre estructuras |
| El bloque desaparece al terminar la animación | Desaparece al instante | Mejor feedback visual; el jugador ve la explosión completa |
| Victoria no espera a que terminen las animaciones | Esperar a `explosion === null` en todos | La condición de win es "sin bloques vivos", no "sin animaciones" |
| Sin audio en este spec | Incluir sonidos básicos | El audio tiene su propia spec; mantener scope acotado |
