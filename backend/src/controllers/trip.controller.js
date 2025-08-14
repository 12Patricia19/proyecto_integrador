import { validationResult } from "express-validator";
import Trip from "../models/trip.model.js";

export const getAll = async (req, res, next) => {
  try {
    const items = await Trip.find().populate("creador", "nombres apellidos email").sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
};

export const getById = async (req, res, next) => {
  try {
    const t = await Trip.findById(req.params.id).populate("creador", "nombres apellidos email");
    if (!t) return res.status(404).json({ message: "Viaje no encontrado" });
    res.json(t);
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const trip = await Trip.create(req.body);
    res.status(201).json(trip);
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const t = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ message: "Viaje no encontrado" });
    res.json(t);
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    const t = await Trip.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ message: "Viaje no encontrado" });
    res.json({ message: "Viaje eliminado" });
  } catch (e) { next(e); }
};
