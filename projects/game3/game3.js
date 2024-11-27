// Button to return to the portfolio
function returnToPortfolio() {
    window.location.href = 'https://yeohww2.github.io/#projects';
}
document.getElementById('close-button').addEventListener('click', returnToPortfolio);

// Function to create falling stars
function createFallingStars() {
    const starContainer = document.querySelector('.falling-stars');
    const numStars = 30; // Number of stars

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        // Set random positions for each star
        star.style.animationDuration = `${Math.random() * 5 + 2}s`; // Random speed for each star
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`; // Random delay for each star
        starContainer.appendChild(star);
    }
}

// Initialize the falling stars when the page loads
window.onload = createFallingStars;


const gridSize = 5; // 5x5 grid
let userPosition = 0; // Starting position for the user
let robotPosition = 0; // Starting position for the robot
let userTreasures = 0; // Count of treasures collected by the user
let robotTreasures = 0; // Count of treasures collected by the robot
let totalTreasures = 5; // Total number of treasures to be collected
let gameEnded = false; // Track if the game has ended

let gridState = []; // Grid state for treasures and traps

let userTrapCooldown = false; // Track if the user is on a trap and needs to skip a turn
let robotTrapCooldown = false; // Track if the robot is on a trap and needs to skip a turn

function generateGridState() {
    gridState = [];
    let treasureCount = 0;
    let trapCount = 0;

    // Create an empty grid first
    for (let i = 0; i < gridSize; i++) {
        gridState[i] = [];
        for (let j = 0; j < gridSize; j++) {
            gridState[i][j] = 'empty';
        }
    }

    // Mark the starting positions of the user and robot as 'start'
    gridState[Math.floor(userPosition / gridSize)][userPosition % gridSize] = 'start';
    gridState[Math.floor(robotPosition / gridSize)][robotPosition % gridSize] = 'start';

    // Place exactly 5 treasures, but not on the user or robot's starting positions
    while (treasureCount < totalTreasures) {
        let row = Math.floor(Math.random() * gridSize);
        let col = Math.floor(Math.random() * gridSize);

        if (gridState[row][col] === 'empty') {
            gridState[row][col] = 'treasure';
            treasureCount++;
        }
    }

    // Place exactly 2 traps, but not on the start or treasure positions
    while (trapCount < 2) {
        let row = Math.floor(Math.random() * gridSize);
        let col = Math.floor(Math.random() * gridSize);

        if (gridState[row][col] === 'empty') {
            gridState[row][col] = 'trap';
            trapCount++;
        }
    }
}

function generateGrids() {
    const userGrid = document.getElementById('user-grid');
    const robotGrid = document.getElementById('robot-grid');

    userGrid.innerHTML = '';
    robotGrid.innerHTML = '';

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const userCell = document.createElement('div');
            const robotCell = document.createElement('div');

            userCell.classList.add('cell');
            robotCell.classList.add('cell');

            if (gridState[i][j] === 'treasure') {
                userCell.classList.add('treasure');
                userCell.textContent = '💎';
                robotCell.classList.add('treasure');
                robotCell.textContent = '💎';
            } else if (gridState[i][j] === 'trap') {
                userCell.classList.add('trap');
                userCell.textContent = '⚠️';
                robotCell.classList.add('trap');
                robotCell.textContent = '⚠️';
            }

            userGrid.appendChild(userCell);
            robotGrid.appendChild(robotCell);
        }
    }
}

document.getElementById('start-game').addEventListener('click', function () {
    document.getElementById('user-grid').style.display = 'grid';
    document.getElementById('robot-grid').style.display = 'grid';

    userPosition = 0;
    robotPosition = 0;
    userTreasures = 0;
    robotTreasures = 0;
    gameEnded = false;

    document.getElementById('result').textContent = '';
    generateGridState();
    generateGrids();

    document.getElementById('user-grid').children[0].classList.add('user');
    document.getElementById('robot-grid').children[0].classList.add('robot');
    document.getElementById('user-grid').children[0].textContent = 'U';
    document.getElementById('robot-grid').children[0].textContent = 'R';

    document.querySelectorAll('#user-grid .cell').forEach((cell, index) => {
        cell.addEventListener('click', () => {
            if (gameEnded || userTrapCooldown) return; // Prevent movement if the user is on cooldown

            const userRow = Math.floor(userPosition / gridSize);
            const userCol = userPosition % gridSize;
            const targetRow = Math.floor(index / gridSize);
            const targetCol = index % gridSize;

            // Allow movement only if the target is adjacent (up, down, left, right)
            const isValidMove =
                (targetRow === userRow && Math.abs(targetCol - userCol) === 1) || // Left/Right
                (targetCol === userCol && Math.abs(targetRow - userRow) === 1);   // Up/Down

            if (isValidMove) {
                if (gridState[targetRow][targetCol] === 'treasure') {
                    userTreasures++;
                    gridState[targetRow][targetCol] = 'empty';
                }

                // Check if the user steps on a trap
                if (gridState[targetRow][targetCol] === 'trap') {
                    userTrapCooldown = true; // Set the cooldown for the user
                    setTimeout(() => {
                        userTrapCooldown = false; // End the cooldown after 1 turn
                    }, 1000); // Cooldown time (in milliseconds)

                    gridState[targetRow][targetCol] = 'empty'; // Remove trap after stepping on it
                }

                // Clear previous user position
                document.getElementById('user-grid').children[userPosition].classList.remove('user');
                document.getElementById('user-grid').children[userPosition].textContent = '';

                // Update user position
                userPosition = index;
                document.getElementById('user-grid').children[userPosition].classList.add('user');
                document.getElementById('user-grid').children[userPosition].textContent = 'U';

                checkGameStatus(); // Check if the game has ended
                if (!gameEnded) moveRobot(); // Make the robot move after the user
            }
        });
    });
});

// Modify the robot movement logic
function moveRobot() {
    if (gameEnded || robotTrapCooldown) return; // Prevent robot movement if it's on cooldown

    const robotRow = Math.floor(robotPosition / gridSize);
    const robotCol = robotPosition % gridSize;

    // Define potential moves
    const possibleMoves = [
        { row: robotRow - 1, col: robotCol }, // Up
        { row: robotRow + 1, col: robotCol }, // Down
        { row: robotRow, col: robotCol - 1 }, // Left
        { row: robotRow, col: robotCol + 1 }  // Right
    ];

    // Filter moves to stay within grid boundaries
    const validMoves = possibleMoves.filter(
        move =>
            move.row >= 0 &&
            move.row < gridSize &&
            move.col >= 0 &&
            move.col < gridSize
    );

    // Choose a random valid move
    const nextMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    const nextPosition = nextMove.row * gridSize + nextMove.col;

    if (gridState[nextMove.row][nextMove.col] === 'treasure') {
        robotTreasures++;
        gridState[nextMove.row][nextMove.col] = 'empty';
    }

    // Check if the robot steps on a trap
    if (gridState[nextMove.row][nextMove.col] === 'trap') {
        robotTrapCooldown = true; // Set the cooldown for the robot
        setTimeout(() => {
            robotTrapCooldown = false; // End the cooldown after 1 turn
        }, 1000); // Cooldown time (in milliseconds)

        gridState[nextMove.row][nextMove.col] = 'empty'; // Remove trap after stepping on it
    }

    // Clear previous robot position
    document.getElementById('robot-grid').children[robotPosition].classList.remove('robot');
    document.getElementById('robot-grid').children[robotPosition].textContent = '';

    // Update robot position
    robotPosition = nextPosition;
    document.getElementById('robot-grid').children[robotPosition].classList.add('robot');
    document.getElementById('robot-grid').children[robotPosition].textContent = 'R';

    checkGameStatus(); // Check if the game has ended
}

function checkGameStatus() {
    // Check if both user and robot have collected all the treasures
    if (userTreasures >= totalTreasures && robotTreasures >= totalTreasures) {
        gameEnded = true;
        document.getElementById('result').textContent = 'It\'s a tie! 🤝';
    }
    // Check if the user collects all the treasures first
    else if (userTreasures >= totalTreasures) {
        gameEnded = true;
        document.getElementById('result').textContent = 'You win! 🎉';
    }
    // Check if the robot collects all the treasures first
    else if (robotTreasures >= totalTreasures) {
        gameEnded = true;
        document.getElementById('result').textContent = 'Robot wins! 🤖';
    }
}

