import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        if (decoded && decoded.userId) {
            // @ts-ignore
            req.userId = decoded.userId;
            next();
        } else {
            res.status(403).json({ error: "Invalid token structure" });
        }
    } catch (e) {
        res.status(401).json({ error: "Unauthorized / Invalid token" });
    }
}