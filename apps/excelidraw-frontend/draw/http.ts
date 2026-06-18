import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
    try {
        const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
        return res.data.messages.map((x: { message: string }) => {
            const messageData = JSON.parse(x.message);
            return messageData.shape;
        });
    } catch (err: any) {
        console.log("STATUS:", err?.response?.status);
        console.log("DATA:", err?.response?.data);
        throw err;
    }
}