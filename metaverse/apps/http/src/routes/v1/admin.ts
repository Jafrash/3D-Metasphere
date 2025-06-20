import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin";
import { AddElementSchema, CreateAvatarSchema, CreateElementSchema, CreateMapSchema, GetMapviaIdSchema, UpdateElementSchema, UpdateMapSchema } from "../../types";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";
export const adminRouter = Router();
adminRouter.use(adminMiddleware)

adminRouter.post("/element", async (req, res) => {
    const parsedData = CreateElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }

    let imageUrl = parsedData.data.imageUrl;
    if (parsedData.data.base64Image) {
        // Store the base64 image in a suitable storage (e.g., database or file system)
        // For now, we'll just use the base64 string as the imageUrl
        imageUrl = parsedData.data.base64Image;
    }

    const element = await client.element.create({
        data: {
            width: parsedData.data.width,
            height: parsedData.data.height,
            static: parsedData.data.static,
            imageUrl: imageUrl,
        }
    })

    res.json({
        id: element.id
    })
})

adminRouter.put("/element/:elementId", (req, res) => {
    const parsedData = UpdateElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    client.element.update({
        where: {
            id: req.params.elementId
        },
        data: {
            imageUrl: parsedData.data.imageUrl
        }
    })
    res.json({message: "Element updated"})
})

adminRouter.post("/avatar", async (req, res) => {
    const parsedData = CreateAvatarSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }

    const avatar = await client.avatar.create({
        data: {
            name: parsedData.data.name,
            imageUrl: parsedData.data.base64Image || parsedData.data.imageUrl
        }
    })
    res.json({avatarId: avatar.id})
})

adminRouter.post("/map", async (req, res) => {
    const parsedData = CreateMapSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }

    let thumbnailUrl = parsedData.data.thumbnail;
    if (parsedData.data.base64Thumbnail) {
        // Store the base64 thumbnail in a suitable storage (e.g., database or file system)
        // For now, we'll just use the base64 string as the thumbnail
        thumbnailUrl = parsedData.data.base64Thumbnail;
    }

    const map = await client.map.create({
        data: {
            name: parsedData.data.name,
            width: parseInt(parsedData.data.dimensions.split("x")[0]),
            height: parseInt(parsedData.data.dimensions.split("x")[1]),
            thumbnail: thumbnailUrl,
            mapElements: {
                create: parsedData.data.defaultElements.map(e => ({
                    elementId: e.elementId,
                    x: e.x,
                    y: e.y
                }))
            }
        }
    })

    res.json({
        id: map.id
    })
})

adminRouter.put(`/map/:id`, adminMiddleware, async (req, res) => {
    const parseData = GetMapviaIdSchema.safeParse(req.params);
    if (!parseData.success) {
        res.status(400).json({ msg: "Invalid Data send" });
        return;
    }

    const data = req.body;
    const parseBody = UpdateMapSchema.safeParse(data);

    if (!parseBody.success) {
        res.status(400).json({ msg: "Invalid Data send" });
        return;
    }

    if((parseBody.data.defaultElements ?? []).length === 0) {
        res.status(400).json({ msg: "Invalid Data send" });
        return;
    }

    const map = await client.map.update({
        where: {
            id: parseData.data.id
        },
        data: {
            mapElements: {
                deleteMany: {},
                create: parseBody.data.defaultElements?.map((element) => {
                    return {
                        elementId: element.elementId,
                        x: element.x,
                        y: element.y
                    }
                })
            }
        }
    });

    res.json({
        id: map.id
    })
   
});


adminRouter.get(`/map`, userMiddleware, async (req, res) => {
    const maps = await client.map.findMany({
        include: {
            mapElements: {
                include: {
                    element: true
                }
            }
        }
    });

    res.json(maps);
});

adminRouter.get(`/map/:id`, userMiddleware, async (req, res) => {
    const parseData = GetMapviaIdSchema.safeParse(req.params);
    if (!parseData.success) {
        res.status(400).json({ msg: "Invalid Data send" });
        return;
    }

    const map = await client.map.findUnique({
        where: {
            id: parseData.data.id
        },
        include: {
            mapElements: {
                include: {
                    element: true
                }
            }
        }
    });

    if (!map) {
        res.status(404).json({ msg: "Map not found" });
        return;
    }

    res.json(map);
});
