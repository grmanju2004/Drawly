"use client";

import { useEffect, useRef, useState } from "react";
import { Game } from "@/draw/Game";
import { Circle, Pencil, Square, Type, Eraser, Trash, LogOut } from "lucide-react";
import { useRouter } from "next/navigation"; // Import the router!

export type Tool = "circle" | "rect" | "pencil" | "text" | "eraser";

export function Canvas({ roomId, socket }: { socket: WebSocket; roomId: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("pencil");
    
    // Initialize the Next.js router
    const router = useRouter();

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;

            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            const handleResize = () => {
                if (canvasRef.current) {
                    canvasRef.current.width = window.innerWidth;
                    canvasRef.current.height = window.innerHeight;
                    g.clearCanvas(); 
                }
            };
            window.addEventListener("resize", handleResize);

            return () => {
                g.destroy();
                window.removeEventListener("resize", handleResize);
            };
        }
    }, [roomId, socket]);

    useEffect(() => {
        if (game) {
            game.setTool(selectedTool);
        }
    }, [selectedTool, game]);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-zinc-900">
            
            {/* Top Left Exit Button */}
            <button
                onClick={() => {
                    // Make sure to clean up the game engine before leaving
                    game?.destroy();
                    router.push("/dashboard");
                }}
                className="absolute top-6 left-6 p-3 bg-[#FDFCF8] text-zinc-500 hover:text-zinc-900 rounded-xl border border-zinc-200 shadow-xl transition-all hover:bg-zinc-100 z-10"
                title="Exit to Dashboard"
            >
                <LogOut className="w-5 h-5 ml-[-2px]" /> 
            </button>

            {/* Floating Toolbar */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#FDFCF8] px-4 py-3 rounded-2xl border border-zinc-200 shadow-2xl z-10 transition-all">
                <button
                    onClick={() => setSelectedTool("pencil")}
                    className={`p-3 rounded-xl transition-all ${
                        selectedTool === "pencil" 
                        ? "bg-zinc-900 text-[#FDFCF8] shadow-md" 
                        : "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900"
                    }`}
                    title="Pencil Tool"
                >
                    <Pencil className="w-5 h-5" />
                </button>
                
                <button
                    onClick={() => setSelectedTool("rect")}
                    className={`p-3 rounded-xl transition-all ${
                        selectedTool === "rect" 
                        ? "bg-zinc-900 text-[#FDFCF8] shadow-md" 
                        : "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900"
                    }`}
                    title="Rectangle Tool"
                >
                    <Square className="w-5 h-5" />
                </button>
                
                <button
                    onClick={() => setSelectedTool("circle")}
                    className={`p-3 rounded-xl transition-all ${
                        selectedTool === "circle" 
                        ? "bg-zinc-900 text-[#FDFCF8] shadow-md" 
                        : "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900"
                    }`}
                    title="Circle Tool"
                >
                    <Circle className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setSelectedTool("text")}
                    className={`p-3 rounded-xl transition-all ${
                        selectedTool === "text" 
                        ? "bg-zinc-900 text-[#FDFCF8] shadow-md" 
                        : "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900"
                    }`}
                    title="Text Tool"
                >
                    <Type className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setSelectedTool("eraser")}
                    className={`p-3 rounded-xl transition-all ${
                        selectedTool === "eraser" 
                        ? "bg-zinc-900 text-[#FDFCF8] shadow-md" 
                        : "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900"
                    }`}
                    title="Eraser Tool"
                >
                    <Eraser className="w-5 h-5" />
                </button>

                <div className="w-px h-8 bg-zinc-200 mx-1"></div>

                <button
                    onClick={() => {
                        if (confirm("Are you sure you want to clear the entire canvas?")) {
                            game?.clearAll();
                        }
                    }}
                    className="p-3 rounded-xl transition-all text-red-500 hover:bg-red-50"
                    title="Clear Canvas"
                >
                    <Trash className="w-5 h-5" />
                </button>
            </div>

            {/* The Drawing Canvas */}
            <canvas
                ref={canvasRef}
                className="block touch-none cursor-crosshair"
            />
        </div>
    );
}