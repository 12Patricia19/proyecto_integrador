import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../data/api';
import './Home.css';

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
  loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const tripsData = await api.getAllTrips();
      console.log(tripsData);

      setTrips(tripsData);
    } catch (error) {
      console.error('Error cargando viajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Filtrar localmente sobre tripsArray
      const filtered = tripsArray.filter(trip => {
        const matchOrigin = !searchOrigin || (trip.origen && trip.origen.toLowerCase().includes(searchOrigin.toLowerCase()));
        const matchDestination = !searchDestination || (trip.destino && trip.destino.toLowerCase().includes(searchDestination.toLowerCase()));
        const matchDate = !searchDate || (trip.fechaHoraSalida && new Date(trip.fechaHoraSalida).toISOString().slice(0,10) === searchDate);
        return matchOrigin && matchDestination && matchDate;
      });
      setTrips(filtered);
    } catch (error) {
      console.error('Error buscando viajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
  setSearchOrigin('');
  setSearchDestination('');
  setSearchDate('');
  loadTrips();
  };

  const tripsArray = Array.isArray(trips) ? trips : [];

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>🚗 Viajes Compartidos</h1>
        <p>Encuentra tu viaje perfecto y comparte gastos</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-inputs">
            <input
              type="text"
              placeholder="Origen"
              value={searchOrigin}
              onChange={(e) => setSearchOrigin(e.target.value)}
              className="search-input"
            />
            <input
              type="text"
              placeholder="Destino"
              value={searchDestination}
              onChange={(e) => setSearchDestination(e.target.value)}
              className="search-input"
            />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="search-buttons">
            <button type="submit" className="search-btn">
              🔍 Buscar
            </button>
            <button type="button" onClick={clearSearch} className="clear-btn">
              🗑️ Limpiar
            </button>
          </div>
        </form>
      </div>

      <div className="trips-section">
        <h2>Viajes Disponibles</h2>
        
        {loading ? (
          <div className="loading">Cargando viajes...</div>
        ) : tripsArray.length === 0 ? (
          <div className="no-trips">No se encontraron viajes disponibles</div>
        ) : (
          <div className="trips-grid">
            {tripsArray.map(trip => (
              <div key={trip._id} className="trip-card">
                <div className="trip-header">
                  <div className="route">
                    <span className="origin">{trip.origen || 'Sin origen'}</span>
                    <span className="arrow">→</span>
                    <span className="destination">{trip.destino || 'Sin destino'}</span>
                  </div>
                  <div className="estado">{trip.estado || 'Sin estado'}</div>
                </div>
                <div className="trip-details">
                  <div className="datetime">
                    <span>📅 {trip.fechaHoraSalida ? new Date(trip.fechaHoraSalida).toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Sin fecha'}</span>
                    <span style={{ marginLeft: 8 }}>
                      🕒 {trip.fechaHoraSalida ? new Date(trip.fechaHoraSalida).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div className="seats-info">
                    <span>💺 {typeof trip.cupos === 'number' ? trip.cupos : 'N/A'} cupos disponibles</span>
                  </div>
                  <div className="creador-info">
                    <span>👤 <b>{trip.creador?.nombres} {trip.creador?.apellidos}</b> <span style={{color:'#888', fontSize:'0.9em'}}>({trip.creador?.email})</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
