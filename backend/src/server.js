import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http"

import { connectDB } from "./lib/db.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { protectRoute } from "./middleware/auth.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import previewRoutes from "./routes/preview.routes.js";
import wardrobeRoutes from "./routes/wardrobe.routes.js";
import suggestionRoutes from "./routes/suggestion.routes.js";
import axios from "axios";



const app = express()
const server = http.createServer(app)




dotenv.config();

const PORT = process.env.PORT;
const AI_HELPER_API_KEY = process.env.EMBEDDINGS_WORKER_LINK;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());


app.get("/api/ai/health", async (req, res, next) => {
  try {
    const response = await axios.get(AI_HELPER_API_KEY + "/health");
    res.status(200).json({ message: "AI Helper is healthy", data: response.data });
  } catch (error) {
    next(error);
  }
})

app.use("/api/auth", authRoutes);
app.use("/api/preview", protectRoute, previewRoutes);
app.use("/api/wardrobe", protectRoute, wardrobeRoutes);
app.use("/api/suggestions", protectRoute, suggestionRoutes);


app.use(errorHandler)


server.listen(PORT, "0.0.0.0", () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});