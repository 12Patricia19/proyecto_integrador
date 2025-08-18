import { Router } from "express";
import { body, param } from "express-validator";
import * as ctrl from "../controllers/trip.controller.js";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:id", [param("id").isMongoId()], ctrl.getById);

// Rutas para gestión de viajes
router.post(
  "/",
  [
    body("origen.direccion").trim().notEmpty().withMessage("Origen es requerido"),
    body("destino.direccion").trim().notEmpty().withMessage("Destino es requerido"),
    body("fechaHoraSalida").isISO8601().toDate().withMessage("Fecha/hora inválida"),
    body("cupos").isInt({ min: 1, max: 8 }).withMessage("Cupos debe ser entre 1 y 8"),
    body("costo").isFloat({ min: 0 }).withMessage("Costo debe ser mayor o igual a 0"),
    body("creador").optional().isMongoId(),
    body("descripcion").optional().trim(),
    body("tiempoEstimado").optional().isInt({ min: 1 }),
    body("distancia").optional().isFloat({ min: 0.1 })
  ],
  ctrl.create
);

router.put(
  "/:id",
  [
    param("id").isMongoId(),
    body("origen.direccion").optional().trim().notEmpty(),
    body("destino.direccion").optional().trim().notEmpty(),
    body("fechaHoraSalida").optional().isISO8601().toDate(),
    body("cupos").optional().isInt({ min: 1, max: 8 }),
    body("costo").optional().isFloat({ min: 0 }),
    body("estado").optional().isIn(["disponible", "lleno", "cancelado", "finalizado"]),
    body("descripcion").optional().trim(),
    body("tiempoEstimado").optional().isInt({ min: 1 }),
    body("distancia").optional().isFloat({ min: 0.1 })
  ],
  ctrl.update
);

router.delete("/:id", [param("id").isMongoId()], ctrl.remove);

// Rutas para solicitudes de viaje
router.post(
  "/:tripId/request",
  [
    param("tripId").isMongoId(),
    body("mensaje").optional().trim(),
    body("solicitante").optional().isMongoId()
  ],
  ctrl.requestJoin
);

router.put(
  "/requests/:requestId/respond",
  [
    param("requestId").isMongoId(),
    body("estado").isIn(["aceptado", "rechazado"]),
    body("motivoRechazo").optional().trim()
  ],
  ctrl.respondToRequest
);

// Rutas para obtener información del usuario
router.get("/user/:userId/trips", [param("userId").optional().isMongoId()], ctrl.getUserTrips);
router.get("/user/:userId/requests", [param("userId").optional().isMongoId()], ctrl.getUserRequests);
router.get("/driver/:conductorId/requests", [param("conductorId").optional().isMongoId()], ctrl.getDriverRequests);

export default router;
