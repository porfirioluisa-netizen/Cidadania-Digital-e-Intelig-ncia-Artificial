const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Estado do jogo
let snake = [{ x: 10, y: 10 }];
let dx = 1;
let dy = 0;
let score = 0;
let lives = 3;

// Posições dos Itens
let realFact = { x: 5, y: 5 };
let deepfake = { x: 15, y: 15 };

// Loop principal do jogo rodando a cada 100ms
let gameInterval = setInterval(drawGame, 100);

// Escuta os comandos do teclado
window.addEventListener("keydown", changeDirection);

function drawGame() {
    moveSnake();

    // Verifica colisões estruturais (paredes ou auto-colisão)
    if (checkGameOver()) {
        resetGame();
        return;
    }

    // Verifica interação com o Fato Real (Comida boa)
    if (snake[0].x === realFact.x && snake[0].y === realFact.y) {
        score += 10;
        scoreElement.textContent = score;
        generateRealFact();
        generateDeepfake(); // Reposiciona o perigo para dinamicidade
    } else {
        snake.pop(); // Mantém o tamanho se não pontuou
    }

    // Verifica interação com a Deepfake (Obstáculo)
    if (snake[0].x === deepfake.x && snake[0].y === deepfake.y) {
        lives--;
        livesElement.textContent = lives;
        generateDeepfake();
        if (lives <= 0) {
            alert("As Deepfakes venceram! Fique mais atento à desinformação.");
            resetGame();
            return;
        }
    }

    // Renderização dos elementos visuais
    clearScreen();
    drawRealFact();
    drawDeepfake();
    drawSnake();
}

function clearScreen() {
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach((part, index) => {
        // Cabeça com tom diferenciado
        ctx.fillStyle = (index === 0) ? "#15803d" : "#22c55e";
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const GO_UP = keyPressed === 38 || keyPressed === 87;    // Seta Cima / W
    const GO_DOWN = keyPressed === 40 || keyPressed === 83;  // Seta Baixo / S
    const GO_LEFT = keyPressed === 37 || keyPressed === 65;  // Seta Esquerda / A
    const GO_RIGHT = keyPressed === 39 || keyPressed === 68; // Seta Direita / D

    // Bloqueia reversões imediatas de sentido (ex: andar para trás)
    if (GO_UP && dy !== 1) { dx = 0; dy = -1; }
    if (GO_DOWN && dy !== -1) { dx = 0; dy = 1; }
    if (GO_LEFT && dx !== 1) { dx = -1; dy = 0; }
    if (GO_RIGHT && dx !== -1) { dx = 1; dy = 0; }
}

function checkGameOver() {
    const head = snake[0];
    
    // Fora das bordas
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // Auto-mutilação (bater no próprio corpo)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function generateRealFact() {
    realFact.x = Math.floor(Math.random() * tileCount);
    realFact.y = Math.floor(Math.random() * tileCount);
}

function generateDeepfake() {
    deepfake.x = Math.floor(Math.random() * tileCount);
    deepfake.y = Math.floor(Math.random() * tileCount);
}

function drawRealFact() {
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(realFact.x * gridSize + gridSize/2, realFact.y * gridSize + gridSize/2, gridSize/2 - 2, 0, 2 * Math.PI);
    ctx.fill();
}

function drawDeepfake() {
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(deepfake.x * gridSize + 2, deepfake.y * gridSize + 2, gridSize - 4, gridSize - 4);
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    lives = 3;
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    generateRealFact();
    generateDeepfake();
}
