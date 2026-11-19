# Arkanoid

Juego de Arkanoid en HTML/Canvas puro — sin bundler, sin dependencias, sin paso de build.

## Jugar

Abrir `index.html` en el navegador, o servir localmente:

```bash
npx serve .
# abrir http://localhost:3000
```

## Controles

| Tecla | Acción |
|---|---|
| ← → | Mover paleta |
| Space | Lanzar bola (estado `ready`) |
| R | Reiniciar (en `gameover` o `win`) |

## Mecánicas implementadas

- Paleta, bola y grid de bloques de colores (sprites del spritesheet)
- Rebote en paredes, techo y paleta; ángulo variable según impacto en la paleta
- Animación de explosión al romper un bloque (4 frames × 150 ms, múltiples en paralelo)
- Efectos de sonido: rebote (`ball-bounce.mp3`) y rotura de bloque (`break-sound.mp3`)
- 3 vidas; score +10 por bloque roto acumulado entre niveles
- 5 niveles con layouts distintos definidos en `levels.js`
- Progresión: pantalla "Level X Complete" → +1 vida → siguiente nivel
- Pantalla de victoria final al completar el nivel 5
- HUD con vidas, score y número de nivel

## Estados del juego

```
ready → playing → levelcomplete → ready (siguiente nivel)
                               → win (tras nivel 5)
              → gameover
```

## Estructura de archivos

```
index.html              # canvas 800×600, carga spritesheet.js → levels.js → game.js
game.js                 # toda la lógica (loop, entidades, estados, HUD, colisiones, audio)
levels.js               # const LEVELS — 5 layouts de bloques (array de filas de strings/null)
assets/
  spritesheet-breakout.png
  spritesheet.js        # loadSpritesheet, drawSprite, drawFrame, SPRITES, EXPLOSION_FRAMES
  sounds/
    ball-bounce.mp3
    break-sound.mp3
specs/                  # spec-driven design — historial de decisiones y criterios
  01-mvp-jugable.md         (Aprobado)
  02-destruccion-bloques-animacion.md  (Implementado)
  03-sonidos-y-niveles.md   (Implementado)
```

## Desarrollo

Este proyecto sigue un flujo **spec-driven**: cada feature parte de un spec aprobado en `specs/`.

```bash
# Diseñar una nueva feature
/spec <descripción>

# Implementar un spec aprobado
/spec-impl <NN-slug>
```

Los specs documentan el scope, modelo de datos, plan de implementación, criterios de aceptación y decisiones tomadas.
