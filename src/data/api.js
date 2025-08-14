// API real para la aplicación de viajes compartidos

const BASE_URL = 'http://localhost:4000/api';

const api = {
  // Viajes
  getAllTrips: () => {
    return fetch(`${BASE_URL}/viajes`).then(res => res.json());
  },
  getTripById: (id) => {
    return fetch(`${BASE_URL}/viajes/${id}`).then(res => res.json());
  },
  createTrip: (trip) => {
    return fetch(`${BASE_URL}/viajes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trip)
    }).then(res => res.json());
  },
  updateTrip: (id, trip) => {
    return fetch(`${BASE_URL}/viajes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trip)
    }).then(res => res.json());
  },
  deleteTrip: (id) => {
    return fetch(`${BASE_URL}/viajes/${id}`, {
      method: 'DELETE'
    }).then(res => res.json());
  },
  // Usuarios
  getAllUsers: () => {
    return fetch(`${BASE_URL}/usuarios`).then(res => res.json());
  },
  getUserById: (id) => {
    return fetch(`${BASE_URL}/usuarios/${id}`).then(res => res.json());
  },
  createUser: (user) => {
    return fetch(`${BASE_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    }).then(res => res.json());
  },
  updateUser: (id, user) => {
    return fetch(`${BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    }).then(res => res.json());
  },
  deleteUser: (id) => {
    return fetch(`${BASE_URL}/usuarios/${id}`, {
      method: 'DELETE'
    }).then(res => res.json());
  },
  getTrips: () => {
    return fetch(`${BASE_URL}/viajes`)
      .then(res => res.json());
  },
  searchTrips: (origin, destination, date) => {
    const params = new URLSearchParams();
    if (origin) params.append('origin', origin);
    if (destination) params.append('destination', destination);
    if (date) params.append('date', date);
    return fetch(`${BASE_URL}/viajes/search?${params.toString()}`)
      .then(res => res.json());
  },
  login: (email, password) => {
    return fetch(`${BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (!res.ok) throw new Error('Credenciales inválidas');
        return res.json();
      });
  },
  bookTrip: (tripId, seats) => {
    return fetch(`${BASE_URL}/viajes/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId, seats })
    })
      .then(res => res.json());
  },
  getUserBookings: () => {
    return fetch(`${BASE_URL}/usuarios/bookings`)
      .then(res => res.json());
  }
};

export default api;
