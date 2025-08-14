import React, { useEffect, useState } from 'react';
import api from '../data/api';
import './TripAdmin.css';

export default function TripAdmin() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    origen: '',
    destino: '',
    fechaHoraSalida: '',
    cupos: 1,
    creador: '',
    estado: 'disponible',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const data = await api.getAllTrips();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error cargando viajes');
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
        await api.updateTrip(editingId, form);
      } else {
        await api.createTrip(form);
      }
      setForm({ origen: '', destino: '', fechaHoraSalida: '', cupos: 1, creador: '', estado: 'disponible' });
      setEditingId(null);
      fetchTrips();
    } catch (err) {
      setError('Error guardando viaje');
    }
  };

  const handleEdit = trip => {
    setForm({
      origen: trip.origen,
      destino: trip.destino,
      fechaHoraSalida: trip.fechaHoraSalida ? trip.fechaHoraSalida.slice(0, 16) : '',
      cupos: trip.cupos,
      creador: trip.creador,
      estado: trip.estado || 'disponible',
    });
    setEditingId(trip._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar viaje?')) return;
    try {
      await api.deleteTrip(id);
      fetchTrips();
    } catch (err) {
      setError('Error eliminando viaje');
    }
  };

  return (
    <div className="trip-admin-container">
      <h2>Administración de Viajes</h2>
      <form className="trip-form" onSubmit={handleSubmit}>
        <input name="origen" value={form.origen} onChange={handleChange} placeholder="Origen" required />
        <input name="destino" value={form.destino} onChange={handleChange} placeholder="Destino" required />
        <input name="fechaHoraSalida" value={form.fechaHoraSalida} onChange={handleChange} type="datetime-local" required />
        <input name="cupos" value={form.cupos} onChange={handleChange} type="number" min={1} placeholder="Cupos" required />
        <input name="creador" value={form.creador} onChange={handleChange} placeholder="ID Creador" required />
        <select name="estado" value={form.estado} onChange={handleChange}>
          <option value="disponible">Disponible</option>
          <option value="lleno">Lleno</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <button type="submit">{editingId ? 'Actualizar' : 'Crear'} Viaje</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ origen: '', destino: '', fechaHoraSalida: '', cupos: 1, creador: '', estado: 'disponible' }); }}>Cancelar</button>}
      </form>
      {error && <div className="error">{error}</div>}
      <hr />
      {loading ? <div>Cargando viajes...</div> : (
        <table className="trip-table">
          <thead>
            <tr>
              <th>Origen</th>
              <th>Destino</th>
              <th>Fecha/Hora Salida</th>
              <th>Cupos</th>
              <th>Creador</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {trips.map(trip => (
              <tr key={trip._id}>
                <td>{trip.origen}</td>
                <td>{trip.destino}</td>
                <td>{trip.fechaHoraSalida ? new Date(trip.fechaHoraSalida).toLocaleString() : ''}</td>
                <td>{trip.cupos}</td>
                <td>{
                  typeof trip.creador === 'object'
                    ? trip.creador.email || trip.creador.nombres || trip.creador._id
                    : trip.creador
                }</td>
                <td>{trip.estado}</td>
                <td>
                  <button onClick={() => handleEdit(trip)}>Editar</button>
                  <button onClick={() => handleDelete(trip._id)} className="delete">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
