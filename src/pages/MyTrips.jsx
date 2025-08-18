import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserTrips } from '../data/api';
import './MyTrips.css';

const MyTrips = () => {
  const { user } = useAuth();
  const [createdTrips, setCreatedTrips] = useState([]);
  const [joinedTrips, setJoinedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created'); // 'created' o 'joined'

  useEffect(() => {
    if (user) {
      loadUserTrips();
    }
  }, [user]);

  const loadUserTrips = async () => {
    try {
      setLoading(true);
      console.log('Loading trips for user:', user); // Debug
      console.log('User ID:', user.id); // Debug
      
      const response = await getUserTrips(user.id);
      console.log('User trips response:', response); // Debug
      
      // El backend devuelve { asDriver, asPassenger }
      setCreatedTrips(response.asDriver || []);
      setJoinedTrips(response.asPassenger || []);
      
    } catch (error) {
      console.error('Error loading user trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'disponible': return 'green';
      case 'lleno': return 'orange';
      case 'cancelado': return 'red';
      case 'finalizado': return 'gray';
      default: return 'blue';
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'disponible': return 'Disponible';
      case 'lleno': return 'Lleno';
      case 'cancelado': return 'Cancelado';
      case 'finalizado': return 'Finalizado';
      default: return estado;
    }
  };

  // Seleccionar viajes según la pestaña activa
  const currentTrips = activeTab === 'created' ? createdTrips : joinedTrips;

  if (!user) {
    return (
      <div className="my-trips-page">
        <div className="auth-required">
          <h2>Inicia sesión requerida</h2>
          <p>Debes iniciar sesión para ver tus viajes</p>
          <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-trips-page">
      <div className="page-header">
        <h1>Mis Viajes</h1>
        <Link to="/create-trip" className="btn btn-primary">
          <span>➕</span>
          Crear Nuevo Viaje
        </Link>
      </div>

      {/* Pestañas */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'created' ? 'active' : ''}`}
          onClick={() => setActiveTab('created')}
        >
          Viajes Creados ({createdTrips.length})
        </button>
        <button 
          className={`tab ${activeTab === 'joined' ? 'active' : ''}`}
          onClick={() => setActiveTab('joined')}
        >
          Viajes Unidos ({joinedTrips.length})
        </button>
      </div>

      {/* Contenido */}
      <div className="trips-content">
        {loading ? (
          <div className="loading">
            <p>Cargando viajes...</p>
          </div>
        ) : currentTrips.length === 0 ? (
          <div className="no-trips">
            <div className="no-trips-icon">🚗</div>
            <h3>
              {activeTab === 'created' 
                ? 'No has creado ningún viaje aún' 
                : 'No te has unido a ningún viaje aún'
              }
            </h3>
            <p>
              {activeTab === 'created'
                ? 'Crea tu primer viaje y ayuda a otros miembros de la comunidad PUCE'
                : 'Explora los viajes disponibles y únete a uno'
              }
            </p>
            <div className="no-trips-actions">
              {activeTab === 'created' ? (
                <Link to="/create-trip" className="btn btn-primary">
                  Crear mi primer viaje
                </Link>
              ) : (
                <Link to="/" className="btn btn-primary">
                  Buscar viajes
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="trips-grid">
            {currentTrips.map((trip) => (
              <div key={trip._id} className="trip-card">
                <div className="trip-header">
                  <div className="trip-route">
                    <div className="route-container">
                      <div className="location origin">
                        <span className="location-icon">📍</span>
                        <span className="location-text">{trip.origen?.direccion}</span>
                      </div>
                      <div className="route-arrow">
                        <span className="arrow-line"></span>
                        <span className="arrow-icon">🚗</span>
                      </div>
                      <div className="location destination">
                        <span className="location-icon">🎯</span>
                        <span className="location-text">{trip.destino?.direccion}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusColor(trip.estado)}`}>
                    {getStatusText(trip.estado)}
                  </span>
                </div>

                <div className="trip-person">
                  {activeTab === 'created' ? (
                    <div className="person-info conductor">
                      <span className="person-icon">👨‍💼</span>
                      <span className="person-name">Tú (Conductor)</span>
                    </div>
                  ) : (
                    <div className="person-info conductor">
                      <span className="person-icon">👨‍💼</span>
                      <span className="person-name">
                        {trip.creador?.nombres} {trip.creador?.apellidos}
                      </span>
                      {trip.creador?.calificacion && (
                        <span className="person-rating">⭐ {trip.creador.calificacion.toFixed(1)}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="trip-info">
                  <div className="trip-datetime">
                    <div className="date">{formatDate(trip.fechaHoraSalida)}</div>
                    <div className="time">{formatTime(trip.fechaHoraSalida)}</div>
                  </div>
                  
                  <div className="trip-stats">
                    <div className="price">${trip.costo}</div>
                    <div className="seats">{trip.cuposOcupados}/{trip.cupos} 👥</div>
                  </div>
                </div>

                {activeTab === 'created' && (
                  <div className="trip-passengers">
                    <span className="passengers-count">
                      👥 {trip.cuposOcupados} pasajeros confirmados
                    </span>
                  </div>
                )}

                <div className="trip-actions">
                  <Link to={`/trip/${trip._id}`} className="btn-view">
                    Ver detalles
                  </Link>
                  {activeTab === 'created' && trip.estado === 'disponible' && (
                    <button className="btn-edit">✏️</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
