import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

export default function Settings() {
  const { user, logout, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notifications: true,
    shareData: false,
    autoBook: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    alert('Configuración guardada exitosamente');
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="settings-container">
        <div className="auth-required">
          <h2>🔒 Acceso Requerido</h2>
          <p>Debes iniciar sesión para acceder a la configuración</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>⚙️ Configuración</h1>
        <p>Personaliza tu experiencia de viajes compartidos</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2>👤 Información Personal</h2>
          <div className="form-group">
            <label htmlFor="name">Nombre completo:</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Teléfono:</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>🔔 Notificaciones</h2>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Recibir notificaciones por email
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>🔒 Privacidad</h2>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="shareData"
                checked={formData.shareData}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Compartir datos para mejorar el servicio
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>🚗 Preferencias de Viaje</h2>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="autoBook"
                checked={formData.autoBook}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Reserva automática para rutas frecuentes
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>📊 Estadísticas de Usuario</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Viajes completados:</span>
              <span className="stat-value">{user.tripsCompleted}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Calificación promedio:</span>
              <span className="stat-value">⭐ {user.rating}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Miembro desde:</span>
              <span className="stat-value">{user.memberSince}</span>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button onClick={handleSave} className="save-btn">
            💾 Guardar Cambios
          </button>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}