import {useEffect, useRef, useState} from "react";
import {Bomb, CircleDot, Cuboid, Eraser, Move, Play, Weight} from "lucide-react";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group.tsx";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import Topbar from "@/components/shared/Topbar.tsx";
import getRecursiveDivisonMaze from "@/algorithms/maze/RecursiveDivision.ts";

/*
* 0 - empty box
* 1 - filled box
* 2 - weight box
* 3 - start box
* 4 - end box
* 5 - bomb box
* 6 - visited box
* 7 - path box
* 8 - double visited box
* 9 - double path box
*
* */

const Grid = () => {

    const [finalGrid, setFinalGrid] = useState<number[][]>([]);

    const [selectedCommand, setSelectedCommand] = useState<string>("walls");

    const [bomb, setBomb] = useState<boolean>(false);

    const finalGridRef = useRef<number[][]>();

    const command = useRef<string>(selectedCommand)

    const isDown = useRef<boolean>(false);

    const isStartOrEnd = useRef<number>();

    const previousStartOrEnd = useRef<number[]>([]);

    function addOrRemoveBomb() {
        if (finalGridRef.current === undefined) return;

        if (bomb) {
            setBomb(false);
            for (let i = 0; i < finalGridRef.current.length; i++) {
                for (let j = 0; j < finalGridRef.current[i].length; j++) {
                    if (finalGridRef.current[i][j] === 5) {
                        finalGridRef.current[i][j] = 0;
                    }
                }
            }
            return;
        }
        for (let i = 0; i < finalGridRef.current.length; i++) {
            for (let j = 0; j < finalGridRef.current[i].length; j++) {
                if (finalGridRef.current[i][j] === 0) {
                    finalGridRef.current[i][j] = 5;
                    setBomb(true)
                    saveGridState(finalGridRef.current);
                    return;
                }
            }
        }
    }

    function generateGrid() {
        setBomb(false)
        const width = window.innerWidth * 0.95 / 25;
        const height = (window.innerHeight - 240) / 25;

        const grid: number[][] = [];
        for (let i = 0; i < height; i++) {
            grid.push([]);
            for (let j = 0; j < width; j++) {
                grid[i].push(0);
            }
        }

        grid[Math.round(height / 2)][Math.round(width / 8)] = 3;
        grid[Math.round(height / 2)][Math.round(width - width / 8)] = 4;

        setBomb(false)
        saveGridState(grid);
    }

    function clearWallsAndWeights() {
        if (finalGridRef.current === undefined) return;
        for (let i = 0; i < finalGridRef.current.length; i++) {
            for (let j = 0; j < finalGridRef.current[i].length; j++) {
                if (finalGridRef.current[i][j] === 1 || finalGridRef.current[i][j] === 2) {
                    finalGridRef.current[i][j] = 0;
                }
            }
        }
        setBomb(true)
        saveGridState(finalGridRef.current);
    }

    function clearPath() {
        if (finalGridRef.current === undefined) return;
        for (let i = 0; i < finalGridRef.current.length; i++) {
            for (let j = 0; j < finalGridRef.current[i].length; j++) {
                if (finalGridRef.current[i][j] === 6 || finalGridRef.current[i][j] === 7 || finalGridRef.current[i][j] === 8 || finalGridRef.current[i][j] === 9) {
                    finalGridRef.current[i][j] = 0;
                }
            }
        }
        saveGridState(finalGridRef.current);
    }

    function moveStartAndEndAndBomb(i: number, j: number) {
        if (finalGridRef.current === undefined) return;
        if (finalGridRef.current[i][j] === 3 || finalGridRef.current[i][j] === 4 || finalGridRef.current[i][j] === 5) return;
        const aux = previousStartOrEnd.current;
        if (!(aux[0] === i && aux[1] === j))
            previousStartOrEnd.current = [i, j, finalGridRef.current[i][j]];
        if (aux[2] === 5 || aux[2] === 3 || aux[2] === 4) finalGridRef.current[aux[0]][aux[1]] = 0;
        else finalGridRef.current[aux[0]][aux[1]] = aux[2];
        finalGridRef.current[i][j] = isStartOrEnd.current as number;
        saveGridState(finalGridRef.current);

    }

    function getIAndJ(event: PointerEvent) {
        return (event.target as HTMLElement).id.split(',').map(function (item) {
            return parseInt(item, 10);
        });
    }

    function saveGridState(finalGridRefState: number[][]) {
        setFinalGrid([...finalGridRefState])
        finalGridRef.current = [...finalGridRefState]
    }

    function generateMazePattern(algorithm: string) {

        clearWallsAndWeights();
        clearPath();
        switch (algorithm) {
            case "recursive-division":
                getRecursiveDivisonMaze(finalGridRef.current, saveGridState);
                break;
        }
    }

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (typeof document === "undefined") return;
        generateGrid();

        window.addEventListener("pointerdown", (event) => {
            const [i, j] = getIAndJ(event);
            if (isNaN(i) || isNaN(j)) return;
            if (finalGridRef.current === undefined) return;
            if ((finalGridRef.current[i][j] === 3 || finalGridRef.current[i][j] === 4 || finalGridRef.current[i][j] === 5) && command.current === "moveStartOrEnd") {
                isStartOrEnd.current = finalGridRef.current[i][j];
                previousStartOrEnd.current = [i, j, finalGridRef.current[i][j]];
            }
            isDown.current = true;
        })

        window.addEventListener("pointerup", () => {
            isDown.current = false;
            isStartOrEnd.current = undefined;
        })


        window.addEventListener("pointerover", (event) => {
            if (!isDown.current || finalGridRef.current === undefined) return;
            const [i, j] = getIAndJ(event);
            if (isNaN(i) || isNaN(j)) return;
            if (isStartOrEnd.current) {
                moveStartAndEndAndBomb(i, j)
                return;
            }
            switch (command.current) {
                case "walls":
                    if (finalGridRef.current[i][j] === 0) finalGridRef.current[i][j] = 1;
                    break;
                case "weight":
                    if (finalGridRef.current[i][j] === 0 || finalGridRef.current[i][j] === 1) finalGridRef.current[i][j] = 2;
                    break;
                case "delete":
                    if (finalGridRef.current[i][j] === 1 || finalGridRef.current[i][j] === 2)
                        finalGridRef.current[i][j] = 0
                    break;
            }
            saveGridState(finalGridRef.current);
        });

        return () => {
            window.removeEventListener("pointerdown", () => {
            });
            window.removeEventListener("pointerup", () => {
            });
            window.removeEventListener("pointerover", () => {
            });
        }
    }, [isDown]);


    return (
        <>
            <Topbar generateMazePattern={generateMazePattern}/>
            <section className="w-screen flex flex-col justify-center items-center flex-wrap py-10">
                <div className="flex h-16 items-center w-full gap-3 px-12 justify-between">
                    <div className="flex gap-3">
                        <ToggleGroup type="single" variant="outline" value={selectedCommand} onValueChange={(value) => {
                            setSelectedCommand(value);
                            command.current = value
                        }}>
                            <ToggleGroupItem value="walls" aria-label="Add Walls">
                                <Cuboid strokeWidth={3} className="h-4 w-4"/>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="weight" aria-label="Add Weights">
                                <Weight strokeWidth={3} className="h-4 w-4"/>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="delete" aria-label="Delete Walls & Weights">
                                <Eraser strokeWidth={3} className="h-4 w-4"/>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="moveStartOrEnd" aria-label="Move Start or End">
                                <Move strokeWidth={3} className="h-4 w-4"/>
                            </ToggleGroupItem>
                        </ToggleGroup>
                        <Separator orientation="vertical" className="h-10"/>
                        <ToggleGroup type="single" variant="outline" value={bomb ? "bomb" : "none"}
                                     onValueChange={() => {
                                         addOrRemoveBomb()
                                     }}>
                            <ToggleGroupItem value="bomb" aria-label="Add Walls">
                                <Bomb strokeWidth={3} className="h-4 w-4"/>
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Quick Actions</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={generateGrid}>Clear Board</DropdownMenuItem>
                            <DropdownMenuItem onClick={clearWallsAndWeights}>Clear Walls & Weights</DropdownMenuItem>
                            <DropdownMenuItem onClick={clearPath}>Clear Path</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div id="grid" className=" h-full">
                    {
                        finalGrid.map((row, i) => {
                            return (
                                <div key={i} className="flex">
                                    {
                                        row.map((_col, j) => {
                                            return (
                                                <div key={j} id={[i, j].toString()}
                                                     className={`w-[25px] h-[25px] border-[0.5px] border-gray-600 flex justify-center items-center ${finalGrid[i][j] === 1 ? "bg-gray-700" : null}`}>
                                                    {finalGrid[i][j] === 2 ?
                                                        <Weight strokeWidth={2}
                                                                className="w-full h-full pointer-events-none"/> : finalGrid[i][j] === 3 ?
                                                            <Play strokeWidth={5}
                                                                  className="w-full h-full pointer-events-none"/> : finalGrid[i][j] === 4 ?
                                                                <CircleDot strokeWidth={5}
                                                                           className="w-full h-full pointer-events-none"/> : finalGrid[i][j] === 5 ?
                                                                    <Bomb strokeWidth={5}
                                                                          className="w-full h-full pointer-events-none"/> : null}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>

            </section>
        </>
    )
}
export default Grid
