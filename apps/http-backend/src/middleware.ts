import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        if (decoded && decoded.userId) {
            // @ts-ignore: Extending Express Request type globally is better, but this works
            req.userId = decoded.userId;
            next();
        } else {
            res.status(403).json({ error: "Invalid token structure" });
        }
    } catch (e) {
        // This catches malformed, empty, or expired tokens without crashing the server
        res.status(401).json({ error: "Unauthorized / Invalid token" });
    }
}