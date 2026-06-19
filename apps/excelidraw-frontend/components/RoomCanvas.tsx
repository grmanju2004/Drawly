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

                const response = await axios.get(`http://localhost:3001/room/${slug}`, {
                    headers: { Authorization: token }
                });
                
                const realDatabaseId = response.data.room.id.toString(); 
                setRealRoomId(realDatabaseId);
               
                const ws = new WebSocket(`${WS_URL}?token=${token}`);

                ws.onopen = () => {
                    setSocket(ws);
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

    if (!socket || !realRoomId) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#FDFCF8]">
                <p className="text-xl font-serif text-zinc-900 animate-pulse">Connecting to workspace...</p>
            </div>
        );
    }

    return (
        <div>
            <Canvas roomId={realRoomId} socket={socket} />
        </div>
    );
}