import { Router } from "express";
import { body, param } from "express-validator";
import * as ctrl from "../controllers/user.controller.js";

const router = Router();

router.get("/", ctrl.getAll);

router.get("/:id", [param("id").isMongoId()], ctrl.getById);

router.post(
  "/",
  [
    body("nombres").trim().notEmpty(),
    body("apellidos").trim().notEmpty(),
    body("email").isEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
    body("rol").optional().isIn(["estudiante", "docente", "admin"])
  ],
  ctrl.create
);

router.put(
  "/:id",
  [
    param("id").isMongoId(),
    body("nombres").optional().trim().notEmpty(),
    body("apellidos").optional().trim().notEmpty(),
    body("rol").optional().isIn(["estudiante", "docente", "admin"])
  ],
  ctrl.update
);

router.delete("/:id", [param("id").isMongoId()], ctrl.remove);

export default router;
