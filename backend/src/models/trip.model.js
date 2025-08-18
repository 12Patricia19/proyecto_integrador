import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    origen: { 
      direccion: { type: String, required: true, trim: true },
      latitud: { type: Number },
      longitud: { type: Number }
    },
    destino: { 
      direccion: { type: String, required: true, trim: true },
      latitud: { type: Number },
      longitud: { type: Number }
    },
    fechaHoraSalida: { type: Date, required: true },
    cupos: { type: Number, required: true, min: 0 },
    cuposOcupados: { type: Number, default: 0 },
    costo: { type: Number, required: true, min: 0 },
    creador: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pasajeros: [{ 
      usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      estado: { type: String, enum: ["pendiente", "aceptado", "rechazado"], default: "pendiente" },
      fechaSolicitud: { type: Date, default: Date.now }
    }],
    estado: { type: String, enum: ["disponible", "lleno", "cancelado", "finalizado"], default: "disponible" },
    descripcion: { type: String, trim: true },
    ruta: [{
      latitud: { type: Number },
      longitud: { type: Number },
      orden: { type: Number }
    }],
    tiempoEstimado: { type: Number }, // en minutos
    distancia: { type: Number }, // en kilómetros
    politicasViaje: {
      permiteFumar: { type: Boolean, default: false },
      permiteMascotas: { type: Boolean, default: false },
      equipaje: { type: String, enum: ["pequeño", "mediano", "grande"], default: "pequeño" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
