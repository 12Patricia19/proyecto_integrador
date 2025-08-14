import React, { useState } from 'react';
import api from '../data/api';
import './UserSingle.css';

export default function UserSingle() {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setUserId(e.target.value);
  };

  const handleSearch = async e => {
    e.preventDefault();
    setError('');
    setUser(null);
    setLoading(true);
    try {
      const data = await api.getUserById(userId);
      if (data && data._id) {
        setUser(data);
      } else {
        setError('Usuario no encontrado');
      }
    } catch (err) {
      setError('Error buscando usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-single-container">
      <h2>Buscar Usuario por ID</h2>
      <form className="user-search-form" onSubmit={handleSearch}>
        <input
          type="text"
          value={userId}
          onChange={handleChange}
          placeholder="ID de usuario (MongoId)"
          required
        />
        <button type="submit">Buscar</button>
      </form>
      {loading && <div>Buscando...</div>}
      {error && <div className="error">{error}</div>}
      {user && (
        <div className="user-card">
          <div><b>ID:</b> {user._id}</div>
          <div><b>Nombres:</b> {user.nombres}</div>
          <div><b>Apellidos:</b> {user.apellidos}</div>
          <div><b>Email:</b> {user.email}</div>
          <div><b>Rol:</b> {user.rol}</div>
        </div>
      )}
    </div>
  );
}
