//    This file is part of the Tetris Game project. 
// License: This code is free to use and modify, but you must provide recognition to the original developer.
// Author: CTechDigital.com 
// Date: 2023-10-01
document.getElementById('toggle-sidebar-btn').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    sidebar.classList.toggle('hidden');
    toggleBtn.textContent = sidebar.classList.contains('hidden') ? 'Show Sidebar' : 'Hide Sidebar';
});

let tetris = new Tetris('tetris-board');
const startGameBtn = document.getElementById('start-game-btn');
const restartGameBtn = document.getElementById('restart-game-btn');

const canvasWidthInput = document.getElementById('canvas-width');
const canvasHeightInput = document.getElementById('canvas-height');
const applySizeBtn = document.getElementById('apply-size-btn');

applySizeBtn.addEventListener('click', () => {
    const width = parseInt(canvasWidthInput.value, 10);
    const height = parseInt(canvasHeightInput.value, 10);
    if (width >= 100 && width <= 800 && height >= 200 && height <= 1200) {
        tetris.resizeCanvas(width, height);
        tetris.start();
    }
});

const topScores = JSON.parse(localStorage.getItem('topScores')) || [];

function updateTopScores(newScore) {
    topScores.push(newScore);
    topScores.sort((a, b) => b - a); 
    if (topScores.length > 10) topScores.pop(); 
    localStorage.setItem('topScores', JSON.stringify(topScores));

    const scoresList = document.getElementById('top-scores-list');
    scoresList.innerHTML = '';
    topScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${score}`;
        scoresList.appendChild(li);
    });
}

tetris.gameOver = function () {
    this.isGameOver = true;
    this.updateScore();
    updateTopScores(this.score); 
    alert("Game Over! Your score: " + this.score);
    startGameBtn.disabled = false;
    restartGameBtn.disabled = true;
};

window.addEventListener('load', () => {
    updateTopScores(0); 
    tetris.start();
    startGameBtn.disabled = true;
    restartGameBtn.disabled = false;
});

startGameBtn.addEventListener('click', () => {
    tetris.start();
    startGameBtn.disabled = true;
    restartGameBtn.disabled = false;
});

restartGameBtn.addEventListener('click', () => {
    tetris.restart();
});

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            tetris.moveLeft();
            break;
        case 'ArrowRight':
            tetris.moveRight();
            break;
        case 'ArrowUp':
            tetris.rotate();
            break;
        case 'ArrowDown':
            tetris.moveDown();
            break;
        case ' ':
            tetris.drop();
            break;
    }
});

window.addEventListener('load', function() {
    console.log("Adding donation button effects");
    const donationButtons = document.querySelectorAll('#donate-btn-patreon, #donate-btn-paypal, #donate-btn-kofi');
    
    console.log("Found donation buttons:", donationButtons.length);
    
    setTimeout(() => {
        donationButtons.forEach(button => {
            button.classList.add('btn-flash');
            setTimeout(() => button.classList.remove('btn-flash'), 2000);
        });
    }, 3000);
    
    donationButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            console.log("Mouse entered donation button");
            this.classList.add('btn-flash');
            this.style.transition = "transform 0.2s";
            this.style.transform = "translateY(-3px)";
        });
        
        button.addEventListener('mouseleave', function() {
            console.log("Mouse left donation button");
            this.classList.remove('btn-flash');
            this.style.transform = "translateY(0)";
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = "translateY(2px)";
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = "translateY(-3px)";
        });
    });
});
