
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { NextFunction, Request, Response } from "express";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Try to get token from Authorization header first
    const header = req.headers["authorization"];
    let token = header?.split(" ")[1] || header;  // Also allow raw token in header
    
    // If no token in header, try to get it from the request body
    if (!token && req.body && typeof req.body === 'object') {
        token = req.body.token;
    }
    console.log(req.route.path)
        console.log(token)
    
    if (!token) {
        res.status(403).json({message: "Unauthorized"})
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_PASSWORD) as { role: string, userId: string }
        req.userId = decoded.userId
        next()
    } catch(e) {
        res.status(401).json({message: "Unauthorized"})
        return
    }
}