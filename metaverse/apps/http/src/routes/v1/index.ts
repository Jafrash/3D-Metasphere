import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SigninSchema, SignupSchema } from "../../types";
import { hash, compare } from "../../scrypt";
import client from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../config";

export const router = Router();

router.post("/signup", async (req, res) => {
    console.log("inside signup");

    // Validate the input data
    const parsedData = SignupSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("parsed data incorrect");
        res.status(400).json({ message: "Validation failed" });
        return;
    }
    const hashedPassword = await hash(parsedData.data.password);
    

    try{
          const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type === "admin" ? "Admin" : "User",
            },
        })
        res.json({
            userId:user.id
        })
    }catch(e){
        console.log("error thrown")
        console.log(e)
        res.status(400).json({message:"User already exists"})
    }
})
    

   
   

router.post("/signin", async (req, res) => {
    

    // Validate the input data
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("parsed data incorrect");
        res.status(403).json({ message: "Validation failed" });
        return;
    }

    try {
        // Find the user by username
        const user = await client.user.findUnique({
            where: {
                username: parsedData.data.username,
            },
        });

        if (!user) {
            res.status(403).json({ message: "User not found" });
            return;
        }

        // Check if the provided password matches the stored hash
        const isValid = await compare(parsedData.data.password, user.password);

        if (!isValid) {
            res.status(403).json({ message: "Invalid password" });
            return;
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            JWT_PASSWORD
        );

        // Send the token in response
        res.json({
            token,
        });
    } catch (e) {
        console.log("error thrown");
        res.status(400).json({ message: "Internal server error" });
    }
});

router.get("/elements", async (req, res) => {
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
});

router.get("/avatars", async (req, res) => {
    const avatars = await client.avatar.findMany();
    res.json({
        avatars: avatars.map((x) => ({
            id: x.id,
            imageUrl: x.imageUrl,
            name: x.name,
        })),
    });
});

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
