// Mock data para la aplicación de viajes compartidos

export const mockTrips = [
  {
    id: 1,
    origin: "Madrid",
    destination: "Barcelona",
    departureDate: "2025-08-15",
    departureTime: "08:00",
    arrivalTime: "11:30",
    driver: {
      name: "Carlos González",
      rating: 4.8,
      avatar: "https://via.placeholder.com/50/0000FF/FFFFFF?text=CG"
    },
    availableSeats: 3,
    pricePerSeat: 25,
    vehicle: {
      brand: "Toyota",
      model: "Corolla",
      color: "Azul",
      plate: "1234ABC"
    },
    amenities: ["WiFi", "Aire acondicionado", "Música"]
  },
  {
    id: 2,
    origin: "Barcelona",
    destination: "Valencia",
    departureDate: "2025-08-16",
    departureTime: "14:00",
    arrivalTime: "17:30",
    driver: {
      name: "María López",
      rating: 4.9,
      avatar: "https://via.placeholder.com/50/FF0000/FFFFFF?text=ML"
    },
    availableSeats: 2,
    pricePerSeat: 20,
    vehicle: {
      brand: "Volkswagen",
      model: "Golf",
      color: "Blanco",
      plate: "5678DEF"
    },
    amenities: ["WiFi", "Cargador USB"]
  },
  {
    id: 3,
    origin: "Madrid",
    destination: "Sevilla",
    departureDate: "2025-08-17",
    departureTime: "09:30",
    arrivalTime: "15:00",
    driver: {
      name: "Javier Ruiz",
      rating: 4.7,
      avatar: "https://via.placeholder.com/50/00FF00/FFFFFF?text=JR"
    },
    availableSeats: 4,
    pricePerSeat: 35,
    vehicle: {
      brand: "Ford",
      model: "Focus",
      color: "Negro",
      plate: "9012GHI"
    },
    amenities: ["Aire acondicionado", "Música", "Snacks"]
  },
  {
    id: 4,
    origin: "Valencia",
    destination: "Madrid",
    departureDate: "2025-08-18",
    departureTime: "16:00",
    arrivalTime: "19:30",
    driver: {
      name: "Ana Martín",
      rating: 4.9,
      avatar: "https://via.placeholder.com/50/FFA500/FFFFFF?text=AM"
    },
    availableSeats: 1,
    pricePerSeat: 22,
    vehicle: {
      brand: "Seat",
      model: "León",
      color: "Rojo",
      plate: "3456JKL"
    },
    amenities: ["WiFi", "Aire acondicionado", "Cargador USB"]
  },
  {
    id: 5,
    origin: "Barcelona",
    destination: "Madrid",
    departureDate: "2025-08-19",
    departureTime: "07:45",
    arrivalTime: "11:15",
    driver: {
      name: "Pedro Sánchez",
      rating: 4.6,
      avatar: "https://via.placeholder.com/50/800080/FFFFFF?text=PS"
    },
    availableSeats: 3,
    pricePerSeat: 28,
    vehicle: {
      brand: "Renault",
      model: "Megane",
      color: "Gris",
      plate: "7890MNO"
    },
    amenities: ["Música", "Aire acondicionado"]
  }
];

export const mockUser = {
  id: 1,
  name: "Usuario Demo",
  email: "demo@viajes.com",
  phone: "+34 123 456 789",
  avatar: "https://via.placeholder.com/100/4CAF50/FFFFFF?text=UD",
  rating: 4.8,
  tripsCompleted: 15,
  memberSince: "2024-01-15"
};

export const mockBookings = [
  {
    id: 1,
    tripId: 1,
    userId: 1,
    seatsBooked: 1,
    bookingDate: "2025-08-10",
    status: "confirmed",
    totalPrice: 25
  },
  {
    id: 2,
    tripId: 3,
    userId: 1,
    seatsBooked: 2,
    bookingDate: "2025-08-12",
    status: "pending",
    totalPrice: 70
  }
];

// Funciones mock para simular llamadas al backend
export const mockAPI = {
  // Obtener todos los viajes
  getTrips: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTrips), 500);
    });
  },

  // Buscar viajes por origen y destino
  searchTrips: (origin, destination, date) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockTrips.filter(trip => 
          (!origin || trip.origin.toLowerCase().includes(origin.toLowerCase())) &&
          (!destination || trip.destination.toLowerCase().includes(destination.toLowerCase())) &&
          (!date || trip.departureDate === date)
        );
        resolve(filtered);
      }, 500);
    });
  },

  // Autenticación
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "demo@viajes.com" && password === "123456") {
          resolve({
            success: true,
            user: mockUser,
            token: "mock-jwt-token"
          });
        } else {
          reject(new Error("Credenciales inválidas"));
        }
      }, 1000);
    });
  },

  // Reservar viaje
  bookTrip: (tripId, seats) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = {
          id: Date.now(),
          tripId,
          userId: mockUser.id,
          seatsBooked: seats,
          bookingDate: new Date().toISOString().split('T')[0],
          status: "confirmed",
          totalPrice: mockTrips.find(t => t.id === tripId)?.pricePerSeat * seats || 0
        };
        resolve(booking);
      }, 1000);
    });
  },

  // Obtener reservas del usuario
  getUserBookings: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockBookings), 500);
    });
  }
};
