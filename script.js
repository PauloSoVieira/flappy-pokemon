// Constants for movement speed and gravity
const moveSpeed = 10;
const gravity = 0.5;
let birdVelocity = 0;
let pipeSeparation = 0;
const pipeGap = 30;
const pipeSpawnInterval = 150;

// Get elements from the HTML
const bird = document.querySelector(".bird");
const img = document.getElementById("bird-1");
const scoreVal = document.querySelector(".score_val");
const message = document.querySelector(".message");
const scoreTitle = document.querySelector(".score_title");

let gameState = "Start";
img.style.display = "none";
message.classList.add("messageStyle");

// Play background music
const backgroundMusic = document.getElementById("backgroundMusic");

function startMusic() {
  backgroundMusic.play();
}
window.addEventListener("load", startMusic);

const musicToggleBtn = document.createElement("button");
musicToggleBtn.innerHTML = "🔊";
musicToggleBtn.style.position = "absolute";
musicToggleBtn.style.top = "10px";
musicToggleBtn.style.right = "10px";
musicToggleBtn.style.zIndex = "1000";
musicToggleBtn.style.fontSize = "24px";
musicToggleBtn.style.background = "none";
musicToggleBtn.style.border = "none";
musicToggleBtn.style.cursor = "pointer";
document.body.appendChild(musicToggleBtn);

// Function to toggle music
function toggleMusic() {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    musicToggleBtn.innerHTML = "🔊";
  } else {
    backgroundMusic.pause();
    musicToggleBtn.innerHTML = "🔇";
  }
}

// Add click event to music toggle button
musicToggleBtn.addEventListener("click", toggleMusic);
// Start the game when "Enter" is pressed
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && gameState !== "Play") {
    startGame();
  }
});

function startMusic() {
  backgroundMusic.play();
}

// Function to start the game
function startGame() {
  // Reset game elements
  document.querySelectorAll(".pipe_sprite").forEach((pipe) => pipe.remove());
  bird.style.top = "40vh";
  birdVelocity = 0;
  scoreVal.innerHTML = "0";

  // Reset pipe timing and separation
  pipeSeparation = 0;

  // Display bird image and update game state
  img.style.display = "block";
  gameState = "Play";
  message.innerHTML = "";
  message.classList.remove("messageStyle");

  // Play background music

  // Start game functions
  createPipe();
  applyGravity();
  movePipes();
}

// Function to handle gravity and bird movement
function applyGravity() {
  if (gameState !== "Play") return;

  birdVelocity += gravity;
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === " ") {
      birdVelocity = -7.6;
    }
  });

  const birdRect = bird.getBoundingClientRect();
  const backgroundRect = document
    .querySelector(".background")
    .getBoundingClientRect();

  if (birdRect.top <= 0 || birdRect.bottom >= backgroundRect.bottom) {
    gameOver();
    return;
  }

  bird.style.top = birdRect.top + birdVelocity + "px";
  requestAnimationFrame(applyGravity);
}

// Function to move pipes and check for collisions
function movePipes() {
  if (gameState !== "Play") return;

  const pipes = document.querySelectorAll(".pipe_sprite");
  pipes.forEach((pipe) => {
    const pipeRect = pipe.getBoundingClientRect();
    const birdRect = bird.getBoundingClientRect();

    if (pipeRect.right <= 0) {
      pipe.remove();
    } else {
      if (
        birdRect.left < pipeRect.left + pipeRect.width &&
        birdRect.left + birdRect.width > pipeRect.left &&
        birdRect.top < pipeRect.top + pipeRect.height &&
        birdRect.top + birdRect.height > pipeRect.top
      ) {
        gameOver();
        return;
      }

      if (pipeRect.right < birdRect.left && pipe.increase_score === "1") {
        scoreVal.innerHTML = +scoreVal.innerHTML + 1;
        pipe.increase_score = "0";
      }
      pipe.style.left = pipeRect.left - moveSpeed + "px";
    }
  });

  requestAnimationFrame(movePipes);
}

// Function to create pipes
function createPipe() {
  if (gameState !== "Play") return;

  if (pipeSeparation >= pipeSpawnInterval / 16.67) {
    // Convert ms to frames
    pipeSeparation = 0;

    const pipePosition = Math.floor(Math.random() * 43) + 8;
    const topPipe = document.createElement("div");
    topPipe.className = "pipe_sprite";
    topPipe.style.top = pipePosition - 70 + "vh";
    topPipe.style.left = "100vw";
    document.body.appendChild(topPipe);

    const bottomPipe = document.createElement("div");
    bottomPipe.className = "pipe_sprite";
    bottomPipe.style.top = pipePosition + pipeGap + "vh";
    bottomPipe.style.left = "100vw";
    bottomPipe.increase_score = "1";
    document.body.appendChild(bottomPipe);
  }
  pipeSeparation++;

  setTimeout(() => {
    if (gameState === "Play") {
      createPipe();
    }
  }, pipeSpawnInterval);
}

// Function to handle game over
function gameOver() {
  gameState = "End";
  message.innerHTML = "<p>Game Over<br>Press Enter To Restart </p>";
  message.classList.add("messageStyle");
  img.style.display = "none";
}
