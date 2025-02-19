// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size (responsive)
canvas.width = Math.min(window.innerWidth - 20, 400);
canvas.height = canvas.width;

// Load textures
const foodImg = new Image();
foodImg.src = "apple.png"; // Image for the food

// Load sound effects
const bgMusic = new Audio("bgmusic.mp3");
bgMusic.loop = true;
bgMusic.play(); // Play Background sound

    const gameoverSound = new Audio("gameover.mp3");

// Snake properties
const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let food = { x: Math.floor(Math.random() * (canvas.width / box)) * box, 
             y: Math.floor(Math.random() * (canvas.height / box)) * box };
let direction = "RIGHT";
let score = 0;

// Handle keyboard input (for desktop)
document.addEventListener("keydown", changeDirection);

// Handle touch input (for mobile)
let touchStartX, touchStartY;
document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchmove", (e) => {
    if (!touchStartX || !touchStartY) return;
    let touchEndX = e.touches[0].clientX;
    let touchEndY = e.touches[0].clientY;
    
    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction !== "LEFT") direction = "RIGHT";
        else if (diffX < 0 && direction !== "RIGHT") direction = "LEFT";
    } else {
        if (diffY > 0 && direction !== "UP") direction = "DOWN";
        else if (diffY < 0 && direction !== "DOWN") direction = "UP";
    }

    touchStartX = null;
    touchStartY = null;
});

// Change direction (for keyboard)
function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (key === 38 && direction !== "DOWN") direction = "UP";
    else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (key === 40 && direction !== "UP") direction = "DOWN";
}

// Main game loop
function draw() {
    // Clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food with texture
ctx.drawImage(foodImg, food.x, food.y, box, box);

    // Move snake
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    // Check collision with walls
if (headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height) {
    gameOverSound.play(); // Play game over sound
    alert("Game Over! Score: " + score);
    document.location.reload();
}

// Check collision with self
for (let i = 1; i < snake.length; i++) {
    if (headX === snake[i].x && headY === snake[i].y) {
        gameOverSound.play(); // Play game over sound
        alert("Game Over! Score: " + score);
        document.location.reload();
    }
}

    // Check if food is eaten
    if (headX === food.x && headY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
    } else {
        snake.pop(); // Remove tail
    }

    // Add new head
    let newHead = { x: headX, y: headY };
    snake.unshift(newHead);

    // Draw snake
    ctx.fillStyle = "blue";
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw score
    ctx.fillStyle = "yellow";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

// Run game loop every 180ms
setInterval(draw, 180);
