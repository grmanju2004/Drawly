"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Pencil, Plus, ArrowRight, Layers } from "lucide-react";

const BACKEND_URL = "http://localhost:3001";

export default function Dashboard() {
    const [roomName, setRoomName] = useState("");
    const [joinRoomId, setJoinRoomId] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();

    // Kick unauthenticated users back to login
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signin");
        }
    }, [router]);

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            
            // Format the text into a safe, unique URL slug!
            // Example: "My Cool Canvas" -> "my-cool-canvas-8492"
            const safeSlug = roomName
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-') 
                + '-' + Math.floor(Math.random() * 10000);

            await axios.post(
                `${BACKEND_URL}/room`,
                { name: safeSlug }, // Send the safe, unique slug to the backend
                {
                    headers: {
                        Authorization: token, 
                    },
                }
            );

            // Navigate directly to the slug URL
            router.push(`/canvas/${safeSlug}`);
        } catch (err: any) {
            console.error("Room Creation Error:", err);
            setError(err.response?.data?.error || "Failed to create room.");
            setIsLoading(false);
        }
    };

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (joinRoomId.trim()) {
            // Just push whatever they typed (ID or Slug) to the URL.
            // The RoomCanvas bouncer will automatically figure out what to do!
            router.push(`/canvas/${joinRoomId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF8] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
            
            {/* Minimal Navbar */}
            <nav className="border-b border-zinc-200/60 bg-[#FDFCF8]/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-5xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center shadow-sm">
                            <Pencil className="w-4 h-4 text-[#FDFCF8]" />
                        </div>
                        <span className="font-serif text-2xl font-semibold tracking-tight">Drawly.</span>
                    </div>
                    <button 
                        onClick={() => {
                            localStorage.removeItem("token");
                            router.push("/signin");
                        }}
                        className="text-sm font-medium tracking-wide text-zinc-500 hover:text-zinc-900 transition-colors uppercase"
                    >
                        Sign out
                    </button>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-16 pb-24 max-w-5xl">
                <header className="mb-12">
                    <h1 className="font-serif text-5xl font-medium tracking-tight text-zinc-900 mb-4">
                        Your Workspace
                    </h1>
                    <p className="text-lg text-zinc-500 font-light max-w-xl">
                        Create a new blank canvas or join an existing session to start collaborating with your team.
                    </p>
                </header>

                {error && (
                    <div className="mb-8 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Create Room Card */}
                    <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl shadow-zinc-200/20 group">
                        <div className="w-12 h-12 bg-zinc-100 text-zinc-900 flex items-center justify-center rounded-xl mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                            <Plus className="w-6 h-6" />
                        </div>
                        <h2 className="font-serif text-3xl font-medium mb-2">New Canvas</h2>
                        <p className="text-zinc-500 mb-8 font-light">Generate a fresh workspace and invite others to draw.</p>
                        
                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    required
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    placeholder="e.g. Brainstorming Session"
                                    className="w-full rounded-xl border-0 py-4 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 text-sm transition-all outline-none bg-[#FDFCF8]"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-4 text-sm font-medium text-[#FDFCF8] hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-70"
                            >
                                {isLoading ? "Creating..." : "Create Room"}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Join Room Card */}
                    <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl shadow-zinc-200/20 group">
                        <div className="w-12 h-12 bg-zinc-100 text-zinc-900 flex items-center justify-center rounded-xl mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                            <Layers className="w-6 h-6" />
                        </div>
                        <h2 className="font-serif text-3xl font-medium mb-2">Join Canvas</h2>
                        <p className="text-zinc-500 mb-8 font-light">Enter an existing Room Slug to jump into an active session.</p>
                        
                        <form onSubmit={handleJoinRoom} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    required
                                    value={joinRoomId}
                                    onChange={(e) => setJoinRoomId(e.target.value)}
                                    placeholder="Enter Room Slug (e.g. my-cool-canvas)"
                                    className="w-full rounded-xl border-0 py-4 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 text-sm transition-all outline-none bg-[#FDFCF8]"
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white border-2 border-zinc-200 px-4 py-4 text-sm font-medium text-zinc-900 hover:border-zinc-900 hover:bg-zinc-50 transition-all active:scale-[0.98]"
                            >
                                Join Room
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                </div>
            </main>
        </div>
    );
}