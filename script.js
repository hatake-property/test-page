const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let launcherX = canvas.width / 2;
const launcherY = canvas.height - 30;
const launcherWidth = 60;
const launcherHeight = 10;
const ballRadius = 5;
let balls = [];
let swords = [];
let spawnInterval = 2000;
let lastSpawnTime = 0;
let gameOver = false;

document.getElementById('leftBtn').onclick = () => moveLauncher(-20);
document.getElementById('rightBtn').onclick = () => moveLauncher(20);
document.getElementById('shootBtn').onclick = shootBall;

document.addEventListener('keydown', (e) => {
    if (e.key === 'h') moveLauncher(-20);
    if (e.key === 'l') moveLauncher(20);
    if (e.key === ' ') shootBall();
});

function moveLauncher(dx) {
    launcherX += dx;
    launcherX = Math.max(0, Math.min(canvas.width - launcherWidth, launcherX));
}

function shootBall() {
    balls.push({ x: launcherX + launcherWidth / 2, y: launcherY, dx: 0, dy: -5 });
}

function spawnSword() {
    const x = Math.random() * (canvas.width - 20);
    swords.push({ x: x, y: 0, width: 20, height: 40, dy: 2 + Math.random() * 3 });
}

function update() {
    if (gameOver) return;

    const now = Date.now();
    if (now - lastSpawnTime > spawnInterval) {
        spawnSword();
        lastSpawnTime = now;
        spawnInterval = 1000 + Math.random() * 2000;
    }

    balls.forEach(ball => {
        ball.x += ball.dx;
        ball.y += ball.dy;
    });

    swords.forEach(sword => {
        sword.y += sword.dy;
    });

    balls = balls.filter(ball => ball.y > 0);
    swords = swords.filter(sword => sword.y < canvas.height);

    for (let sword of swords) {
        if (sword.y + sword.height >= launcherY &&
            sword.x < launcherX + launcherWidth &&
            sword.x + sword.width > launcherX) {
            gameOver = true;
            alert('ゲームオーバー！');
        }
    }

    for (let ball of balls) {
        for (let i = swords.length - 1; i >= 0; i--) {
            const sword = swords[i];
            if (ball.x > sword.x && ball.x < sword.x + sword.width &&
                ball.y > sword.y && ball.y < sword.y + sword.height) {
                swords.splice(i, 1);
                break;
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'blue';
    ctx.fillRect(launcherX, launcherY, launcherWidth, launcherHeight);

    ctx.fillStyle = 'red';
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = 'green';
    swords.forEach(sword => {
        ctx.fillRect(sword.x, sword.y, sword.width, sword.height);
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
