//    This file is part of the Tetris Game project. 
// License: This code is free to use and modify, but you must provide recognition to the original developer.
// Author: CTechDigital.com 
// Date: 2023-10-01
class Shape {
    // Define static color map for tetromino shapes
    static COLORS = [
        '#000000', // NoShape (black)
        '#CC6666', // ZShape (red)
        '#66CC66', // SShape (green)
        '#6666CC', // LineShape (blue)
        '#CCCC66', // TShape (yellow)
        '#CC66CC', // SquareShape (purple)
        '#66CCCC', // LShape (cyan)
        '#DAAA00'  // MirroredLShape (orange)
    ];

    constructor() {
        // Define the tetromino types - keep the enum order consistent
        this.Tetrominoe = {
            NoShape: 0,
            ZShape: 1,
            SShape: 2,
            LineShape: 3,
            TShape: 4,
            SquareShape: 5,
            LShape: 6,
            MirroredLShape: 7
        };

        // Initialize shape properties
        this.coords = Array(4).fill().map(() => Array(2).fill(0));
        this.pieceShape = this.Tetrominoe.NoShape;
        
        // Corrected: Ensure coordsTable matches the Tetrominoe enum order
        this.coordsTable = [
            [[0, 0], [0, 0], [0, 0], [0, 0]],       // NoShape (0)
            [[-1, 0], [0, 0], [0, 1], [1, 1]],      // ZShape (1)
            [[1, 0], [0, 0], [0, 1], [-1, 1]],      // SShape (2)
            [[0, -1], [0, 0], [0, 1], [0, 2]],      // LineShape (3)
            [[-1, 0], [0, 0], [1, 0], [0, 1]],      // TShape (4)
            [[0, 0], [1, 0], [0, 1], [1, 1]],       // SquareShape (5)
            [[-1, 0], [0, 0], [1, 0], [1, 1]],      // LShape (6)
            [[-1, 0], [0, 0], [1, 0], [-1, 1]]      // MirroredLShape (7)
        ];
    }

    // Set shape type and update coordinates
    setShape(shape) {
        // Add validation to prevent invalid shape indices
        if (shape < 0 || shape > 7) {
            console.warn('Invalid shape index:', shape);
            shape = this.Tetrominoe.NoShape;
        }
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 2; j++) {
                this.coords[i][j] = this.coordsTable[shape][i][j];
            }
        }
        this.pieceShape = shape;
    }

    // Helper methods to get and set coordinates
    setX(index, x) { this.coords[index][0] = x; }
    setY(index, y) { this.coords[index][1] = y; }
    x(index) { return this.coords[index][0]; }
    y(index) { return this.coords[index][1]; }
    getShape() { return this.pieceShape; }

    // Randomly select a shape type
    setRandomShape() {
        const randomShape = Math.floor(Math.random() * 7) + 1;
        this.setShape(randomShape);
    }

    // Find minimum x coordinate
    minX() {
        let m = this.coords[0][0];
        for (let i = 0; i < 4; i++) {
            m = Math.min(m, this.coords[i][0]);
        }
        return m;
    }

    // Find minimum y coordinate
    minY() {
        let m = this.coords[0][1];
        for (let i = 0; i < 4; i++) {
            m = Math.min(m, this.coords[i][1]);
        }
        return m;
    }

    // Create a new shape rotated left
    rotateLeft() {
        if (this.pieceShape === this.Tetrominoe.SquareShape) {
            return this;
        }

        const result = new Shape();
        result.pieceShape = this.pieceShape;

        for (let i = 0; i < 4; i++) {
            result.setX(i, -this.y(i));
            result.setY(i, this.x(i));
        }

        return result;
    }

    // Create a new shape rotated right
    rotateRight() {
        if (this.pieceShape === this.Tetrominoe.SquareShape) {
            return this;
        }

        const result = new Shape();
        result.pieceShape = this.pieceShape;

        for (let i = 0; i < 4; i++) {
            result.setX(i, this.y(i));
            result.setY(i, -this.x(i));
        }

        return result;
    }

    // Optimized draw method that minimizes context state changes
    draw(context, offsetX, offsetY) {
        if (this.pieceShape === this.Tetrominoe.NoShape) return;
        
        // Color for the current shape
        const color = Shape.COLORS[this.pieceShape];
        
        // First pass: Draw all blocks with main color
        context.fillStyle = color;
        for (let i = 0; i < 4; i++) {
            const x = offsetX + this.x(i);
            const y = offsetY + this.y(i);
            context.fillRect(x, y, 1, 1);
        }
        
        // Second pass: Draw light edges
        context.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 4; i++) {
            const x = offsetX + this.x(i);
            const y = offsetY + this.y(i);
            context.fillRect(x, y, 1, 0.1);
            context.fillRect(x, y, 0.1, 1);
        }
        
        // Third pass: Draw dark edges
        context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        for (let i = 0; i < 4; i++) {
            const x = offsetX + this.x(i);
            const y = offsetY + this.y(i);
            context.fillRect(x, y + 0.9, 1, 0.1);
            context.fillRect(x + 0.9, y, 0.1, 1);
        }
    }
}
