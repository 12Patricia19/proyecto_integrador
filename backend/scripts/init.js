import mongoose from "mongoose";
import "dotenv/config.js";

const initDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/puce_move");
    console.log("🔗 Conectado a MongoDB");

    // Crear índices personalizados
    const db = mongoose.connection.db;
    
    // Índices para usuarios
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ "vehiculo.placa": 1 }, { sparse: true });
    await db.collection('users').createIndex({ rol: 1 });
    
    // Índices para viajes
    await db.collection('trips').createIndex({ "origen.direccion": "text", "destino.direccion": "text" });
    await db.collection('trips').createIndex({ fechaHoraSalida: 1 });
    await db.collection('trips').createIndex({ estado: 1 });
    await db.collection('trips').createIndex({ creador: 1 });
    await db.collection('trips').createIndex({ 
      "origen.latitud": 1, 
      "origen.longitud": 1,
      "destino.latitud": 1,
      "destino.longitud": 1
    });
    
    // Índices para solicitudes de viaje
    await db.collection('triprequests').createIndex({ viaje: 1, solicitante: 1 }, { unique: true });
    await db.collection('triprequests').createIndex({ conductor: 1 });
    await db.collection('triprequests').createIndex({ estado: 1 });
    
    console.log("📊 Índices creados exitosamente");
    
    // Mostrar estadísticas de la base de datos
    const stats = await db.stats();
    console.log("📈 Estadísticas de la base de datos:");
    console.log(`   - Nombre: ${stats.db}`);
    console.log(`   - Colecciones: ${stats.collections}`);
    console.log(`   - Tamaño: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
  }
};

// Ejecutar si se llama directamente
if (process.argv[1].endsWith('init.js')) {
  initDatabase();
}

export default initDatabase;
