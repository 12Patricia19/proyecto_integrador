import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchTrips } from '../data/api';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Search form state
  const [searchForm, setSearchForm] = useState({
    origen: '',
    destino: '',
    fecha: '',
    asientos: 1
  });
  
  // Trips state
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Load recent trips on component mount
  useEffect(() => {
    loadRecentTrips();
  }, []);

  const loadRecentTrips = async () => {
    try {
      setLoading(true);
      const response = await searchTrips({});
      setTrips(response.trips || []);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSearchPerformed(true);
      const response = await searchTrips(searchForm);
      setTrips(response.trips || []);
    } catch (error) {
      console.error('Error searching trips:', error);
      alert('Error al buscar viajes. Por favor intenta de nuevo.');
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

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>PUCE CarShare</h1>
          <p>Conecta con la comunidad PUCE para compartir viajes de manera segura y económica</p>
          
          {!user && (
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
              <Link to="/register" className="btn btn-secondary">Registrarse</Link>
            </div>
          )}
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <h2>Buscar Viajes</h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="origen">Origen</label>
                <input
                  type="text"
                  id="origen"
                  name="origen"
                  value={searchForm.origen}
                  onChange={handleSearchChange}
                  placeholder="¿Desde dónde viajas?"
                  list="ubicaciones"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="destino">Destino</label>
                <input
                  type="text"
                  id="destino"
                  name="destino"
                  value={searchForm.destino}
                  onChange={handleSearchChange}
                  placeholder="¿A dónde vas?"
                  list="ubicaciones"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fecha">Fecha</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={searchForm.fecha}
                  onChange={handleSearchChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="asientos">Asientos</label>
                <select
                  id="asientos"
                  name="asientos"
                  value={searchForm.asientos}
                  onChange={handleSearchChange}
                >
                  <option value={1}>1 asiento</option>
                  <option value={2}>2 asientos</option>
                  <option value={3}>3 asientos</option>
                  <option value={4}>4 asientos</option>
                  <option value={5}>5+ asientos</option>
                </select>
              </div>
              
              <button type="submit" className="btn btn-search" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </form>

          {/* Location suggestions datalist */}
          <datalist id="ubicaciones">
            <option value="PUCE - Campus Quito" />
            <option value="Centro Histórico" />
            <option value="La Carolina" />
            <option value="Cumbayá" />
            <option value="Valle de los Chillos" />
            <option value="Norte de Quito" />
            <option value="Sur de Quito" />
            <option value="Aeropuerto Mariscal Sucre" />
            <option value="Terminal Terrestre Quitumbe" />
            <option value="Terminal Terrestre Carcelén" />
          </datalist>
        </div>
      </section>

      {/* Results Section */}
      <section className="results-section">
        <div className="results-container">
          <div className="results-header">
            <h2>
              {searchPerformed 
                ? `Resultados de búsqueda (${trips.length})` 
                : `Viajes recientes (${trips.length})`
              }
            </h2>
            
            {searchPerformed && (
              <button 
                onClick={() => {
                  setSearchPerformed(false);
                  loadRecentTrips();
                  setSearchForm({ origen: '', destino: '', fecha: '', asientos: 1 });
                }}
                className="btn btn-secondary"
              >
                Ver todos los viajes
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="loading">
              <p>Cargando viajes...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="no-results">
              <p>
                {searchPerformed 
                  ? 'No se encontraron viajes que coincidan con tu búsqueda.' 
                  : 'No hay viajes disponibles en este momento.'
                }
              </p>
              {user && (
                <Link to="/create-trip" className="btn btn-primary">
                  ¡Sé el primero en ofrecer un viaje!
                </Link>
              )}
            </div>
          ) : (
            <div className="trips-grid">
              {trips.map((trip) => (
                <div key={trip._id} className="trip-card">
                  <div className="trip-header">
                    <div className="trip-route">
                      <span className="origin">{trip.origen?.direccion || trip.origen}</span>
                      <span className="arrow">→</span>
                      <span className="destination">{trip.destino?.direccion || trip.destino}</span>
                    </div>
                    <div className="trip-price">${trip.costo}</div>
                  </div>
                  
                  <div className="trip-details">
                    <div className="trip-datetime">
                      <span className="date">{formatDate(trip.fechaHoraSalida)}</span>
                      <span className="time">{formatTime(trip.fechaHoraSalida)}</span>
                    </div>
                    
                    <div className="trip-seats">
                      <span className="seats-available">
                        {trip.cupos - trip.cuposOcupados} asientos disponibles
                      </span>
                    </div>
                  </div>
                  
                  <div className="trip-driver">
                    <div className="driver-info">
                      <span className="driver-name">{trip.creador?.nombre}</span>
                      {trip.creador?.calificacion && (
                        <div className="driver-rating">
                          ⭐ {trip.creador.calificacion.toFixed(1)}
                        </div>
                      )}
                    </div>
                    
                    {trip.creador?.vehiculo && (
                      <div className="vehicle-info">
                        {trip.creador.vehiculo.marca} {trip.creador.vehiculo.modelo} - {trip.creador.vehiculo.color}
                      </div>
                    )}
                  </div>
                  
                  <div className="trip-actions">
                    <Link 
                      to={`/trip/${trip._id}`} 
                      className="btn btn-outline"
                    >
                      Ver detalles
                    </Link>
                    
                    {user && trip.creador?._id !== user.id && (trip.cupos - trip.cuposOcupados) > 0 && (
                      <Link 
                        to={`/trip/${trip._id}`}
                        className="btn btn-primary"
                      >
                        Solicitar unirse
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
