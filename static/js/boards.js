//    This file is part of the Tetris Game project. 
// License: This code is free to use and modify, but you must provide recognition to the original developer.
// Author: CTechDigital.com 
// Date: 2023-10-01
class Board {
    constructor(width, height) {
        this.BOARD_WIDTH = width;
        this.BOARD_HEIGHT = height;
        this.board = Array(this.BOARD_WIDTH * this.BOARD_HEIGHT).fill(0);
        this.curX = 0;
        this.curY = 0;
        this.numLinesRemoved = 0;
        this.isFallingFinished = false;
        this.lastLinesCleared = 0;
        this.clearBoard();
    }

    clearBoard() {
        for (let i = 0; i < this.BOARD_HEIGHT * this.BOARD_WIDTH; i++) {
            this.board[i] = 0;
        }
        this.lastLinesCleared = 0;
    }

    shapeAt(x, y) {
        if (x < 0 || x >= this.BOARD_WIDTH || y < 0 || y >= this.BOARD_HEIGHT) {
            return -1; 
        }
        return this.board[(y * this.BOARD_WIDTH) + x];
    }

    tryMove(newPiece, newX, newY) {
        for (let i = 0; i < 4; i++) {
            const x = newX + newPiece.x(i);
            const y = newY + newPiece.y(i); 
            
            if (x < 0 || x >= this.BOARD_WIDTH || y < 0 || y >= this.BOARD_HEIGHT) {
                return false;
            }
            
            if (this.shapeAt(x, y) !== 0) {
                return false;
            }
        }
        
        this.curX = newX;
        this.curY = newY;
        return true;
    }

    pieceDropped(shape) {
        for (let i = 0; i < 4; i++) {
            const x = this.curX + shape.x(i);
            const y = this.curY + shape.y(i); 
            
            if (x >= 0 && x < this.BOARD_WIDTH && y >= 0 && y < this.BOARD_HEIGHT) {
                this.board[(y * this.BOARD_WIDTH) + x] = shape.getShape();
            }
        }
        
        this.removeFullLines();
    }

    removeFullLines() {
        let numFullLines = 0;
        for (let i = this.BOARD_HEIGHT - 1; i >= 0; i--) {
            let lineIsFull = true;
            for (let j = 0; j < this.BOARD_WIDTH; j++) {
                if (this.shapeAt(j, i) === 0) {
                    lineIsFull = false;
                    break;
                }
            }
            if (lineIsFull) {
                numFullLines++;
                for (let k = i; k > 0; k--) {
                    for (let j = 0; j < this.BOARD_WIDTH; j++) {
                        this.board[(k * this.BOARD_WIDTH) + j] = this.board[((k - 1) * this.BOARD_WIDTH) + j];
                    }
                }
                for (let j = 0; j < this.BOARD_WIDTH; j++) {
                    this.board[j] = 0;
                }
                i++; 
            }
        }
        this.lastLinesCleared = numFullLines;
        if (numFullLines > 0) {
            this.numLinesRemoved += numFullLines;
            this.isFallingFinished = true;
        } else {
            this.isFallingFinished = false;
        }
    }

    updateScore() {
    }

    draw(context) {
        const colors = Shape.COLORS;
        
        context.fillStyle = '#121212';
        context.fillRect(0, 0, this.BOARD_WIDTH, this.BOARD_HEIGHT);
        
        context.strokeStyle = '#1A1A1A';
        context.lineWidth = 0.05;
        
        for (let y = 0; y <= this.BOARD_HEIGHT; y++) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(this.BOARD_WIDTH, y);
            context.stroke();
        }
        
        for (let x = 0; x <= this.BOARD_WIDTH; x++) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, this.BOARD_HEIGHT);
            context.stroke();
        }
        
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                const shape = this.shapeAt(x, y);
                
                if (shape !== 0) { 
                    this.drawSquare(context, x, y, colors[shape]);
                }
            }
        }
    }

    drawSquare(context, x, y, color) {
        context.fillStyle = color;
        context.fillRect(x, y, 1, 1);
        
        context.fillStyle = 'rgba(255, 255, 255, 0.3)'; 
        context.fillRect(x, y, 1, 0.1);
        context.fillRect(x, y, 0.1, 1);
        
        context.fillStyle = 'rgba(0, 0, 0, 0.3)'; 
        context.fillRect(x, y + 0.9, 1, 0.1);
        context.fillRect(x + 0.9, y, 0.1, 1);
    }
}
