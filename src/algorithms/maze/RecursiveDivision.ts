function generate(startingGrid: number[][]) {
    const grid: number[][] = startingGrid;


    addInnerWalls(true, 1, grid[0].length - 1, 1, grid.length - 1, grid);
    addOuterWalls(grid);
    return grid;
}

function addOuterWalls(grid: number[][]) {
    for (let i = 0; i < grid.length; i++) {
        if (i == 0 || i == (grid.length - 1)) {
            for (let j = 0; j < grid[0].length; j++) {
                if (grid[i][j] !== 3 && grid[i][j] !== 4 && grid[i][j] !== 5)
                    grid[i][j] = 1;
            }
        } else {
            if (grid[i][0] !== 3 && grid[i][0] !== 4 && grid[i][0] !== 5) {
                grid[i][0] = 1;
                grid[i][grid[0].length - 1] = 1;
            }
        }
    }
}

function addInnerWalls(h: boolean, minX: number, maxX: number, minY: number, maxY: number, grid: number[][]) {
    if (h) {

        if (maxX - minX < 2) {
            return;
        }

        const y = Math.floor(randomNumber(minY, maxY) / 2) * 2;
        addHWall(minX, maxX, y, grid);

        addInnerWalls(!h, minX, maxX, minY, y - 1, grid);
        addInnerWalls(!h, minX, maxX, y + 1, maxY, grid);
    } else {
        if (maxY - minY < 2) {
            return;
        }

        const x = Math.floor(randomNumber(minX, maxX) / 2) * 2;
        addVWall(minY, maxY, x, grid);

        addInnerWalls(!h, minX, x - 1, minY, maxY, grid);
        addInnerWalls(!h, x + 1, maxX, minY, maxY, grid);
    }
}

function addHWall(minX: number, maxX: number, y: number, grid: number[][]) {
    const hole = Math.floor(randomNumber(minX, maxX) / 2) * 2 + 1;

    for (let i = minX; i <= maxX; i++) {
        if (grid[y][i] !== 3 && grid[y][i] !== 4 && grid[y][i] !== 5)
            if (i == hole) grid[y][i] = 0;
            else grid[y][i] = 1;
    }
}

function addVWall(minY: number, maxY: number, x: number, grid: number[][]) {
    const hole = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1;

    for (let i = minY; i <= maxY; i++) {
        if (grid[i][x] !== 3 && grid[i][x] !== 4 && grid[i][x] !== 5)
            if (i == hole) grid[i][x] = 0;
            else grid[i][x] = 1;
    }
}

function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function getRecursiveDivisonMaze(startingGrid: number[][] | undefined) {
    if (!startingGrid) throw new Error("Starting grid is undefined");
    return generate(startingGrid);
}