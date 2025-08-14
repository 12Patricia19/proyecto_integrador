import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    origen: { type: String, required: true, trim: true },
    destino: { type: String, required: true, trim: true },
    fechaHoraSalida: { type: Date, required: true },
    cupos: { type: Number, required: true, min: 0 },
    creador: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    estado: { type: String, enum: ["disponible", "lleno", "cancelado"], default: "disponible" }
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
