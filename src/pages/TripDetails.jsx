import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../data/api';
import './TripDetails.css';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    loadTripDetails();
  }, [id]);

  const loadTripDetails = async () => {
    try {
      setLoading(true);
      const tripData = await api.getTripById(id);
      setTrip(tripData);
    } catch (error) {
      console.error('Error cargando detalles del viaje:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestJoin = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setRequesting(true);
      await api.requestJoinTrip(trip._id, user.id, message);
      alert('Solicitud enviada exitosamente. El conductor será notificado.');
      setShowRequestForm(false);
      setMessage('');
    } catch (error) {
      console.error('Error enviando solicitud:', error);
      alert('Error al enviar la solicitud. Intenta de nuevo.');
    } finally {
      setRequesting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-EC', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) {
    return (
      <div className="trip-details-container">
        <div className="loading">Cargando detalles del viaje...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="trip-details-container">
        <div className="error">Viaje no encontrado</div>
      </div>
    );
  }

  const isOwnTrip = user && trip.creador._id === user.id;
  const hasRequestedJoin = trip.pasajeros?.some(p => p.usuario._id === user?.id);

  return (
    <div className="trip-details-container">
      <div className="trip-details-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <span className="back-icon">←</span>
          Volver
        </button>
        <div className="header-content">
          <h1>Detalles del Viaje</h1>
          <div className="trip-status-badge">
            <span className={`status-indicator status-${trip.estado}`}></span>
            {trip.estado.charAt(0).toUpperCase() + trip.estado.slice(1)}
          </div>
        </div>
      </div>

      <div className="trip-details-content">
        {/* Hero Section con ruta destacada */}
        <div className="trip-hero-section">
          <div className="route-card">
            <div className="route-header">
              <h2><span className="icon">�️</span> Ruta del Viaje</h2>
              {trip.distancia && (
                <span className="distance-badge">{trip.distancia} km</span>
              )}
            </div>
            <div className="route-details">
              <div className="route-point origin">
                <div className="point-icon">📍</div>
                <div className="point-info">
                  <span className="point-label">Origen</span>
                  <span className="point-address">{trip.origen?.direccion || trip.origen}</span>
                </div>
              </div>
              <div className="route-connection">
                <div className="route-line"></div>
                <div className="route-arrow">🚗</div>
              </div>
              <div className="route-point destination">
                <div className="point-icon">🎯</div>
                <div className="point-info">
                  <span className="point-label">Destino</span>
                  <span className="point-address">{trip.destino?.direccion || trip.destino}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información principal del viaje */}
        <div className="trip-main-info">

          <div className="trip-info-cards">
            <div className="info-card timing-card">
              <div className="card-header">
                <h3><span className="icon">⏰</span> Horarios</h3>
              </div>
              <div className="card-content">
                <div className="timing-item">
                  <div className="timing-icon">📅</div>
                  <div className="timing-info">
                    <span className="timing-label">Fecha</span>
                    <span className="timing-value">{formatDate(trip.fechaHoraSalida)}</span>
                  </div>
                </div>
                <div className="timing-item">
                  <div className="timing-icon">🕒</div>
                  <div className="timing-info">
                    <span className="timing-label">Hora de salida</span>
                    <span className="timing-value">{formatTime(trip.fechaHoraSalida)}</span>
                  </div>
                </div>
                {trip.tiempoEstimado && (
                  <div className="timing-item">
                    <div className="timing-icon">⏱️</div>
                    <div className="timing-info">
                      <span className="timing-label">Duración estimada</span>
                      <span className="timing-value">{trip.tiempoEstimado} min</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="info-card details-card">
              <div className="card-header">
                <h3><span className="icon">�</span> Información</h3>
              </div>
              <div className="card-content">
                <div className="detail-item">
                  <div className="detail-icon">💺</div>
                  <div className="detail-info">
                    <span className="detail-label">Cupos disponibles</span>
                    <span className="detail-value highlight">
                      {trip.cupos - trip.cuposOcupados} de {trip.cupos}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">💰</div>
                  <div className="detail-info">
                    <span className="detail-label">Costo por persona</span>
                    <span className="detail-value price">${trip.costo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {trip.descripcion && (
            <div className="description-card">
              <div className="card-header">
                <h3><span className="icon">📝</span> Descripción del viaje</h3>
              </div>
              <div className="card-content">
                <p className="description-text">{trip.descripcion}</p>
              </div>
            </div>
          )}

          {trip.politicasViaje && (
            <div className="policies-card">
              <div className="card-header">
                <h3><span className="icon">📋</span> Políticas del viaje</h3>
              </div>
              <div className="card-content">
                <div className="policies-grid">
                  <div className={`policy-item ${trip.politicasViaje.permiteFumar ? 'allowed' : 'not-allowed'}`}>
                    <span className="policy-icon">
                      {trip.politicasViaje.permiteFumar ? '✅' : '🚫'}
                    </span>
                    <span className="policy-text">Fumar</span>
                  </div>
                  <div className={`policy-item ${trip.politicasViaje.permiteMascotas ? 'allowed' : 'not-allowed'}`}>
                    <span className="policy-icon">
                      {trip.politicasViaje.permiteMascotas ? '✅' : '🚫'}
                    </span>
                    <span className="policy-text">Mascotas</span>
                  </div>
                  <div className="policy-item neutral">
                    <span className="policy-icon">🧳</span>
                    <span className="policy-text">Equipaje: {trip.politicasViaje.equipaje}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Información del conductor */}
        <div className="driver-section">
          <div className="card-header">
            <h2><span className="icon">👤</span> Conductor</h2>
          </div>
          <div className="driver-card">
            <div className="driver-avatar">
              {trip.creador.fotoPerfil ? (
                <img src={trip.creador.fotoPerfil} alt="Foto del conductor" />
              ) : (
                <div className="avatar-placeholder">
                  {trip.creador.nombres.charAt(0)}{trip.creador.apellidos.charAt(0)}
                </div>
              )}
              <div className="online-indicator"></div>
            </div>
            <div className="driver-info">
              <h3 className="driver-name">{trip.creador.nombres} {trip.creador.apellidos}</h3>
              <div className="driver-rating">
                <span className="stars">{renderStars(trip.creador.calificacion || 5)}</span>
                <span className="rating-number">({trip.creador.calificacion || 5}/5)</span>
              </div>
              <div className="driver-stats">
                <div className="stat-item">
                  <span className="stat-icon">🚗</span>
                  <span className="stat-text">{trip.creador.totalViajes || 0} viajes realizados</span>
                </div>
                {trip.creador.telefono && (
                  <div className="stat-item">
                    <span className="stat-icon">📞</span>
                    <span className="stat-text">{trip.creador.telefono}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {trip.creador.vehiculo && (
            <div className="vehicle-card">
              <div className="vehicle-header">
                <h4><span className="icon">🚗</span> Vehículo</h4>
              </div>
              <div className="vehicle-details">
                <div className="vehicle-main-info">
                  <span className="vehicle-name">
                    {trip.creador.vehiculo.marca} {trip.creador.vehiculo.modelo}
                  </span>
                  {trip.creador.vehiculo.anio && (
                    <span className="vehicle-year">({trip.creador.vehiculo.anio})</span>
                  )}
                </div>
                <div className="vehicle-specs">
                  <span className="spec-item">
                    <span className="spec-label">Color:</span>
                    <span className="spec-value">{trip.creador.vehiculo.color}</span>
                  </span>
                  <span className="spec-item">
                    <span className="spec-label">Placa:</span>
                    <span className="spec-value">{trip.creador.vehiculo.placa}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pasajeros actuales */}
        {trip.pasajeros && trip.pasajeros.length > 0 && (
          <div className="passengers-section">
            <div className="card-header">
              <h2><span className="icon">👥</span> Pasajeros confirmados</h2>
              <span className="passengers-count">{trip.pasajeros.length}</span>
            </div>
            <div className="passengers-list">
              {trip.pasajeros.map((pasajero, index) => (
                <div key={index} className="passenger-item">
                  <div className="passenger-avatar">
                    {pasajero.usuario.fotoPerfil ? (
                      <img src={pasajero.usuario.fotoPerfil} alt="Foto del pasajero" />
                    ) : (
                      <div className="avatar-placeholder small">
                        {pasajero.usuario.nombres.charAt(0)}{pasajero.usuario.apellidos.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="passenger-info">
                    <span className="passenger-name">
                      {pasajero.usuario.nombres} {pasajero.usuario.apellidos}
                    </span>
                    <span className={`passenger-status status-${pasajero.estado}`}>
                      {pasajero.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acciones */}
        {!isOwnTrip && trip.estado === 'disponible' && !hasRequestedJoin && (
          <div className="actions-section">
            {!showRequestForm ? (
              <div className="action-card">
                <div className="action-header">
                  <h3>¿Te interesa este viaje?</h3>
                  <p>Envía una solicitud al conductor para unirte</p>
                </div>
                <button 
                  onClick={() => setShowRequestForm(true)}
                  className="request-join-btn"
                  disabled={trip.cupos <= trip.cuposOcupados}
                >
                  <span className="btn-icon">🙋‍♂️</span>
                  {trip.cupos <= trip.cuposOcupados ? 'Sin cupos disponibles' : 'Solicitar unirse al viaje'}
                </button>
              </div>
            ) : (
              <div className="request-form-card">
                <form onSubmit={handleRequestJoin} className="request-form">
                  <div className="form-header">
                    <h3>Enviar solicitud</h3>
                    <p>Escribe un mensaje opcional para el conductor</p>
                  </div>
                  <div className="form-content">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ej: Hola, me interesa mucho el viaje. Soy puntual y responsable..."
                      rows={4}
                      className="message-textarea"
                    />
                    <div className="request-form-actions">
                      <button type="submit" disabled={requesting} className="send-request-btn">
                        <span className="btn-icon">📤</span>
                        {requesting ? 'Enviando...' : 'Enviar solicitud'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowRequestForm(false)}
                        className="cancel-request-btn"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {hasRequestedJoin && (
          <div className="status-message success">
            <span className="status-icon">✅</span>
            <div className="status-content">
              <h4>Solicitud enviada</h4>
              <p>Ya has solicitado unirte a este viaje. El conductor revisará tu solicitud.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
