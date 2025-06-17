import express from "express";
import cors from "cors"
import { router } from "./routes/v1"
import client  from '@repo/db/client'

const app = express();
app.use(cors({ origin: "http://localhost:5174" }));
app.use(express.json())
app.use("/api/v1",router)
app.listen(process.env.PORT || 3000)
