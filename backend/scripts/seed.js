import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config.js";

// Importar modelos
import User from "../src/models/user.model.js";
import Trip from "../src/models/trip.model.js";
import TripRequest from "../src/models/tripRequest.model.js";

const seedDatabase = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/puce_move");
    console.log("🔗 Conectado a MongoDB");

    // Limpiar la base de datos
    await User.deleteMany({});
    await Trip.deleteMany({});
    await TripRequest.deleteMany({});
    console.log("🧹 Base de datos limpiada");

    // Crear usuarios de ejemplo
    const hashedPassword = await bcrypt.hash("123456", 10);
    
    const users = await User.insertMany([
      {
        nombres: "María",
        apellidos: "González López",
        email: "maria.gonzalez@puce.edu.ec",
        passwordHash: hashedPassword,
        rol: "estudiante",
        telefono: "0998765432",
        calificacion: 4.8,
        totalViajes: 15,
        vehiculo: {
          marca: "Toyota",
          modelo: "Corolla",
          color: "Azul",
          placa: "PBB-1234",
          anio: 2020
        },
        esVerificado: true
      },
      {
        nombres: "Carlos",
        apellidos: "Ramírez Silva",
        email: "carlos.ramirez@puce.edu.ec",
        passwordHash: hashedPassword,
        rol: "docente",
        telefono: "0987654321",
        calificacion: 4.9,
        totalViajes: 25,
        vehiculo: {
          marca: "Chevrolet",
          modelo: "Sail",
          color: "Blanco",
          placa: "PCU-5678",
          anio: 2019
        },
        esVerificado: true
      },
      {
        nombres: "Ana",
        apellidos: "Morales Castro",
        email: "ana.morales@puce.edu.ec",
        passwordHash: hashedPassword,
        rol: "estudiante",
        telefono: "0976543210",
        calificacion: 4.7,
        totalViajes: 8,
        esVerificado: true
      },
      {
        nombres: "Luis",
        apellidos: "Vega Ortiz",
        email: "luis.vega@puce.edu.ec",
        passwordHash: hashedPassword,
        rol: "estudiante",
        telefono: "0965432109",
        calificacion: 4.6,
        totalViajes: 12,
        vehiculo: {
          marca: "Nissan",
          modelo: "Sentra",
          color: "Gris",
          placa: "PQU-9012",
          anio: 2021
        },
        esVerificado: true
      },
      {
        nombres: "Admin",
        apellidos: "Sistema",
        email: "admin@puce.edu.ec",
        passwordHash: hashedPassword,
        rol: "admin",
        telefono: "0999999999",
        esVerificado: true
      }
    ]);

    console.log(`👥 ${users.length} usuarios creados`);

    // Crear viajes de ejemplo
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const trips = await Trip.insertMany([
      {
        origen: {
          direccion: "Terminal Terrestre Quitumbe",
          latitud: -0.2969,
          longitud: -78.5501
        },
        destino: {
          direccion: "PUCE Quito - Campus Principal",
          latitud: -0.2108,
          longitud: -78.4924
        },
        fechaHoraSalida: tomorrow,
        cupos: 3,
        cuposOcupados: 1,
        costo: 2.50,
        creador: users[0]._id,
        descripcion: "Viaje diario desde Quitumbe a la PUCE. Salida puntual.",
        tiempoEstimado: 45,
        distancia: 25,
        politicasViaje: {
          permiteFumar: false,
          permiteMascotas: false,
          equipaje: "pequeño"
        }
      },
      {
        origen: {
          direccion: "Estación Norte del Ecovía",
          latitud: -0.1807,
          longitud: -78.4678
        },
        destino: {
          direccion: "PUCE Quito - Campus Principal",
          latitud: -0.2108,
          longitud: -78.4924
        },
        fechaHoraSalida: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // 2 horas después
        cupos: 2,
        cuposOcupados: 0,
        costo: 1.50,
        creador: users[1]._id,
        descripcion: "Ruta desde el norte de la ciudad. Ideal para estudiantes del norte.",
        tiempoEstimado: 25,
        distancia: 15,
        politicasViaje: {
          permiteFumar: false,
          permiteMascotas: true,
          equipaje: "mediano"
        }
      },
      {
        origen: {
          direccion: "Valle de los Chillos - Sangolquí",
          latitud: -0.3312,
          longitud: -78.4486
        },
        destino: {
          direccion: "PUCE Quito - Campus Principal",
          latitud: -0.2108,
          longitud: -78.4924
        },
        fechaHoraSalida: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000), // 3 horas después
        cupos: 4,
        cuposOcupados: 2,
        costo: 3.00,
        creador: users[3]._id,
        descripcion: "Viaje desde el Valle de los Chillos. Paso por varias paradas.",
        tiempoEstimado: 50,
        distancia: 30,
        politicasViaje: {
          permiteFumar: false,
          permiteMascotas: false,
          equipaje: "grande"
        }
      }
    ]);

    console.log(`🚗 ${trips.length} viajes creados`);

    // Crear algunas solicitudes de viaje
    const requests = await TripRequest.insertMany([
      {
        viaje: trips[0]._id,
        solicitante: users[2]._id,
        conductor: users[0]._id,
        estado: "aceptado",
        mensaje: "Hola, necesito llegar a la universidad. ¿Podrías llevarme?",
        fechaRespuesta: new Date()
      },
      {
        viaje: trips[1]._id,
        solicitante: users[3]._id,
        conductor: users[1]._id,
        estado: "pendiente",
        mensaje: "¿Hay espacio disponible para mañana?"
      },
      {
        viaje: trips[0]._id,
        solicitante: users[4]._id,
        conductor: users[0]._id,
        estado: "rechazado",
        mensaje: "Me gustaría unirme al viaje, por favor.",
        motivoRechazo: "Lo siento, ya no hay cupos disponibles",
        fechaRespuesta: new Date()
      }
    ]);

    console.log(`📋 ${requests.length} solicitudes creadas`);

    console.log("✅ Base de datos inicializada exitosamente");
    
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
  }
};

// Ejecutar el script si se llama directamente
if (process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}

export default seedDatabase;
