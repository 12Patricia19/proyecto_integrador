import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserRequests, respondToTripRequest } from '../data/api';
import './MyRequests.css';

const MyRequests = () => {
  const { user } = useAuth();
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received'); // 'received' o 'sent'

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      console.log('Loading requests for user:', user); // Debug
      console.log('User ID:', user.id); // Debug
      
      const response = await getUserRequests(user.id);
      console.log('User requests response:', response); // Debug
      
      setReceivedRequests(response.receivedRequests || []);
      setSentRequests(response.sentRequests || []);
      
    } catch (error) {
      console.error('Error loading requests:', error);
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
      case 'pendiente': return 'orange';
      case 'aceptado': return 'green';
      case 'rechazado': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'aceptado': return 'Aceptado';
      case 'rechazado': return 'Rechazado';
      default: return estado;
    }
  };

  const handleRequestResponse = async (requestId, response, reason = '') => {
    try {
      await respondToTripRequest(requestId, response, reason);
      console.log('Responding to request:', requestId, response, reason);
      // Recargar solicitudes después de responder
      loadRequests();
    } catch (error) {
      console.error('Error responding to request:', error);
      alert('Error al responder la solicitud. Intenta de nuevo.');
    }
  };

  if (!user) {
    return (
      <div className="my-requests-page">
        <div className="auth-required">
          <h2>Inicia sesión requerida</h2>
          <p>Debes iniciar sesión para ver tus solicitudes</p>
          <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-requests-page">
      <div className="page-header">
        <h1>Mis Solicitudes</h1>
        <Link to="/" className="btn btn-primary">
          <span>🔍</span>
          Buscar Viajes
        </Link>
      </div>

      {/* Pestañas */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          Solicitudes Recibidas ({receivedRequests.length})
        </button>
        <button 
          className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          Solicitudes Enviadas ({sentRequests.length})
        </button>
      </div>

      {/* Contenido */}
      <div className="requests-content">
        {loading ? (
          <div className="loading">
            <p>Cargando solicitudes...</p>
          </div>
        ) : activeTab === 'received' ? (
          // Solicitudes recibidas (como conductor)
          receivedRequests.length === 0 ? (
            <div className="no-requests">
              <div className="no-requests-icon">📋</div>
              <h3>No tienes solicitudes pendientes</h3>
              <p>Cuando otros usuarios soliciten unirse a tus viajes, aparecerán aquí</p>
              <Link to="/create-trip" className="btn btn-primary">
                Crear un viaje
              </Link>
            </div>
          ) : (
            <div className="requests-list">
              {receivedRequests.map((request) => (
                <div key={request._id} className="request-card">
                  <div className="request-header">
                    <div className="requester-info">
                      <div className="requester-name">
                        {request.solicitante.nombres} {request.solicitante.apellidos}
                      </div>
                      <div className="request-date">
                        Solicitó el {formatDate(request.fechaSolicitud)}
                      </div>
                    </div>
                    <div className="request-status">
                      <span className={`status-badge ${getStatusColor(request.estado)}`}>
                        {getStatusText(request.estado)}
                      </span>
                    </div>
                  </div>

                  <div className="trip-info">
                    <h4>Viaje solicitado:</h4>
                    <div className="trip-route">
                      <span className="origin">{request.viaje.origen?.direccion}</span>
                      <span className="arrow">→</span>
                      <span className="destination">{request.viaje.destino?.direccion}</span>
                    </div>
                    <div className="trip-datetime">
                      <span>{formatDate(request.viaje.fechaHoraSalida)} a las {formatTime(request.viaje.fechaHoraSalida)}</span>
                    </div>
                  </div>

                  {request.mensaje && (
                    <div className="request-message">
                      <h5>Mensaje del solicitante:</h5>
                      <p>"{request.mensaje}"</p>
                    </div>
                  )}

                  <div className="requester-details">
                    <div className="requester-contact">
                      <span>📧 {request.solicitante.email}</span>
                      {request.solicitante.telefono && (
                        <span>📱 {request.solicitante.telefono}</span>
                      )}
                    </div>
                    {request.solicitante.calificacion && (
                      <div className="requester-rating">
                        ⭐ {request.solicitante.calificacion.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {request.estado === 'pendiente' && (
                    <div className="request-actions">
                      <button 
                        className="btn btn-success"
                        onClick={() => handleRequestResponse(request._id, 'aceptado')}
                      >
                        ✅ Aceptar
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => {
                          const reason = prompt('¿Por qué rechazas esta solicitud? (opcional)');
                          handleRequestResponse(request._id, 'rechazado', reason || '');
                        }}
                      >
                        ❌ Rechazar
                      </button>
                    </div>
                  )}

                  {request.estado === 'rechazado' && request.motivoRechazo && (
                    <div className="rejection-reason">
                      <h5>Motivo del rechazo:</h5>
                      <p>{request.motivoRechazo}</p>
                    </div>
                  )}

                  <div className="request-footer">
                    <Link 
                      to={`/trip/${request.viaje._id}`}
                      className="btn btn-outline"
                    >
                      Ver viaje completo
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // Solicitudes enviadas (como pasajero)
          sentRequests.length === 0 ? (
            <div className="no-requests">
              <div className="no-requests-icon">📤</div>
              <h3>No has enviado solicitudes aún</h3>
              <p>Busca viajes disponibles y solicita unirte a ellos</p>
              <Link to="/" className="btn btn-primary">
                Buscar viajes
              </Link>
            </div>
          ) : (
            <div className="requests-list">
              {sentRequests.map((request) => (
                <div key={request._id} className="request-card">
                  <div className="request-header">
                    <div className="requester-info">
                      <div className="requester-name">
                        Solicitud a: {request.conductor.nombres} {request.conductor.apellidos}
                      </div>
                      <div className="request-date">
                        Enviada el {formatDate(request.fechaSolicitud)}
                      </div>
                    </div>
                    <div className="request-status">
                      <span className={`status-badge ${getStatusColor(request.estado)}`}>
                        {getStatusText(request.estado)}
                      </span>
                    </div>
                  </div>

                  <div className="trip-info">
                    <h4>Viaje solicitado:</h4>
                    <div className="trip-route">
                      <span className="origin">{request.viaje.origen?.direccion}</span>
                      <span className="arrow">→</span>
                      <span className="destination">{request.viaje.destino?.direccion}</span>
                    </div>
                    <div className="trip-datetime">
                      <span>{formatDate(request.viaje.fechaHoraSalida)} a las {formatTime(request.viaje.fechaHoraSalida)}</span>
                    </div>
                    <div className="trip-cost">
                      <strong>Costo: ${request.viaje.costo}</strong>
                    </div>
                  </div>

                  {request.mensaje && (
                    <div className="request-message">
                      <h5>Tu mensaje:</h5>
                      <p>"{request.mensaje}"</p>
                    </div>
                  )}

                  <div className="driver-details">
                    <div className="driver-contact">
                      <span>📧 {request.conductor.email}</span>
                      {request.conductor.telefono && (
                        <span>📱 {request.conductor.telefono}</span>
                      )}
                    </div>
                    {request.conductor.calificacion && (
                      <div className="driver-rating">
                        ⭐ {request.conductor.calificacion.toFixed(1)}
                      </div>
                    )}
                    {request.conductor.vehiculo && (
                      <div className="vehicle-info">
                        🚗 {request.conductor.vehiculo.marca} {request.conductor.vehiculo.modelo} - {request.conductor.vehiculo.color}
                      </div>
                    )}
                  </div>

                  {request.estado === 'rechazado' && request.motivoRechazo && (
                    <div className="rejection-reason">
                      <h5>Motivo del rechazo:</h5>
                      <p>{request.motivoRechazo}</p>
                    </div>
                  )}

                  {request.estado === 'aceptado' && (
                    <div className="accepted-notice">
                      <h5>¡Solicitud aceptada! 🎉</h5>
                      <p>Tu solicitud ha sido aceptada. Ponte en contacto con el conductor para coordinar el viaje.</p>
                    </div>
                  )}

                  <div className="request-footer">
                    <Link 
                      to={`/trip/${request.viaje._id}`}
                      className="btn btn-outline"
                    >
                      Ver viaje completo
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MyRequests;
