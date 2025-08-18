import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../data/api';
import './CreateTrip.css';

export default function CreateTrip() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origen: {
      direccion: '',
      latitud: null,
      longitud: null
    },
    destino: {
      direccion: '',
      latitud: null,
      longitud: null
    },
    fechaHoraSalida: '',
    cupos: 1,
    costo: 0,
    descripcion: '',
    tiempoEstimado: '',
    distancia: '',
    politicasViaje: {
      permiteFumar: false,
      permiteMascotas: false,
      equipaje: 'pequeño'
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para crear un viaje');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      // Preparar datos para enviar
      const tripData = {
        ...formData,
        creador: user?.id,
        cupos: parseInt(formData.cupos),
        costo: parseFloat(formData.costo),
        tiempoEstimado: formData.tiempoEstimado ? parseInt(formData.tiempoEstimado) : undefined,
        distancia: formData.distancia ? parseFloat(formData.distancia) : undefined
      };

      const newTrip = await api.createTrip(tripData);
      alert('¡Viaje creado exitosamente!');
      navigate('/');
    } catch (error) {
      console.error('Error creando viaje:', error);
      alert('Error al crear el viaje. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const popularOrigins = [
    'Terminal Terrestre Quitumbe',
    'Estación Norte del Ecovía',
    'Centro Histórico de Quito',
    'Valle de los Chillos - Sangolquí',
    'Cumbayá',
    'La Carolina',
    'Terminal Sur Quitumbe',
    'Centro Comercial El Jardín'
  ];

  const popularDestinations = [
    'PUCE Quito - Campus Principal',
    'Universidad Central del Ecuador',
    'Escuela Politécnica Nacional',
    'Universidad San Francisco de Quito',
    'Terminal Terrestre Quitumbe',
    'Aeropuerto Mariscal Sucre',
    'Centro Histórico de Quito'
  ];

  return (
    <div className="create-trip-container">
      <div className="create-trip-header">
        <h1>🚗 Publicar Nuevo Viaje</h1>
        <p>Comparte tu ruta y ahorra en gastos de combustible</p>
      </div>

      <form onSubmit={handleSubmit} className="create-trip-form">
        {/* Información de la ruta */}
        <div className="form-section">
          <h2>📍 Información de la Ruta</h2>
          
          <div className="form-group">
            <label htmlFor="origen.direccion">Punto de Origen *</label>
            <input
              type="text"
              id="origen.direccion"
              name="origen.direccion"
              value={formData.origen.direccion}
              onChange={handleChange}
              placeholder="Desde dónde partirás..."
              required
              list="popular-origins"
            />
            <datalist id="popular-origins">
              {popularOrigins.map((origin, index) => (
                <option key={index} value={origin} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="destino.direccion">Punto de Destino *</label>
            <input
              type="text"
              id="destino.direccion"
              name="destino.direccion"
              value={formData.destino.direccion}
              onChange={handleChange}
              placeholder="Hacia dónde te diriges..."
              required
              list="popular-destinations"
            />
            <datalist id="popular-destinations">
              {popularDestinations.map((destination, index) => (
                <option key={index} value={destination} />
              ))}
            </datalist>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tiempoEstimado">Tiempo estimado (minutos)</label>
              <input
                type="number"
                id="tiempoEstimado"
                name="tiempoEstimado"
                value={formData.tiempoEstimado}
                onChange={handleChange}
                placeholder="ej: 45"
                min="1"
                max="300"
              />
            </div>
            <div className="form-group">
              <label htmlFor="distancia">Distancia (km)</label>
              <input
                type="number"
                id="distancia"
                name="distancia"
                value={formData.distancia}
                onChange={handleChange}
                placeholder="ej: 25.5"
                min="0.1"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Información del viaje */}
        <div className="form-section">
          <h2>🕒 Detalles del Viaje</h2>
          
          <div className="form-group">
            <label htmlFor="fechaHoraSalida">Fecha y Hora de Salida *</label>
            <input
              type="datetime-local"
              id="fechaHoraSalida"
              name="fechaHoraSalida"
              value={formData.fechaHoraSalida}
              onChange={handleChange}
              min={getCurrentDateTime()}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cupos">Cupos Disponibles *</label>
              <select
                id="cupos"
                name="cupos"
                value={formData.cupos}
                onChange={handleChange}
                required
              >
                <option value={1}>1 pasajero</option>
                <option value={2}>2 pasajeros</option>
                <option value={3}>3 pasajeros</option>
                <option value={4}>4 pasajeros</option>
                <option value={5}>5 pasajeros</option>
                <option value={6}>6 pasajeros</option>
                <option value={7}>7 pasajeros</option>
                <option value={8}>8 pasajeros</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="costo">Costo por Persona (USD) *</label>
              <input
                type="number"
                id="costo"
                name="costo"
                value={formData.costo}
                onChange={handleChange}
                placeholder="ej: 2.50"
                min="0"
                step="0.25"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción del Viaje</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Agrega detalles adicionales sobre tu viaje: puntos de recogida específicos, referencias, etc."
              rows="4"
            />
          </div>
        </div>

        {/* Políticas del viaje */}
        <div className="form-section">
          <h2>📋 Políticas del Viaje</h2>
          
          <div className="policies-grid">
            <div className="policy-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="politicasViaje.permiteFumar"
                  checked={formData.politicasViaje.permiteFumar}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                🚭 Permitir fumar
              </label>
            </div>

            <div className="policy-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="politicasViaje.permiteMascotas"
                  checked={formData.politicasViaje.permiteMascotas}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                🐕 Permitir mascotas
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="politicasViaje.equipaje">Tipo de equipaje permitido</label>
              <select
                id="politicasViaje.equipaje"
                name="politicasViaje.equipaje"
                value={formData.politicasViaje.equipaje}
                onChange={handleChange}
              >
                <option value="pequeño">🎒 Pequeño (mochila, cartera)</option>
                <option value="mediano">🧳 Mediano (maleta de mano)</option>
                <option value="grande">📦 Grande (maletas grandes, cajas)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Información del conductor */}
        <div className="form-section">
          <h2>👤 Información del Conductor</h2>
          <div className="driver-preview">
            <div className="driver-info">
              <p><strong>Conductor:</strong> {user?.nombres} {user?.apellidos}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              {user?.telefono && <p><strong>Teléfono:</strong> {user?.telefono}</p>}
            </div>
            <div className="driver-note">
              💡 <strong>Tip:</strong> Actualiza tu perfil para agregar información de tu vehículo y mejorar la confianza de los pasajeros.
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="cancel-btn"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Publicando...' : '🚗 Publicar Viaje'}
          </button>
        </div>
      </form>
    </div>
  );
}
