import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
    try {
        const token = localStorage.getItem("token");
        
        if (!token) {
            console.error("No token found, skipping history fetch.");
            return [];
        }

        const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`, {
            headers: {
                Authorization: token
            }
        });
        
        const messages = res.data.messages;

        if (!messages) return [];

        const shapes = messages.map((x: { message: string }) => {
            try {
                const messageData = JSON.parse(x.message);
                return messageData.shape;
            } catch (e) {
                return null;
            }
        }).filter((shape: any) => shape !== null);

        return shapes;
    } catch (e) {
        console.error("No existing chats found or invalid room ID. Starting fresh.");
        return []; 
    }
}