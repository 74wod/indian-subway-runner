const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Variables
let gameSpeed = 3;
let score = 0;

// Player (runner) properties
const player = {
  x: 50,
  y: canvas.height - 60,
  width: 40,
  height: 60,
  vy: 0,
  gravity: 0.5,
  jumpStrength: 10,
  isJumping: false
};

// Obstacle array
const obstacles = [];

// Key handling
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    jump();
  }
});

function jump() {
  if (!player.isJumping) {
    player.isJumping = true;
    player.vy = -player.jumpStrength;
  }
}

function spawnObstacle() {
  // Let's create an obstacle that looks like an auto-rickshaw
  const height = 60;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - height,
    width: 80,
    height: height,
    color: "green"
  });
}

function updateObstacles() {
  // Spawn obstacles periodically
  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
    spawnObstacle();
  }

  // Move obstacles
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= gameSpeed;
  }

  // Remove off-screen obstacles
  while (obstacles.length > 0 && obstacles[0].x + obstacles[0].width < 0) {
    obstacles.shift();
    score++;
  }
}

function detectCollision(player, obstacle) {
  return (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  );
}

function updatePlayer() {
  // Apply gravity
  player.y += player.vy;
  player.vy += player.gravity;

  // Floor detection
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.isJumping = false;
    player.vy = 0;
  }
}

function gameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over!", canvas.width / 2 - 70, canvas.height / 2);
  ctx.fillText(`Score: ${score}`, canvas.width / 2 - 50, canvas.height / 2 + 40);

  cancelAnimationFrame(animationId);
}

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update & draw player
  updatePlayer();
  ctx.fillStyle = "#ff5722";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Update & draw obstacles
  updateObstacles();
  obstacles.forEach((obs) => {
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // Check collision
    if (detectCollision(player, obs)) {
      gameOver();
    }
  });

  // Draw score
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

animate();
