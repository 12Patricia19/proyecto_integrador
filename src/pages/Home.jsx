import React, { useState, useEffect } from 'react';
import { mockAPI } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
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
      const tripsData = await mockAPI.getTrips();
      setTrips(tripsData);
    } catch (error) {
      console.error('Error cargando viajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const searchResults = await mockAPI.searchTrips(searchOrigin, searchDestination, searchDate);
      setTrips(searchResults);
    } catch (error) {
      console.error('Error buscando viajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTrip = async (tripId, seats = 1) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para reservar un viaje');
      return;
    }

    try {
      const booking = await mockAPI.bookTrip(tripId, seats);
      alert(`¡Viaje reservado! ID de reserva: ${booking.id}`);
      // Actualizar la lista de viajes para reflejar los asientos disponibles
      loadTrips();
    } catch (error) {
      console.error('Error reservando viaje:', error);
      alert('Error al reservar el viaje');
    }
  };

  const clearSearch = () => {
    setSearchOrigin('');
    setSearchDestination('');
    setSearchDate('');
    loadTrips();
  };

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
        ) : trips.length === 0 ? (
          <div className="no-trips">No se encontraron viajes disponibles</div>
        ) : (
          <div className="trips-grid">
            {trips.map(trip => (
              <div key={trip.id} className="trip-card">
                <div className="trip-header">
                  <div className="route">
                    <span className="origin">{trip.origin}</span>
                    <span className="arrow">→</span>
                    <span className="destination">{trip.destination}</span>
                  </div>
                  <div className="price">€{trip.pricePerSeat}/persona</div>
                </div>
                
                <div className="trip-details">
                  <div className="datetime">
                    <span>📅 {trip.departureDate}</span>
                    <span>🕐 {trip.departureTime} - {trip.arrivalTime}</span>
                  </div>
                  
                  <div className="driver-info">
                    <img src={trip.driver.avatar} alt={trip.driver.name} className="driver-avatar" />
                    <div>
                      <div className="driver-name">{trip.driver.name}</div>
                      <div className="driver-rating">⭐ {trip.driver.rating}</div>
                    </div>
                  </div>
                  
                  <div className="vehicle-info">
                    <span>🚗 {trip.vehicle.brand} {trip.vehicle.model} ({trip.vehicle.color})</span>
                  </div>
                  
                  <div className="amenities">
                    {trip.amenities.map((amenity, index) => (
                      <span key={index} className="amenity">{amenity}</span>
                    ))}
                  </div>
                  
                  <div className="seats-info">
                    <span>💺 {trip.availableSeats} asientos disponibles</span>
                  </div>
                </div>
                
                <div className="trip-actions">
                  <button 
                    onClick={() => handleBookTrip(trip.id)}
                    className="book-btn"
                    disabled={trip.availableSeats === 0}
                  >
                    {trip.availableSeats === 0 ? 'Sin asientos' : 'Reservar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}