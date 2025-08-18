import "dotenv/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import apiRoutes from "./routes/index.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Configuración de CORS más explícita
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(",") || [
    "http://localhost:5173", 
    "http://localhost:3000", 
    "http://127.0.0.1:5173"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", apiRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() =>
  app.listen(PORT, () => console.log(`🚀 API corriendo en http://localhost:${PORT}`))
);
