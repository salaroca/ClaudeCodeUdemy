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
  paddle.update(dt);
  ball.update(dt);

  if (state === 'ready' && keys['Space']) {
    state = 'playing';
    ball.vx = 250;
    ball.vy = -400;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paddle.draw();
  ball.draw();
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
    if (keys['ArrowLeft']) {
      this.x -= this.speed * dt / 1000;
    }
    if (keys['ArrowRight']) {
      this.x += this.speed * dt / 1000;
    }
    this.x = Math.max(0, Math.min(canvas.width - this.w, this.x));
  }

  draw() {
    drawSprite(ctx, 'paddle', this.x, this.y, this.w, this.h);
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
    if (state === 'ready') {
      this.x = paddle.x + paddle.w / 2;
      this.y = paddle.y - this.radius;
      return;
    }
    if (state !== 'playing') return;

    this.x += this.vx * dt / 1000;
    this.y += this.vy * dt / 1000;

    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx = Math.abs(this.vx);
    } else if (this.x + this.radius > canvas.width) {
      this.x = canvas.width - this.radius;
      this.vx = -Math.abs(this.vx);
    }

    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy = Math.abs(this.vy);
    }
  }

  draw() {
    drawSprite(ctx, 'ball', this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
  }
}

function createBlocks() {
  return [];
}
