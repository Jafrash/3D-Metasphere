import express from "express";
import cors from "cors"
import router from "./routes/v1/index";
import client  from '@repo/db/client'

const app = express();


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use("/api/v1", router);

// Test endpoint to verify server is running
app.get("/api/v1/test", (req, res) => {
    res.json({ message: "Server is running", timestamp: new Date().toISOString() });
});

// Add debug logging for all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
const port = process.env.PORT || 3000;
console.log(`Starting server on port ${port}`);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
