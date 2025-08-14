import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const getAll = async (req, res, next) => {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json(users);
  } catch (e) { next(e); }
};

export const getById = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).select("-passwordHash");
    if (!u) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(u);
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nombres, apellidos, email, password, rol } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email ya registrado" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ nombres, apellidos, email, passwordHash, rol });
    res.status(201).json({
      id: user._id, nombres: user.nombres, apellidos: user.apellidos, email: user.email, rol: user.rol
    });
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nombres, apellidos, rol } = req.body;
    const u = await User.findByIdAndUpdate(
      req.params.id, { nombres, apellidos, rol }, { new: true }
    ).select("-passwordHash");
    if (!u) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(u);
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    const u = await User.findByIdAndDelete(req.params.id);
    if (!u) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado" });
  } catch (e) { next(e); }
};
