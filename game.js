const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startBtn');
const jumpBtn = document.getElementById('jumpBtn');
const restartBtn = document.getElementById('restartBtn');

const W = canvas.width;
const H = canvas.height;
const bestKey = 'wechat-h5-game-demo-best';

let best = Number(localStorage.getItem(bestKey) || 0);
let score = 0;
let gameOver = false;
let started = false;
let frame = 0;

bestEl.textContent = best;

const fish = {
  x: 96,
  y: H / 2,
  vy: 0,
  gravity: 0.34,
  lift: -6.6,
  radius: 18,
};

let pipes = [];

function resetGame() {
  score = 0;
  frame = 0;
  gameOver = false;
  started = true;
  fish.y = H / 2;
  fish.vy = 0;
  pipes = [];
  scoreEl.textContent = score;
  overlay.classList.add('hidden');
}

function endGame() {
  gameOver = true;
  started = false;
  best = Math.max(best, score);
  localStorage.setItem(bestKey, String(best));
  bestEl.textContent = best;
  overlay.classList.remove('hidden');
  overlay.querySelector('h1').textContent = '翻车啦';
  overlay.querySelector('.desc').innerHTML = `这次拿了 <strong>${score}</strong> 分。<br />再来一局，手感马上回来。`;
  startBtn.textContent = '再来一局';
}

function jump() {
  if (!started && !gameOver) return;
  if (gameOver) {
    resetGame();
  }
  fish.vy = fish.lift;
}

function spawnPipe() {
  const gap = 150;
  const topHeight = 90 + Math.random() * 260;
  pipes.push({
    x: W + 60,
    width: 56,
    topHeight,
    gap,
    passed: false,
  });
}

function update() {
  if (!started || gameOver) return;

  frame += 1;
  fish.vy += fish.gravity;
  fish.y += fish.vy;

  if (frame % 92 === 0) {
    spawnPipe();
  }

  for (const pipe of pipes) {
    pipe.x -= 2.8;

    if (!pipe.passed && pipe.x + pipe.width < fish.x) {
      pipe.passed = true;
      score += 1;
      scoreEl.textContent = score;
    }

    const hitX = fish.x + fish.radius > pipe.x && fish.x - fish.radius < pipe.x + pipe.width;
    const hitTop = fish.y - fish.radius < pipe.topHeight;
    const hitBottom = fish.y + fish.radius > pipe.topHeight + pipe.gap;

    if (hitX && (hitTop || hitBottom)) {
      endGame();
    }
  }

  pipes = pipes.filter((pipe) => pipe.x + pipe.width > -10);

  if (fish.y + fish.radius > H - 26 || fish.y - fish.radius < 18) {
    endGame();
  }
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#67e8f9');
  sky.addColorStop(0.55, '#0ea5e9');
  sky.addColorStop(1, '#082f49');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(70 + i * 82, 90 + (i % 2) * 20, 22, 0, Math.PI * 2);
    ctx.arc(94 + i * 82, 84 + (i % 2) * 20, 18, 0, Math.PI * 2);
    ctx.arc(114 + i * 82, 90 + (i % 2) * 20, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#164e63';
  ctx.fillRect(0, H - 26, W, 26);
}

function drawFish() {
  ctx.save();
  ctx.translate(fish.x, fish.y);
  ctx.rotate(Math.max(-0.4, Math.min(0.6, fish.vy * 0.06)));

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 17, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(-20, 0);
  ctx.lineTo(-38, -10);
  ctx.lineTo(-38, 10);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(10, -4, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(12, -4, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawPipes() {
  for (const pipe of pipes) {
    const bottomY = pipe.topHeight + pipe.gap;

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
    ctx.fillRect(pipe.x - 4, pipe.topHeight - 16, pipe.width + 8, 16);

    ctx.fillRect(pipe.x, bottomY, pipe.width, H - bottomY - 26);
    ctx.fillRect(pipe.x - 4, bottomY, pipe.width + 8, 16);

    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(pipe.x + 8, 0, 8, pipe.topHeight);
    ctx.fillRect(pipe.x + 8, bottomY, 8, H - bottomY - 26);
  }
}

function drawTips() {
  if (started || gameOver) return;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
  ctx.fillRect(64, H - 110, W - 128, 48);
  ctx.fillStyle = '#eff6ff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('点一下就上浮', W / 2, H - 78);
}

function render() {
  drawBackground();
  drawPipes();
  drawFish();
  drawTips();
  requestAnimationFrame(loop);
}

function loop() {
  update();
  render();
}

function startGame() {
  resetGame();
  overlay.querySelector('h1').textContent = '小鱼冲冲冲';
  overlay.querySelector('.desc').innerHTML = '点击屏幕，让小鱼上浮，躲开管道。<br />活下来越久，分数越高。';
  startBtn.textContent = '开始游戏';
}

startBtn.addEventListener('click', () => {
  resetGame();
});

jumpBtn.addEventListener('click', jump);
restartBtn.addEventListener('click', startGame);
canvas.addEventListener('pointerdown', jump);
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') jump();
});

overlay.classList.remove('hidden');
render();
