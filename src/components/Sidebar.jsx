import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🚗 PUCE CarShare</h2>
        {user && (
          <div className="user-info">
            <span>{user.nombres || user.name || 'Usuario'}</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={isActive('/')}>
              <span className="icon">🏠</span>
              Inicio
            </Link>
          </li>
          
          <li>
            <Link to="/create-trip" className={isActive('/create-trip')}>
              <span className="icon">✈️</span>
              Crear Viaje
            </Link>
          </li>

          <li>
            <Link to="/my-trips" className={isActive('/my-trips')}>
              <span className="icon">🚗</span>
              Mis Viajes
            </Link>
          </li>

          <li>
            <Link to="/my-requests" className={isActive('/my-requests')}>
              <span className="icon">�</span>
              Mis Solicitudes
            </Link>
          </li>

          <li>
            <Link to="/settings" className={isActive('/settings')}>
              <span className="icon">⚙️</span>
              Configuración
            </Link>
          </li>
        </ul>
      </nav>

      {user && (
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="icon">🚪</span>
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;