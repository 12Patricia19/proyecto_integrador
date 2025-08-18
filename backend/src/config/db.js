import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Falta MONGODB_URI o MONGO_URI");
  await mongoose.connect(uri);
  console.log("✅ MongoDB conectado");
}
