const LEVELS = [
  // Nivel 1: filas sólidas de colores
  [
    ['red','red','red','red','red','red','red','red','red','red'],
    ['hotpink','hotpink','hotpink','hotpink','hotpink','hotpink','hotpink','hotpink','hotpink','hotpink'],
    ['yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow','yellow'],
    ['cyan','cyan','cyan','cyan','cyan','cyan','cyan','cyan','cyan','cyan'],
    ['green','green','green','green','green','green','green','green','green','green'],
  ],
  // Nivel 2: tablero de ajedrez
  [
    ['red',null,'red',null,'red',null,'red',null,'red',null],
    [null,'yellow',null,'yellow',null,'yellow',null,'yellow',null,'yellow'],
    ['cyan',null,'cyan',null,'cyan',null,'cyan',null,'cyan',null],
    [null,'hotpink',null,'hotpink',null,'hotpink',null,'hotpink',null,'hotpink'],
    ['green',null,'green',null,'green',null,'green',null,'green',null],
    [null,'magenta',null,'magenta',null,'magenta',null,'magenta',null,'magenta'],
  ],
  // Nivel 3: pirámide
  [
    [null,null,null,null,'red','red',null,null,null,null],
    [null,null,null,'yellow','yellow','yellow','yellow',null,null,null],
    [null,null,'cyan','cyan','cyan','cyan','cyan','cyan',null,null],
    [null,'hotpink','hotpink','hotpink','hotpink','hotpink','hotpink','hotpink','hotpink',null],
    ['green','green','green','green','green','green','green','green','green','green'],
  ],
  // Nivel 4: marco exterior + detalles interiores
  [
    ['red','red','red','red','red','red','red','red','red','red'],
    ['cyan',null,null,null,null,null,null,null,null,'cyan'],
    ['cyan',null,'yellow',null,'hotpink','hotpink',null,'yellow',null,'cyan'],
    ['cyan',null,null,null,null,null,null,null,null,'cyan'],
    ['cyan',null,'yellow',null,'hotpink','hotpink',null,'yellow',null,'cyan'],
    ['cyan',null,null,null,null,null,null,null,null,'cyan'],
    ['green','green','green','green','green','green','green','green','green','green'],
  ],
  // Nivel 5: diagonales cruzadas
  [
    ['red',null,null,null,null,null,null,null,null,'magenta'],
    [null,'red',null,null,null,null,null,null,'magenta',null],
    [null,null,'yellow',null,null,null,null,'hotpink',null,null],
    [null,null,null,'cyan',null,null,'cyan',null,null,null],
    [null,null,null,null,'green','green',null,null,null,null],
    [null,null,null,'cyan',null,null,'cyan',null,null,null],
    [null,null,'yellow',null,null,null,null,'hotpink',null,null],
    [null,'red',null,null,null,null,null,null,'magenta',null],
  ],
];
