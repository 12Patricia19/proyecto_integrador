import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

export default function Settings() {
  const { user, logout, isAuthenticated } = useAuth();

  console.log(user);
  
  const [formData, setFormData] = useState({
    id: user?.id || user?._id || '',
    nombres: user?.nombres || '',
    apellidos: user?.apellidos || '',
    email: user?.email || '',
    rol: user?.rol || '',
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
            <label htmlFor="id">ID:</label>
            <input
              id="id"
              name="id"
              type="text"
              value={formData.id}
              className="form-input"
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="nombres">Nombres:</label>
            <input
              id="nombres"
              name="nombres"
              type="text"
              value={formData.nombres}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellidos">Apellidos:</label>
            <input
              id="apellidos"
              name="apellidos"
              type="text"
              value={formData.apellidos}
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
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="rol">Rol:</label>
            <input
              id="rol"
              name="rol"
              type="text"
              value={formData.rol}
              className="form-input"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}