const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let state = 'ready';
let lives = 3;
let score = 0;
let blocks = [];
let ball;
let paddle;

const keys = {};
document.addEventListener('keydown', e => { keys[e.code] = true; });
document.addEventListener('keyup', e => { keys[e.code] = false; });

loadSpritesheet(() => {
  paddle = new Paddle();
  ball = new Ball();
  blocks = createBlocks();
  requestAnimationFrame(loop);
});

let lastTs = null;

function loop(ts) {
  if (lastTs === null) lastTs = ts;
  let dt = ts - lastTs;
  lastTs = ts;
  if (dt > 50) dt = 50;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

function update(dt) {
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

class Paddle {
  constructor() {
    this.w = 80;
    this.h = 16;
    this.x = canvas.width / 2 - this.w / 2;
    this.y = canvas.height - 40;
    this.speed = 400;
  }

  update(dt) {
  }

  draw() {
  }
}

class Ball {
  constructor() {
    this.radius = 8;
    this.reset();
  }

  reset() {
    this.x = paddle ? paddle.x + paddle.w / 2 : canvas.width / 2;
    this.y = paddle ? paddle.y - this.radius : canvas.height - 60;
    this.vx = 0;
    this.vy = 0;
    this.dead = false;
  }

  update(dt) {
  }

  draw() {
  }
}

function createBlocks() {
  return [];
}
