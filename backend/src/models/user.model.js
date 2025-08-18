import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nombres: { type: String, required: true, trim: true },
    apellidos: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    rol: { type: String, enum: ["estudiante", "docente", "admin"], default: "estudiante" },
    telefono: { type: String, trim: true },
    fotoPerfil: { type: String },
    calificacion: { type: Number, default: 5, min: 1, max: 5 },
    totalViajes: { type: Number, default: 0 },
    vehiculo: {
      marca: { type: String, trim: true },
      modelo: { type: String, trim: true },
      color: { type: String, trim: true },
      placa: { type: String, trim: true, uppercase: true },
      anio: { type: Number }
    },
    esVerificado: { type: Boolean, default: false },
    fechaRegistro: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
