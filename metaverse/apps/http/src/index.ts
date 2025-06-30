import express from "express";
import cors from "cors"
import router from "./routes/v1/index";
import client  from '@repo/db/client'

const app = express();


const allowedOrigins = [
  'http://localhost:5173',  // Client frontend
  'http://localhost:5174'   // Admin frontend (assuming this is the port for admin)
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      console.warn(`CORS blocked for origin: ${origin}`);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
