import mongoose from "mongoose";

const tripRequestSchema = new mongoose.Schema(
  {
    viaje: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    solicitante: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    conductor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    estado: { 
      type: String, 
      enum: ["pendiente", "aceptado", "rechazado", "cancelado"], 
      default: "pendiente" 
    },
    mensaje: { type: String, trim: true },
    fechaRespuesta: { type: Date },
    motivoRechazo: { type: String, trim: true }
  },
  { timestamps: true }
);

// Índice compuesto para evitar solicitudes duplicadas
tripRequestSchema.index({ viaje: 1, solicitante: 1 }, { unique: true });

export default mongoose.model("TripRequest", tripRequestSchema);
