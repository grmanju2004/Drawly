"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export function RoomCanvas() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [realRoomId, setRealRoomId] = useState<string | null>(null);
    
    const router = useRouter();
    const params = useParams(); 
    
    // Extract the slug (or ID) from the URL, no matter what the folder is named
    const slug = (params.roomId || params.roomid || params.id)?.toString();

    useEffect(() => {
        const verifyRoomAndConnect = async () => {
            if (!slug) return;

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/signin");
                    return;
                }

                // 1. Ask the backend to translate the Slug (or text ID) into the real database ID
                const response = await axios.get(`http://localhost:3001/room/${slug}`, {
                    headers: { Authorization: token }
                });
                
                // Extract the real database ID from the response and save it to state!
                const realDatabaseId = response.data.room.id.toString(); 
                setRealRoomId(realDatabaseId);
                
                // 2. Connect to the WebSocket
                const ws = new WebSocket(`${WS_URL}?token=${token}`);

                ws.onopen = () => {
                    setSocket(ws);
                    // 3. Send the REAL ID to the WebSocket server, not the text slug
                    ws.send(JSON.stringify({
                        type: "join_room",
                        roomId: realDatabaseId 
                    }));
                };
            } catch (err: any) {
                console.error("Bouncer Error:", err.message);
                
                if (err.response?.status === 401 || err.response?.status === 403) {
                    setError("Session expired. Please sign in again.");
                    setTimeout(() => router.push("/signin"), 2000);
                } else {
                    setError(`Could not find a room matching "${slug}". Redirecting...`);
                    setTimeout(() => router.push("/dashboard"), 2000);
                }
            }
        };

        verifyRoomAndConnect();
    }, [slug, router]);
   
    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#FDFCF8]">
                <p className="text-xl font-serif text-red-600">{error}</p>
            </div>
        );
    }

    // We need BOTH the WebSocket and the Real Database ID before we render the canvas
    if (!socket || !realRoomId) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#FDFCF8]">
                <p className="text-xl font-serif text-zinc-900 animate-pulse">Connecting to workspace...</p>
            </div>
        );
    }

    return (
        <div>
            {/* We pass the true database number ID to the canvas so it can fetch the history! */}
            <Canvas roomId={realRoomId} socket={socket} />
        </div>
    );
}