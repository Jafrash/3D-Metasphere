import z from "zod";

export const SignupSchema = z.object({
    username: z.string(),
    password: z.string(),
    type: z.enum(["user", "admin"]),
})

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string(),
})

export const UpdateMetadataSchema = z.object({
    avatarId: z.string()
})

export const CreateSpaceSchema = z.object({
    name: z.string(),
    dimensions: z.string().transform((val) => {
        if (val.includes('x')) {
            const [width, height] = val.split('x').map(Number);
            if (isNaN(width) || isNaN(height)) throw new Error('Invalid dimensions format');
            return val;
        }
        const num = Number(val);
        if (isNaN(num)) throw new Error('Invalid dimensions format');
        return `${num}x${num}`;
    }),
    mapId: z.string().optional(),
})

export const DeleteSpaceSchema = z.object({
    spaceId: z.string()
});

export const GetSpaceSchema = z.object({
    spaceId: z.string()
})


export const ReturnSpaceSchema = z.object({
    dimensions: z.string().regex(/^\d+x\d+$/),
    elements: z.array(z.object({
        id: z.string(),
        element: z.object({
            id: z.string(),
            imageUrl: z.string(),
            static: z.boolean(),
            height: z.number(),
            width: z.number()
        }),
        x: z.number(),
        y: z.number()
    }))
})



export const DeleteElementSchema = z.object({
    id: z.string(),
})

export const AddElementSchema = z.object({
    spaceId: z.string(),
    elementId: z.string(),
    x: z.number(),
    y: z.number(),
})

export const CreateElementSchema = z.object({
    base64Image: z.string().optional(),
    imageUrl: z.string().optional(),
    width: z.number(),
    height: z.number(),
    static: z.boolean(),
}).refine((data) => {
    return (data.base64Image || data.imageUrl) && data.width > 0 && data.height > 0;
}, {
    message: "Please provide either base64Image or imageUrl, and valid dimensions"
})

export const UpdateElementSchema = z.object({
    imageUrl: z.string(),
})

export const CreateAvatarSchema = z.object({
    name: z.string(),
    base64Image: z.string().optional(),
    imageUrl: z.string().optional(),
}).refine((data) => {
    return (data.base64Image || data.imageUrl) && data.name.trim() !== '';
}, {
    message: "Please provide either base64Image or imageUrl, and a valid name"
})

export const CreateMapSchema = z.object({
    thumbnail: z.string(),
    base64Thumbnail: z.string().optional(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    name: z.string(),
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),  
        y: z.number(),
    }))
}).refine((data) => {
    return (data.base64Thumbnail || data.thumbnail) && data.name.trim() !== '' && data.dimensions;
}, {
    message: "Please provide either base64Thumbnail or thumbnail, a valid name, and dimensions"
})


export const GetMapviaIdSchema = z.object({
    id: z.string()
})

export const UpdateMapSchema = z.object({
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),
        y: z.number()
    })).optional()
})

declare global {
    namespace Express {
      export interface Request {
        role?: "Admin" | "User";
        userId?: string;
      }
    }
}