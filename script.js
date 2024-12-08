(function() {
    const ROWS = 50;
    const COLS = 50;
    let grid = [];
    let isRunning = false;
    let generation = 0;
    let simulationInterval;

    const gridElement = document.getElementById('grid');
    const generationElement = document.getElementById('generation');
    const toggleBtn = document.getElementById('toggleBtn');
    const randomizeBtn = document.getElementById('randomizeBtn');
    const clearBtn = document.getElementById('clearBtn');

    function initializeGrid() {
        grid = Array.from({
            length: ROWS
        }, () => Array(COLS).fill(false));
        gridElement.innerHTML = '';
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', toggleCell);
                gridElement.appendChild(cell);
            }
        }
        updateGridDisplay();
    }

    function toggleCell(event) {
        const row = parseInt(event.target.dataset.row, 10);
        const col = parseInt(event.target.dataset.col, 10);
        grid[row][col] = !grid[row][col];
        updateGridDisplay();
    }

    function updateGridDisplay() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / COLS);
            const col = index % COLS;
            cell.classList.toggle('alive', grid[row][col]);
        });
    }

    function countNeighbors(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                    count += grid[newRow][newCol] ? 1 : 0;
                }
            }
        }
        return count;
    }

    function nextGeneration() {
        const newGrid = grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                const neighbors = countNeighbors(rowIndex, colIndex);
                if (cell) return neighbors === 2 || neighbors === 3;
                return neighbors === 3;
            })
        );
        grid = newGrid;
        generation++;
        generationElement.textContent = `Generation: ${generation}`;
        updateGridDisplay();
    }

    function toggleSimulation() {
        isRunning = !isRunning;
        toggleBtn.textContent = isRunning ? 'Stop' : 'Start';
        if (isRunning) {
            simulationInterval = setInterval(nextGeneration, 100);
        } else {
            clearInterval(simulationInterval);
        }
    }
    function randomizeGrid() {
        grid = grid.map(row => row.map(() => Math.random() > 0.7));
        generation = 0;
        generationElement.textContent = 'Generation: 0';
        updateGridDisplay();
    }

    function clearGrid() {
        grid = grid.map(row => row.map(() => false));
        generation = 0;
        generationElement.textContent = 'Generation: 0';
        updateGridDisplay();
    }


    toggleBtn.addEventListener('click', toggleSimulation);
    randomizeBtn.addEventListener('click', randomizeGrid);
    clearBtn.addEventListener('click', clearGrid);

    initializeGrid();
})();