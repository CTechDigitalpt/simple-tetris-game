//    This file is part of the Tetris Game project. 
// License: This code is free to use and modify, but you must provide recognition to the original developer.
// Author: CTechDigital.com 
// Date: 2023-10-01
class Tetris {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.blockSize = 20;
        this.boardWidth = Math.floor(this.canvas.width / this.blockSize);
        this.boardHeight = Math.floor(this.canvas.height / this.blockSize);
        this.context.scale(this.blockSize, this.blockSize);

        this.board = new Board(this.boardWidth, this.boardHeight);
        this.currentShape = new Shape();
        this.currentShape.setRandomShape();

        this.score = 0;
        this.isGameOver = false;
        this.isPaused = false;

        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;

        this._animationFrame = null;
        this.update = this.update.bind(this);
    }

    resizeCanvas(width, height) {
        if (this._animationFrame) {
            cancelAnimationFrame(this._animationFrame);
            this._animationFrame = null;
        }
        this.canvas.width = width;
        this.canvas.height = height;
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.blockSize = 20;
        this.boardWidth = Math.floor(width / this.blockSize);
        this.boardHeight = Math.floor(height / this.blockSize);
        this.board = new Board(this.boardWidth, this.boardHeight);
        this.context.scale(this.blockSize, this.blockSize);
        this.score = 0;
        this.isGameOver = false;
        this.isPaused = false;
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.updateScore();
        this.draw();
    }

    start() {
        this.board.clearBoard();
        this.score = 0;
        this.isGameOver = false;
        this.isPaused = false;
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.board.curX = Math.floor(this.boardWidth / 2) - 1;
        this.board.curY = 0;
        this.currentShape.setRandomShape();
        this.updateScore();
        if (!this._animationFrame) {
            this._animationFrame = requestAnimationFrame(this.update);
        }
        // Enable/disable buttons if present
        const startGameBtn = document.getElementById('start-game-btn');
        const restartGameBtn = document.getElementById('restart-game-btn');
        if (startGameBtn) startGameBtn.disabled = true;
        if (restartGameBtn) restartGameBtn.disabled = false;
    }

    restart() {
        if (this._animationFrame) {
            cancelAnimationFrame(this._animationFrame);
            this._animationFrame = null;
        }
        this.start();
    }

    moveLeft() {
        if (this.isGameOver || this.isPaused) return;
        if (this.board.tryMove(this.currentShape, this.board.curX - 1, this.board.curY)) {
            this.draw();
        }
    }

    moveRight() {
        if (this.isGameOver || this.isPaused) return;
        if (this.board.tryMove(this.currentShape, this.board.curX + 1, this.board.curY)) {
            this.draw();
        }
    }

    rotate() {
        if (this.isGameOver || this.isPaused) return;
        const rotatedShape = this.currentShape.rotateRight();
        if (this.board.tryMove(rotatedShape, this.board.curX, this.board.curY)) {
            this.currentShape = rotatedShape;
            this.draw();
        }
    }

    moveDown() {
        if (this.isGameOver || this.isPaused) return;
        if (this.board.tryMove(this.currentShape, this.board.curX, this.board.curY + 1)) {
            this.draw();
            return true;
        } else {
            this.pieceDropped();
            return false;
        }
    }

    drop() {
        if (this.isGameOver || this.isPaused) return;
        let newY = this.board.curY;
        while (this.board.tryMove(this.currentShape, this.board.curX, newY + 1)) {
            newY++;
        }
        if (newY > this.board.curY) {
            this.board.curY = newY;
        }
        this.pieceDropped();
        this.draw();
    }

    pieceDropped() {
        this.board.pieceDropped(this.currentShape);
        if (this.board.lastLinesCleared) {
            this.score += this.board.lastLinesCleared * 100;
            this.updateScore();
        }
        // Only call newPiece if the piece was actually placed
        if (!this.isGameOver) {
            this.newPiece();
        }
    }

    newPiece() {
        this.currentShape.setRandomShape();
        
        // Reset position to top center
        this.board.curX = Math.floor(this.board.BOARD_WIDTH / 2) - 1;
        this.board.curY = 0;
        
        // Add a small delay to ensure board state is stable
        // This prevents false game overs after line clears
        setTimeout(() => {
            // Only check for game over if we can't place the piece
            let canPlace = true;
            for (let i = 0; i < 4; i++) {
                const x = this.board.curX + this.currentShape.x(i);
                const y = this.board.curY + this.currentShape.y(i);
                
                // Skip boundary checks - they shouldn't happen at spawn
                if (x < 0 || x >= this.board.BOARD_WIDTH || y < 0 || y >= this.board.BOARD_HEIGHT) {
                    continue; // Just skip out-of-bounds coordinates at spawn
                }
                
                // Only check actual block collisions
                if (this.board.shapeAt(x, y) !== 0) {
                    canPlace = false;
                    break;
                }
            }
            
            if (!canPlace) {
                // Double check that we're not getting a false game over
                if (this.score > 0 && this.board.numLinesRemoved > 0) {
                    // Force clear the top 4 rows to prevent false game overs
                    for (let y = 0; y < 4; y++) {
                        for (let x = 0; x < this.board.BOARD_WIDTH; x++) {
                            this.board.board[(y * this.board.BOARD_WIDTH) + x] = 0;
                        }
                    }
                    // Try again after clearing
                    this.board.tryMove(this.currentShape, this.board.curX, this.board.curY);
                } else {
                    this.gameOver();
                }
            } else {
                // Actually move the piece to the board
                this.board.tryMove(this.currentShape, this.board.curX, this.board.curY);
            }
        }, 0);
    }

    gameOver() {
        this.isGameOver = true;
        this.updateScore();
        alert("Game Over! Your score: " + this.score);
        // Disable buttons if present
        const startGameBtn = document.getElementById('start-game-btn');
        const restartGameBtn = document.getElementById('restart-game-btn');
        if (startGameBtn) startGameBtn.disabled = false;
        if (restartGameBtn) restartGameBtn.disabled = true;
    }

    updateScore() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.boardWidth, this.boardHeight);
        this.board.draw(this.context);
        if (!this.isGameOver && this.currentShape.getShape() !== 0) {
            this.currentShape.draw(this.context, this.board.curX, this.board.curY);
        }
    }

    update(time = 0) {
        if (this.isGameOver) {
            this._animationFrame = null;
            return;
        }
        if (this.isPaused) {
            this._animationFrame = requestAnimationFrame(this.update);
            return;
        }
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.moveDown();
            this.dropCounter = 0;
            
            // Cap the speed increase to prevent too fast dropping at high scores
            // This prevents game over from pieces dropping too fast to control
            this.dropInterval = Math.max(300, 1000 - (this.score / 20));
        }
        this.draw();
        this._animationFrame = requestAnimationFrame(this.update);
    }
}
