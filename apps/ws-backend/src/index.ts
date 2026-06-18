import "dotenv/config";
import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }
  
  // Safe URL splitting (avoids undefined errors)
  const queryParams = new URLSearchParams(url.split('?')[1] || "");
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  if (userId == null) {
    ws.close();
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('message', async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data); 
    }

    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      // Prevent adding the same room multiple times
      if (user && !user.rooms.includes(parsedData.roomId)) {
        user.rooms.push(parsedData.roomId);
      }
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      // Fix: Use !== to REMOVE the room. Also standardized to use roomId.
      user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      // 1. SEND TO OTHER USERS FIRST (This guarantees the drawing appears instantly!)
      users.forEach(user => {
        // Send to everyone in the room EXCEPT the person who just drew it
        if (user.rooms.includes(roomId) && user.ws !== ws) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId
          }))
        }
      })

      // 2. SAVE TO DATABASE SECOND 
     try {
        await prismaClient.chat.create({
               data: {
                  // 1. Force the roomId to be a Number!
                  roomId: Number(parsedData.roomId), 
                  message: parsedData.message,
                  userId: userId // (or however you named your user ID variable)
                }
              });
          } catch (e) {
          // 2. Print the actual error so we know exactly what Postgres is complaining about
          console.error("DB Save Error:", e); 
        }
    }
  });

  // Remember to remove users when they disconnect to avoid memory leaks
  ws.on('close', () => {
    const index = users.findIndex(x => x.ws === ws);
    if (index !== -1) {
        users.splice(index, 1);
    }
  });
});