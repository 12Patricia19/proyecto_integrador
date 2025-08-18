import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

// Login de usuario
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar token JWT (puedes cambiar la clave secreta y expiración según tu config)
    const token = jwt.sign(
      { id: user._id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    console.log('Login successful for user:', email);
    res.json({
      token,
      user: {
        id: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (e) { 
    console.error('Login error:', e);
    next(e); 
  }
};

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

    const { 
      nombre, apellido, nombres, apellidos, 
      email, password, telefono, vehiculo, rol 
    } = req.body;
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email ya registrado" });

    const passwordHash = await bcrypt.hash(password, 10);
    
    // Usar nombres/apellidos del frontend o del backend (compatibilidad)
    const userData = {
      nombres: nombres || nombre,
      apellidos: apellidos || apellido,
      email,
      passwordHash,
      rol: rol || "estudiante",
      ...(telefono && { telefono }),
      ...(vehiculo && Object.keys(vehiculo).length > 0 && { vehiculo })
    };

    const user = await User.create(userData);
    
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol
      }
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
