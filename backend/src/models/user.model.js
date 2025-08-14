import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nombres: { type: String, required: true, trim: true },
    apellidos: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    rol: { type: String, enum: ["estudiante", "docente", "admin"], default: "estudiante" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
