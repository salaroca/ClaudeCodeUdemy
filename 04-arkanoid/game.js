const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bounceSfx = new Audio('assets/sounds/ball-bounce.mp3');
function playBounce() {
  bounceSfx.currentTime = 0;
  bounceSfx.play().catch(() => {});
}

const breakSfx = new Audio('assets/sounds/break-sound.mp3');
function playBreak() {
  breakSfx.currentTime = 0;
  breakSfx.play().catch(() => {});
}

let state = 'ready';
let lives = 3;
let score = 0;
let currentLevel = 1;
let blocks = [];
let ball;
let paddle;

const keys = {};
document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'KeyR' && (state === 'gameover' || state === 'win')) {
    resetGame();
  }
});
document.addEventListener('keyup', e => { keys[e.code] = false; });

function resetGame() {
  state = 'ready';
  lives = 3;
  score = 0;
  currentLevel = 1;
  blocks = createBlocks(0);
  paddle = new Paddle();
  ball = new Ball();
}

loadSpritesheet(() => {
  paddle = new Paddle();
  ball = new Ball();
  blocks = createBlocks(currentLevel - 1);
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

  if (state === 'levelcomplete' && (keys['Space'] || keys['KeyR'])) {
    currentLevel++;
    lives++;
    blocks = createBlocks(currentLevel - 1);
    paddle = new Paddle();
    ball.reset();
    state = 'ready';
  }

  if (state === 'playing') {
    checkBallBlockCollisions();
    checkBallPaddleCollision();

    if (blocks.every(b => b.dead)) {
      if (currentLevel < 5) {
        state = 'levelcomplete';
      } else {
        state = 'win';
      }
    }

    if (ball.y - ball.radius > canvas.height) {
      lives--;
      if (lives === 0) {
        state = 'gameover';
      } else {
        state = 'ready';
        ball.reset();
      }
    }
  }

  for (const b of blocks) {
    if (b.explosion) {
      b.explosion.timer += dt;
      b.explosion.frame = Math.floor(b.explosion.timer / EXPLOSION_DURATION);
      if (b.explosion.frame >= EXPLOSION_FRAMES[b.color].length) {
        b.explosion = null;
      }
    }
  }
  blocks = blocks.filter(b => !(b.dead && b.explosion === null));
}

function checkBallPaddleCollision() {
  if (ball.vy < 0) return;

  const ballLeft = ball.x - ball.radius;
  const ballRight = ball.x + ball.radius;
  const ballTop = ball.y - ball.radius;
  const ballBottom = ball.y + ball.radius;

  if (ballRight < paddle.x || ballLeft > paddle.x + paddle.w) return;
  if (ballBottom < paddle.y || ballTop > paddle.y + paddle.h) return;

  ball.y = paddle.y - ball.radius;
  ball.vy = -Math.abs(ball.vy);
  playBounce();

  const hitPos = (ball.x - paddle.x) / paddle.w;
  const angle = (hitPos - 0.5) * 2;
  const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
  ball.vx = speed * angle * 0.8;
  ball.vy = -Math.sqrt(Math.max(speed * speed - ball.vx * ball.vx, speed * speed * 0.25));
}

function checkBallBlockCollisions() {
  for (const b of blocks) {
    if (b.dead) continue;

    const bLeft = b.x;
    const bRight = b.x + b.w;
    const bTop = b.y;
    const bBottom = b.y + b.h;

    const ballLeft = ball.x - ball.radius;
    const ballRight = ball.x + ball.radius;
    const ballTop = ball.y - ball.radius;
    const ballBottom = ball.y + ball.radius;

    if (ballRight < bLeft || ballLeft > bRight || ballBottom < bTop || ballTop > bBottom) continue;

    const overlapLeft = ballRight - bLeft;
    const overlapRight = bRight - ballLeft;
    const overlapTop = ballBottom - bTop;
    const overlapBottom = bBottom - ballTop;

    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    if (minOverlap === overlapTop || minOverlap === overlapBottom) {
      ball.vy = -ball.vy;
    } else {
      ball.vx = -ball.vx;
    }

    b.dead = true;
    b.explosion = { frame: 0, timer: 0 };
    score += 10;
    playBreak();
    break;
  }
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const b of blocks) {
    if (!b.dead) {
      drawSprite(ctx, `block_${b.color}`, b.x, b.y, b.w, b.h);
    } else if (b.explosion) {
      drawFrame(ctx, EXPLOSION_FRAMES[b.color][b.explosion.frame], b.x, b.y, b.w, b.h);
    }
  }
  paddle.draw();
  ball.draw();
  drawHUD();
}

function drawHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = '18px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${score}`, 10, 24);
  if (state === 'ready' || state === 'playing') {
    ctx.textAlign = 'center';
    ctx.fillText(`Lvl ${currentLevel}`, canvas.width / 2, 24);
  }
  ctx.textAlign = 'right';
  ctx.fillText('Vidas:', canvas.width - 10 - lives * 22, 24);
  for (let i = 0; i < lives; i++) {
    drawSprite(ctx, 'ball', canvas.width - 10 - (lives - i) * 22 + 4, 10, 14, 14);
  }

  if (state === 'ready') {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '20px monospace';
    ctx.fillText('Pulsa ESPACIO para lanzar', canvas.width / 2, canvas.height - 15);
  }

  if (state === 'levelcomplete') {
    drawOverlay(`Level ${currentLevel} Complete! +1 Life`, score, 'Press Space or R to continue');
  }

  if (state === 'gameover') {
    drawOverlay('GAME OVER', score);
  }

  if (state === 'win') {
    drawOverlay('¡HAS GANADO!', score);
  }
}

function drawOverlay(title, finalScore, hint = 'R para reiniciar') {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px monospace';
  ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 40);
  ctx.font = '28px monospace';
  ctx.fillText(`Score: ${finalScore}`, canvas.width / 2, canvas.height / 2 + 10);
  ctx.font = '20px monospace';
  ctx.fillStyle = '#aaa';
  ctx.fillText(hint, canvas.width / 2, canvas.height / 2 + 50);
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
      playBounce();
    } else if (this.x + this.radius > canvas.width) {
      this.x = canvas.width - this.radius;
      this.vx = -Math.abs(this.vx);
      playBounce();
    }

    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy = Math.abs(this.vy);
      playBounce();
    }
  }

  draw() {
    drawSprite(ctx, 'ball', this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
  }
}


function createBlocks(levelIndex) {
  const layout = LEVELS[levelIndex];
  const cols = 10;
  const bw = 70;
  const bh = 22;
  const gapX = 5;
  const gapY = 5;
  const offsetX = (canvas.width - (cols * bw + (cols - 1) * gapX)) / 2;
  const offsetY = 60;
  const result = [];

  for (let row = 0; row < layout.length; row++) {
    for (let col = 0; col < layout[row].length; col++) {
      const color = layout[row][col];
      if (color === null) continue;
      result.push({
        x: offsetX + col * (bw + gapX),
        y: offsetY + row * (bh + gapY),
        w: bw,
        h: bh,
        color,
        dead: false,
        explosion: null,
      });
    }
  }
  return result;
}
