import { Router } from "express";
import userRoutes from "./user.routes.js";
import tripRoutes from "./trip.routes.js";

const router = Router();
router.get("/health", (req, res) => res.json({ ok: true, service: "API PUCE Move" }));
router.use("/usuarios", userRoutes);
router.use("/viajes", tripRoutes);
export default router;
