import { Router, Request, Response } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SigninSchema, SignupSchema } from "../../types/index";
import bcrypt from "bcryptjs"

import client from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../config";

const router = Router(); // Changed from 'export const' to 'const'

// Test route to verify router is working
router.get('/test', (req, res) => {
    res.json({ message: 'API router is working' });
});

// Auth routes
router.post("/signup", async (req: Request, res: Response) => {
    console.log("Received signup request:", req.body);
    
    const data = req.body;
    const parseData = SignupSchema.safeParse(data);
    
    if (!parseData.success) {
        console.log("Signup validation failed:", parseData.error);
        res.status(400).json({ message: "Validation failed", errors: parseData.error.errors });
        return;
    }
    
    try {
        const hashedPassword = await bcrypt.hash(parseData.data.password, 10);
        const newUser = await client.user.create({
            data: {
                username: parseData.data.username,
                password: hashedPassword,
                role: parseData.data.type == "user" ? "User" : "Admin"
            }
        });
        
        // Create token for immediate login after signup
        const token = jwt.sign({
            userId: newUser.id,
            role: newUser.role
        }, JWT_PASSWORD);
        
        console.log("User created successfully:", newUser.id);
        res.status(200).json({
            userId: newUser.id,
            token: token,
            message: "Signup successful"
        });
    } catch (e) {
        console.error("Signup error:", e);
        
        // Handle unique constraint violation (username already exists)
        if (e && typeof e === 'object' && 'code' in e && e.code === 'P2002') {
            res.status(400).json({
                message: "Username already exists"
            });
        } else {
            res.status(400).json({
                message: "Error creating account"
            });
        }
    }
});

router.post("/signin", async (req: Request, res: Response) => {
    console.log("Received signin request:", req.body);
   
    const parsedData = SigninSchema.safeParse(req.body);
    console.log("Parsed data result:", parsedData.success);
   
    if (!parsedData.success) {
        console.log("Signin validation failed:", parsedData.error);
        res.status(400).json({ 
            message: "Validation failed", 
            errors: parsedData.error.errors 
        });
        return;
    }
    
    try {
        console.log("Looking for user with username:", parsedData.data.username);
        const user = await client.user.findUnique({
            where: {
                username: parsedData.data.username
            }
        });
       
        if (!user) {
            console.log("User not found for username:", parsedData.data.username);
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
       
        console.log("Found user:", user.id);
        const isValid = await bcrypt.compare(parsedData.data.password, user.password);
        console.log("Password validation result:", isValid);
        
        if (!isValid) {
            console.log("Invalid password for user:", user.id);
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        
        const token = jwt.sign({
            userId: user.id,
            role: user.role
        }, JWT_PASSWORD);
        
        console.log("Successfully created token for user:", user.id);
        res.json({
            token,
            message: "Signin successful"
        });
    } catch(e) {
        console.error("Signin error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/elements", async (req: Request, res: Response) => {
    try {
        const elements = await client.element.findMany();
        res.json({
            elements: elements.map((e) => ({
                id: e.id,
                imageUrl: e.imageUrl,
                width: e.width,
                height: e.height,
                static: e.static,
            })),
        });
    } catch (error) {
        console.error("Elements error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/avatars", async (req: Request, res: Response) => {
    try {
        const avatars = await client.avatar.findMany();
        res.json({
            avatars: avatars.map((x) => ({
                id: x.id,
                imageUrl: x.imageUrl,
                name: x.name,
            })),
        });
    } catch (error) {
        console.error("Avatars error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);

export default router;
