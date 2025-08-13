import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockAPI, mockTrips } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadUserBookings();
    }
  }, [isAuthenticated]);

  const loadUserBookings = async () => {
    try {
      setLoading(true);
      const userBookings = await mockAPI.getUserBookings();
      setBookings(userBookings);
    } catch (error) {
      console.error('Error cargando reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBookingTrip = (tripId) => {
    return mockTrips.find(trip => trip.id === tripId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="dashboard-container">
        <div className="auth-required">
          <h2>🔒 Acceso Requerido</h2>
          <p>Debes iniciar sesión para ver tu dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-welcome">
          <img src={user.avatar} alt={user.name} className="user-avatar-large" />
          <div className="user-info">
            <h1>¡Hola, {user.name}! 👋</h1>
            <p>Bienvenido a tu dashboard de viajes</p>
          </div>
        </div>
        
        <div className="user-stats">
          <div className="stat-card">
            <div className="stat-number">{user.tripsCompleted}</div>
            <div className="stat-label">Viajes Completados</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">⭐ {user.rating}</div>
            <div className="stat-label">Calificación</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{bookings.length}</div>
            <div className="stat-label">Reservas Activas</div>
          </div>
        </div>
      </div>

      <div className="bookings-section">
        <h2>📋 Mis Reservas</h2>
        
        {loading ? (
          <div className="loading">Cargando reservas...</div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">
            <h3>😔 No tienes reservas aún</h3>
            <p>¡Explora los viajes disponibles y haz tu primera reserva!</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map(booking => {
              const trip = getBookingTrip(booking.tripId);
              if (!trip) return null;
              
              return (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-id">Reserva #{booking.id}</div>
                    <div 
                      className="booking-status"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {getStatusText(booking.status)}
                    </div>
                  </div>
                  
                  <div className="booking-trip-info">
                    <div className="trip-route">
                      <span className="origin">{trip.origin}</span>
                      <span className="arrow">→</span>
                      <span className="destination">{trip.destination}</span>
                    </div>
                    
                    <div className="trip-datetime">
                      <span>📅 {trip.departureDate}</span>
                      <span>🕐 {trip.departureTime}</span>
                    </div>
                    
                    <div className="driver-info">
                      <img src={trip.driver.avatar} alt={trip.driver.name} className="driver-avatar" />
                      <div>
                        <div className="driver-name">{trip.driver.name}</div>
                        <div className="driver-rating">⭐ {trip.driver.rating}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="booking-details">
                    <div className="booking-info">
                      <span>💺 {booking.seatsBooked} asiento(s) reservado(s)</span>
                      <span>💰 Total: €{booking.totalPrice}</span>
                      <span>📅 Reservado: {booking.bookingDate}</span>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    <button className="contact-btn">📞 Contactar Conductor</button>
                    {booking.status === 'confirmed' && (
                      <button className="cancel-btn">❌ Cancelar</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>🚀 Acciones Rápidas</h2>
        <div className="actions-grid">
          <button className="action-card">
            <span className="action-icon">🔍</span>
            <span className="action-text">Buscar Viajes</span>
          </button>
          <button className="action-card">
            <span className="action-icon">➕</span>
            <span className="action-text">Publicar Viaje</span>
          </button>
          <button className="action-card">
            <span className="action-icon">⚙️</span>
            <span className="action-text">Configuración</span>
          </button>
          <button className="action-card">
            <span className="action-icon">💬</span>
            <span className="action-text">Mensajes</span>
          </button>
        </div>
      </div>
    </div>
  );
}