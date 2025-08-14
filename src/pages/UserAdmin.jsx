import React, { useEffect, useState } from 'react';
import api from '../data/api';
import './UserAdmin.css';

export default function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    rol: 'estudiante',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.updateUser(editingId, form);
      } else {
        await api.createUser(form);
      }
      setForm({ nombres: '', apellidos: '', email: '', password: '', rol: 'estudiante' });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setError('Error guardando usuario');
    }
  };

  const handleEdit = user => {
    setForm({
      nombres: user.nombres,
      apellidos: user.apellidos,
      email: user.email,
      password: '',
      rol: user.rol || 'estudiante',
    });
    setEditingId(user._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    try {
      await api.deleteUser(id);
      fetchUsers();
    } catch (err) {
      setError('Error eliminando usuario');
    }
  };

  return (
    <div className="user-admin-container">
      <h2>Administración de Usuarios</h2>
      <form className="user-form" onSubmit={handleSubmit}>
        <input name="nombres" value={form.nombres} onChange={handleChange} placeholder="Nombres" required />
        <input name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Apellidos" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Contraseña" type="password" required={!editingId} minLength={6} />
        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="estudiante">Estudiante</option>
          <option value="docente">Docente</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">{editingId ? 'Actualizar' : 'Crear'} Usuario</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ nombres: '', apellidos: '', email: '', password: '', rol: 'estudiante' }); }}>Cancelar</button>}
      </form>
      {error && <div className="error">{error}</div>}
      <hr />
      {loading ? <div>Cargando usuarios...</div> : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.nombres}</td>
                <td>{user.apellidos}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Editar</button>
                  <button onClick={() => handleDelete(user._id)} className="delete">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
