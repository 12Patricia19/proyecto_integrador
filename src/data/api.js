// API real para la aplicación de viajes compartidos

const BASE_URL = 'http://localhost:3001/api';

const api = {
  // Viajes
  getAllTrips: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key]) searchParams.append(key, params[key]);
    });
    
    const url = `${BASE_URL}/viajes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return fetch(url).then(res => res.json());
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

  // Solicitudes de viaje
  requestJoinTrip: (tripId, userId, message = '') => {
    return fetch(`${BASE_URL}/viajes/${tripId}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: message, solicitante: userId })
    }).then(res => res.json());
  },

  respondToTripRequest: (requestId, estado, motivoRechazo = '') => {
    return fetch(`${BASE_URL}/viajes/requests/${requestId}/respond`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado, motivoRechazo })
    }).then(res => res.json());
  },

  getDriverRequests: (conductorId) => {
    return fetch(`${BASE_URL}/viajes/driver/${conductorId}/requests`).then(res => res.json());
  },

  getUserRequests: (userId) => {
    return fetch(`${BASE_URL}/viajes/user/${userId}/requests`).then(res => res.json());
  },

  getUserTrips: (userId) => {
    return fetch(`${BASE_URL}/viajes/user/${userId}/trips`).then(res => res.json());
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

  // Búsqueda de viajes
  searchTrips: (searchParams = {}) => {
    return api.getAllTrips(searchParams);
  },

  // Autenticación
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

  register: (userData) => {
    return fetch(`${BASE_URL}/usuarios/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(res => res.json());
  }
};

// Named exports for convenience
export const searchTrips = api.searchTrips;
export const getAllTrips = api.getAllTrips;
export const getTripById = api.getTripById;
export const createTrip = api.createTrip;
export const updateTrip = api.updateTrip;
export const deleteTrip = api.deleteTrip;
export const requestJoinTrip = api.requestJoinTrip;
export const respondToTripRequest = api.respondToTripRequest;
export const getDriverRequests = api.getDriverRequests;
export const getUserRequests = api.getUserRequests;
export const getUserTrips = api.getUserTrips;
export const getAllUsers = api.getAllUsers;
export const getUserById = api.getUserById;
export const createUser = api.createUser;
export const updateUser = api.updateUser;
export const deleteUser = api.deleteUser;
export const login = api.login;
export const register = api.register;

export default api;
