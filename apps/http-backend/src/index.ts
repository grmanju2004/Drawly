import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: path.resolve(__dirname, "../../../packages/db/.env") })
import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const ParsedData = CreateUserSchema.safeParse(req.body);
    if(!ParsedData.success) {
        res.json({ 
            error: "Invalid data"
     })
     return ;
    }
    try {
        const user =  await prismaClient.user.create({
       data: {
        email: ParsedData.data.username,
        password: ParsedData.data.password,
        name: ParsedData.data.name
       }
    })
    res.json({
        userId: user.id
    })
    } catch(e) {
        console.log(e);
        res.status(409).json({
            error: "User already exists"
        })
    }
    
});

app.post("/signin",async (req, res) => {
    const ParsedData = SigninSchema.safeParse(req.body);
    if(!ParsedData.success) {
        res.json({ 
            error: "Invalid data"
        });
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: ParsedData.data.username,
            password: ParsedData.data.password
        }
    });

    if(!user) {
        res.status(403).json({
            error: "Invalid credentials"
        });
        return;
    }

    const token = jwt.sign({ 
        userId: user?.id
    }, JWT_SECRET);
    res.json({ token });
});

app.post("/room", middleware, async (req, res) => {
    const ParsedData = CreateRoomSchema.safeParse(req.body);
    if(!ParsedData.success) {
        res.json({
            error: "Invalid data"
        });
        return;
    }
    // @ts-ignore

    const userId = req.userId;

    try {
        const room = await prismaClient.room.create({
        data: {
            slug: ParsedData.data.name,
            adminId: userId
        }
    });
    res.json({ 
        roomId: room.id
    });

    } catch(e) {
        res.status(409).json({
            error: "Room already exists"
        });
    }

});

app.get("/chats/:roomId", async (req, res) => {

    try {
        const roomId = Number(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50,
    });
    res.json({ messages });

    } catch(e) {
        res.status(400).json({
            error: "Invalid room id"
        });
    }
    
});


app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findUnique({
        where: {
            slug: slug
        }
    });
    res.json({ room });
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
