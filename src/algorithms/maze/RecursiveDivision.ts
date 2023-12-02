function delay() {
    return new Promise(resolve => setTimeout(resolve, 15));
}

async function generate(startingGrid: number[][], saveFinalGrid: (grid: number[][]) => void) {
    const grid: number[][] = startingGrid;

    await addOuterWalls(grid, saveFinalGrid);
    await addInnerWalls(true, 1, grid[0].length - 2, 1, grid.length - 2, grid, saveFinalGrid );
    return grid;
}

async function addOuterWalls(grid: number[][], setFinalGrid: { (grid: number[][]): void; (arg0: number[][]): void; }) {
    for (let i = 0; i < grid.length; i++) {
        if (i == 0 || i == (grid.length - 1)) {
            for (let j = 0; j < grid[0].length; j++) {
                await delay().then(
                    () => {
                        if (grid[i][j] !== 3 && grid[i][j] !== 4 && grid[i][j] !== 5) {
                            grid[i][j] = 1;
                            setFinalGrid(grid);
                        }
                    }
                )
            }
        } else {
            await delay().then(
                () => {
                    if (grid[i][0] !== 3 && grid[i][0] !== 4 && grid[i][0] !== 5) {
                        grid[i][0] = 1;
                        grid[i][grid[0].length - 1] = 1;
                        setFinalGrid(grid);
                    }
                }
            )
        }
    }
}

async function addInnerWalls(h: boolean, minX: number, maxX: number, minY: number, maxY: number, grid: number[][], setFinalGrid: (grid: number[][]) => void) {
    if (h) {
        if (maxX - minX < 2) {
            return;
        }

        const y = Math.floor(randomNumber(minY, maxY) / 2) * 2;
        await addHWall(minX, maxX, y, grid, setFinalGrid);

        await addInnerWalls(!h, minX, maxX, minY, y - 1, grid, setFinalGrid);
        await addInnerWalls(!h, minX, maxX, y + 1, maxY, grid, setFinalGrid);
    } else {
        if (maxY - minY < 2) {
            return;
        }

        const x = Math.floor(randomNumber(minX, maxX) / 2) * 2;
        await addVWall(minY, maxY, x, grid, setFinalGrid);

        await addInnerWalls(!h, minX, x - 1, minY, maxY, grid, setFinalGrid);
        await addInnerWalls(!h, x + 1, maxX, minY, maxY, grid, setFinalGrid);
    }
}

async function addHWall(minX: number, maxX: number, y: number, grid: number[][], setFinalGrid: { (grid: number[][]): void; (arg0: number[][]): void; }) {
    const hole = Math.floor(randomNumber(minX, maxX) / 2) * 2 + 1;

    for (let i = minX; i <= maxX; i++) {
        if (grid[y][i] !== 3 && grid[y][i] !== 4 && grid[y][i] !== 5)
            await delay().then(
                () => {
                    if (i == hole && (y !== 0 && i !== 0 && y !== grid.length && i !== grid.length) ) grid[y][i] = 0;
                    else grid[y][i] = 1;
                }
            )
        setFinalGrid(grid);
    }
}

async function addVWall(minY: number, maxY: number, x: number, grid: number[][], setFinalGrid: { (grid: number[][]): void; (arg0: number[][]): void; }) {
    const hole = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1;

    for (let i = minY; i <= maxY; i++) {
        if (grid[i][x] !== 3 && grid[i][x] !== 4 && grid[i][x] !== 5)
            await delay().then(
                () => {
                    if (i == hole && (x !== 0 && i !== 0 && x !== grid[0].length && i !== grid[0].length) ) grid[i][x] = 0;
                    else grid[i][x] = 1;
                }
            )
        setFinalGrid(grid);
    }
}

function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function getRecursiveDivisonMaze(startingGrid: number[][] | undefined, setFinalGrid: (grid: number[][]) => void) {
    if (!startingGrid) throw new Error("Starting grid is undefined");
    return generate(startingGrid, setFinalGrid);
}