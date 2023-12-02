import {useEffect, useRef, useState} from "react";
import {CircleDot, Cuboid, Eraser, Play, Weight} from "lucide-react";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group.tsx";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";

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

    const [speed, setSpeed] = useState<string>("fast")

    const [selectedCommand, setSelectedCommand] = useState<string>("walls");

    const finalGridRef = useRef<number[][]>();

    const command = useRef<string>(selectedCommand)

    const isDown = useRef<boolean>(false);

    function generateGrid() {
        const width = window.innerWidth * 0.9 / 25;
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


        setFinalGrid(grid);
        finalGridRef.current = grid;
    }

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (typeof document === "undefined") return;
        generateGrid();

        window.addEventListener("pointerdown", () => {
            isDown.current = true;
        })

        window.addEventListener("pointerup", () => {
            isDown.current = false;
        })


        window.addEventListener("pointerover", (event) => {
            if (!isDown.current || finalGridRef.current === undefined) return;
            const [i, j] = (event.target as HTMLElement).id.split(',').map(function (item) {
                return parseInt(item, 10);
            });
            if (isNaN(i) || isNaN(j)) return;
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
            setFinalGrid([...finalGridRef.current])
            finalGridRef.current = [...finalGridRef.current]
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
        <section className="w-screen flex flex-col justify-center items-center flex-wrap p-10">
            <div className="flex h-16 items-center w-full gap-3 px-12 justify-between">
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
                </ToggleGroup>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Quick Actions</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>Clear Board</DropdownMenuItem>
                        <DropdownMenuItem>Clear Walls & Weights</DropdownMenuItem>
                        <DropdownMenuItem>Clear Path</DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Speed</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup value={speed} onValueChange={setSpeed}>
                                        <DropdownMenuRadioItem value="fast">Fast</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="Average">Average</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="Slow">Slow</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
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
                                                 className="w-[25px] h-[25px] border-[0.5px] border-gray-600 flex justify-center items-center">
                                                {finalGrid[i][j] === 1 ? <div
                                                    className="w-full h-full bg-gray-700"/> : finalGrid[i][j] === 2 ?
                                                    <Weight  strokeWidth={2} id={[i, j].toString()}/> : finalGrid[i][j] === 3 ?
                                                        <Play strokeWidth={5}/> : finalGrid[i][j] === 4 ?
                                                            <CircleDot strokeWidth={5}/> : null}
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
    )
}
export default Grid
