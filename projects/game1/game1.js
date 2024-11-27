document.getElementById('close-game').addEventListener('click', () => {
    window.location.href = 'https://yeohww2.github.io/#projects';
});

function createFallingElements() {
    const container = document.querySelector('.falling-cute-elements');
    const elements = ['❤️', '✨', '🌸', '⭐', '🦋'];
    const totalElements = 6;

    for (let i = 0; i < totalElements; i++) {
        const span = document.createElement('span');
        span.classList.add('cute-element');
        span.textContent = elements[Math.floor(Math.random() * elements.length)];

        // Randomize position and animation duration
        span.style.left = `${Math.random() * 100}vw`;
        span.style.animationDelay = `${Math.random() * 5}s`;
        span.style.animationDuration = `${Math.random() * 3 + 2}s`;

        container.appendChild(span);

        // Remove element after animation ends
        setTimeout(() => {
            span.remove();
        }, 5000);
    }
}

// Call the function when the page loads
setInterval(createFallingElements, 1500);

// Classes
class Boat {
    constructor(location = 0, color = 'Y', number = 1) {
        this.location = location;
        this.color = color;
        this.number = number;
    }

    moveForward(steps) {
        this.location += steps;
    }

    moveBackward(steps) {
        this.location -= steps;
        if (this.location < 0) this.location = 0;
    }

    getLocation() {
        return this.location;
    }

    getColor() {
        return this.color;
    }
}

class Player {
    constructor(name, boat) {
        this.name = name;
        this.boat = boat;
        this.turns = 0;
    }

    takeTurn(diceRoll, river) {
        let newPosition = this.boat.getLocation() + diceRoll;
        if (newPosition >= river.length) newPosition = river.length - 1;

        const obstacle = river[newPosition];
        if (obstacle === 'C') {
            console.log(`${this.name} hit a current! Moving forward 2 steps.`);
            newPosition += 2;
        } else if (obstacle === 'T') {
            console.log(`${this.name} hit a trap! Moving backward 2 steps.`);
            newPosition -= 2;
        }

        this.boat.moveForward(diceRoll);
        if (newPosition >= river.length) newPosition = river.length - 1;
        this.boat.location = newPosition;
    }

    incrementTurns() {
        this.turns++;
    }
}

class Dice {
    roll() {
        return Math.floor(Math.random() * 6) + 1;
    }
}

// Utility Functions
function generateRiver(length) {
    const river = Array(length).fill('-');
    for (let i = 10; i < river.length; i += 10) {
        river[i] = Math.random() > 0.5 ? 'C' : 'T';
    }
    return river;
}

// Leaderboard Management
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

function updateLeaderboard() {
    const leaderboardDiv = document.getElementById('top-scores');
    leaderboardDiv.innerHTML = '';

    leaderboard
        .sort((a, b) => a.turns - b.turns) // Sort by least number of turns
        .slice(0, 5) // Limit to top 5 scores
        .forEach((entry, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${entry.name} - ${entry.turns} turns`;
            leaderboardDiv.appendChild(li);
        });
}

function saveLeaderboard() {
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function addToLeaderboard(player) {
    leaderboard.push({ name: player.name, turns: player.turns });
    saveLeaderboard();
    updateLeaderboard();
}

// Game Initialization
const river = generateRiver(100);
const dice = new Dice();
let player1, player2, currentPlayer;

function startGame() {
    const player1Name = document.getElementById('player1-name').value || 'Player 1';
    const player2Name = document.getElementById('player2-name').value || 'Player 2';

    player1 = new Player(player1Name, new Boat());
    player2 = new Player(player2Name, new Boat());
    currentPlayer = player1;

    document.getElementById('instructions').innerText = `Welcome ${player1Name} and ${player2Name}!`;
    updateRiver();
    document.getElementById('roll-dice').disabled = false;
}

function updateRiver() {
    const riverDiv = document.getElementById('river-track');
    riverDiv.innerHTML = river
        .map((segment, index) => {
            if (index === player1.boat.getLocation() && index === player2.boat.getLocation()) {
                return `<span class="boat">[P1+P2]</span>`;
            } else if (index === player1.boat.getLocation()) {
                return `<span class="boat">[P1]</span>`;
            } else if (index === player2.boat.getLocation()) {
                return `<span class="boat">[P2]</span>`;
            } else {
                return `<span>${segment}</span>`;
            }
        })
        .join('');
}

function rollDice() {
    const diceRoll = dice.roll();
    document.getElementById('dice-result').innerText = `${currentPlayer.name} rolled a ${diceRoll}!`;

    currentPlayer.takeTurn(diceRoll, river);
    updateRiver();

    if (currentPlayer.boat.getLocation() >= river.length - 1) {
        document.getElementById('instructions').innerText = `${currentPlayer.name} wins!`;
        document.getElementById('roll-dice').disabled = true;

        // Add the winner to the leaderboard
        addToLeaderboard(currentPlayer);
    } else {
        currentPlayer.incrementTurns();
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        document.getElementById('current-player').innerText = `${currentPlayer.name}'s turn`;
    }
}

// Event Listeners
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('roll-dice').addEventListener('click', rollDice);

// Update leaderboard on page load
updateLeaderboard();

