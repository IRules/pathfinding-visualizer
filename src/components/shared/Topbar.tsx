import {ModeToggle} from "@/components/mode-toggle.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import React, {useState} from "react";
import {ChevronDown, HelpCircle} from "lucide-react";
import {Separator} from "@/components/ui/separator.tsx";

/*
* TODO: fix the topbar breaking on screen width smaller than 870px
* */

const algorithms: { name: string, id: string }[] = [
    {
        name: "Dijsktra's Algorithm",
        id: "dijkstra"
    },
    {
        name: "A* Search",
        id: "astar"
    },
    {
        name: "Greedy Best-first Search",
        id: "greedy"
    },
    {
        name: "Swarm Algorithm",
        id: "swarm"
    },
    {
        name: "Convergent Swarm Algorithm",
        id: "convergent"
    },
    {
        name: "Bidirectional Swarm Algorithm",
        id: "bidirectional"
    },
    {
        name: "Breadth-first Search",
        id: "bfs"
    },
    {
        name: "Depth-first Search",
        id: "dfs"
    }
]

const mazesAndPatterns: { name: string, id: string }[] = [
    {
        name: "Recursive Division",
        id: "recursive-division"
    },
    {
        name: "Recursive Division (Vertical Skew)",
        id: "recursive-division-vertical-skew"
    },
    {
        name: "Recursive Division (Horizontal Skew)",
        id: "recursive-division-horizontal-skew"
    },
    {
        name: "Basic Random Maze",
        id: "basic-random-maze"
    },
    {
        name: "Basic Weight Maze",
        id: "basic-weight-maze"
    },
    {
        name: "Simple Stair Pattern",
        id: "simple-stair-pattern"
    }
]

const Topbar = () => {

    const [algorithm, setAlgorithm] = React.useState("")
    const [mazePattern, setMazePattern] = React.useState("")
    const [speed, setSpeed] = useState<string>("fast")

    return (
        <section className="flex h-16 items-center px-4 border-b gap-3">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Pathfinding Visualizer
            </h3>
            <Separator orientation="vertical" className="h-10"/>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">{
                        algorithms.find((algo) => algo.id === algorithm)?.name || "Algorithms"
                    }
                        <ChevronDown className="w-4 h-4"/> </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Algorithms</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuRadioGroup value={algorithm} onValueChange={setAlgorithm}>
                        {algorithms.map((algo) => (
                            <DropdownMenuRadioItem key={algo.id} value={algo.id}>
                                {algo.name}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">{
                        mazesAndPatterns.find((algo) => algo.id === mazePattern)?.name || "Mazes & Patterns"
                    }
                        <ChevronDown className="w-4 h-4"/> </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Mazes & Patterns</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuRadioGroup value={mazePattern} onValueChange={setMazePattern}>
                        {mazesAndPatterns.map((algo) => (
                            <DropdownMenuRadioItem key={algo.id} value={algo.id}>
                                {algo.name}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="ml-auto flex gap-3 items-center space-x-4 h-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">{
                            speed.slice(0, 1).toUpperCase() + speed.slice(1)
                        }
                            <ChevronDown className="w-4 h-4"/> </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Speed</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuRadioGroup value={speed} onValueChange={setSpeed}>
                            <DropdownMenuRadioItem value="fast">Fast</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="average">Average</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="slow">Slow</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button className="bg-green-700 hover:bg-green-600">Visualize!</Button>
                <Separator orientation="vertical"/>
                <Button variant="outline" size="icon">
                    <HelpCircle className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100"/>
                </Button>
                <ModeToggle/>
            </div>
        </section>
    )
}
export default Topbar
