import { Router } from "express";
import { body, param } from "express-validator";
import * as ctrl from "../controllers/trip.controller.js";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:id", [param("id").isMongoId()], ctrl.getById);

router.post(
  "/",
  [
    body("origen").trim().notEmpty(),
    body("destino").trim().notEmpty(),
    body("fechaHoraSalida").isISO8601().toDate().withMessage("Fecha/hora inválida"),
    body("cupos").isInt({ min: 0 }),
    body("creador").isMongoId(),
    body("estado").optional().isIn(["disponible", "lleno", "cancelado"])
  ],
  ctrl.create
);

router.put(
  "/:id",
  [
    param("id").isMongoId(),
    body("origen").optional().trim().notEmpty(),
    body("destino").optional().trim().notEmpty(),
    body("fechaHoraSalida").optional().isISO8601().toDate(),
    body("cupos").optional().isInt({ min: 0 }),
    body("creador").optional().isMongoId(),
    body("estado").optional().isIn(["disponible", "lleno", "cancelado"])
  ],
  ctrl.update
);

router.delete("/:id", [param("id").isMongoId()], ctrl.remove);

export default router;
