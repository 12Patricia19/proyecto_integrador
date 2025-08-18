import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../data/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    tieneVehiculo: false,
    // Datos del vehículo (opcionales)
    vehiculo: {
      marca: '',
      modelo: '',
      color: '',
      placa: '',
      anio: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Para formulario multi-paso

  // Validación de email PUCE
  const validatePuceEmail = (email) => {
    const puceEmailRegex = /^[a-zA-Z0-9._%+-]+@puce\.edu\.ec$/;
    return puceEmailRegex.test(email);
  };

  // Validación de placa ecuatoriana
  const validatePlate = (placa) => {
    const plateRegex = /^[A-Z]{3}-\d{3,4}$/;
    return plateRegex.test(placa);
  };

  // Validación de teléfono ecuatoriano
  const validatePhone = (telefono) => {
    const phoneRegex = /^(\+593|0)(9[0-9]{8}|[2-7][0-9]{7})$/;
    return phoneRegex.test(telefono);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones básicas
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validatePuceEmail(formData.email)) {
      newErrors.email = 'Debe usar un email institucional de PUCE (@puce.edu.ec)';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!validatePhone(formData.telefono)) {
      newErrors.telefono = 'Formato de teléfono inválido (ej: 0987654321 o +593987654321)';
    }

    // Validaciones del vehículo si tiene vehículo
    if (formData.tieneVehiculo) {
      if (!formData.vehiculo.marca.trim()) newErrors.vehiculoMarca = 'La marca es requerida';
      if (!formData.vehiculo.modelo.trim()) newErrors.vehiculoModelo = 'El modelo es requerido';
      if (!formData.vehiculo.color.trim()) newErrors.vehiculoColor = 'El color es requerido';
      
      if (!formData.vehiculo.placa.trim()) {
        newErrors.vehiculoPlaca = 'La placa es requerida';
      } else if (!validatePlate(formData.vehiculo.placa.toUpperCase())) {
        newErrors.vehiculoPlaca = 'Formato de placa inválido (ej: ABC-1234)';
      }

      const currentYear = new Date().getFullYear();
      const year = parseInt(formData.vehiculo.anio);
      if (!formData.vehiculo.anio) {
        newErrors.vehiculoAnio = 'El año es requerido';
      } else if (isNaN(year) || year < 1990 || year > currentYear) {
        newErrors.vehiculoAnio = `El año debe estar entre 1990 y ${currentYear}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('vehiculo.')) {
      const vehiculoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vehiculo: {
          ...prev.vehiculo,
          [vehiculoField]: value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNextStep = () => {
    // Validar solo los campos del paso 1
    const step1Errors = {};
    if (!formData.nombre.trim()) step1Errors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) step1Errors.apellido = 'El apellido es requerido';
    if (!formData.email.trim()) {
      step1Errors.email = 'El email es requerido';
    } else if (!validatePuceEmail(formData.email)) {
      step1Errors.email = 'Debe usar un email institucional de PUCE (@puce.edu.ec)';
    }
    if (!formData.password) {
      step1Errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      step1Errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      step1Errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!formData.telefono.trim()) {
      step1Errors.telefono = 'El teléfono es requerido';
    } else if (!validatePhone(formData.telefono)) {
      step1Errors.telefono = 'Formato de teléfono inválido';
    }

    setErrors(step1Errors);
    if (Object.keys(step1Errors).length === 0) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono,
        ...(formData.tieneVehiculo && {
          vehiculo: {
            marca: formData.vehiculo.marca,
            modelo: formData.vehiculo.modelo,
            color: formData.vehiculo.color,
            placa: formData.vehiculo.placa.toUpperCase(),
            anio: parseInt(formData.vehiculo.anio)
          }
        })
      };

      const response = await register(userData);
      
      if (response.success) {
        // Auto-login después del registro exitoso
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        setErrors({ submit: response.message || 'Error al registrar usuario' });
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setErrors({ submit: 'Error de conexión. Por favor intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Únete a PUCE CarShare</h1>
          <p>Conecta con la comunidad PUCE para compartir viajes</p>
        </div>

        {/* Indicador de pasos */}
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <label>Información Personal</label>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <label>Información del Vehículo</label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {step === 1 ? (
            // Paso 1: Información personal
            <div className="form-step">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={errors.nombre ? 'error' : ''}
                    placeholder="Tu nombre"
                  />
                  {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="apellido">Apellido *</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className={errors.apellido ? 'error' : ''}
                    placeholder="Tu apellido"
                  />
                  {errors.apellido && <span className="error-message">{errors.apellido}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Institucional PUCE *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="tu.nombre@puce.edu.ec"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
                <small className="form-hint">Solo se permiten emails institucionales de PUCE</small>
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={errors.telefono ? 'error' : ''}
                  placeholder="0987654321"
                />
                {errors.telefono && <span className="error-message">{errors.telefono}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Contraseña *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Repite tu contraseña"
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleNextStep} className="btn btn-primary">
                  Siguiente
                </button>
              </div>
            </div>
          ) : (
            // Paso 2: Información del vehículo
            <div className="form-step">
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="tieneVehiculo"
                    checked={formData.tieneVehiculo}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  Tengo vehículo propio
                </label>
                <small className="form-hint">
                  Si tienes vehículo, podrás ofrecer viajes a otros miembros de la comunidad PUCE
                </small>
              </div>

              {formData.tieneVehiculo && (
                <div className="vehicle-section">
                  <h3>Información del Vehículo</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="vehiculo.marca">Marca *</label>
                      <input
                        type="text"
                        name="vehiculo.marca"
                        value={formData.vehiculo.marca}
                        onChange={handleChange}
                        className={errors.vehiculoMarca ? 'error' : ''}
                        placeholder="Toyota, Chevrolet, etc."
                        list="marcas"
                      />
                      {errors.vehiculoMarca && <span className="error-message">{errors.vehiculoMarca}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="vehiculo.modelo">Modelo *</label>
                      <input
                        type="text"
                        name="vehiculo.modelo"
                        value={formData.vehiculo.modelo}
                        onChange={handleChange}
                        className={errors.vehiculoModelo ? 'error' : ''}
                        placeholder="Corolla, Aveo, etc."
                      />
                      {errors.vehiculoModelo && <span className="error-message">{errors.vehiculoModelo}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="vehiculo.color">Color *</label>
                      <input
                        type="text"
                        name="vehiculo.color"
                        value={formData.vehiculo.color}
                        onChange={handleChange}
                        className={errors.vehiculoColor ? 'error' : ''}
                        placeholder="Blanco, Negro, Rojo, etc."
                        list="colores"
                      />
                      {errors.vehiculoColor && <span className="error-message">{errors.vehiculoColor}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="vehiculo.anio">Año *</label>
                      <input
                        type="number"
                        name="vehiculo.anio"
                        value={formData.vehiculo.anio}
                        onChange={handleChange}
                        className={errors.vehiculoAnio ? 'error' : ''}
                        placeholder="2020"
                        min="1990"
                        max={new Date().getFullYear()}
                      />
                      {errors.vehiculoAnio && <span className="error-message">{errors.vehiculoAnio}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="vehiculo.placa">Placa *</label>
                    <input
                      type="text"
                      name="vehiculo.placa"
                      value={formData.vehiculo.placa}
                      onChange={handleChange}
                      className={errors.vehiculoPlaca ? 'error' : ''}
                      placeholder="ABC-1234"
                      style={{ textTransform: 'uppercase' }}
                    />
                    {errors.vehiculoPlaca && <span className="error-message">{errors.vehiculoPlaca}</span>}
                    <small className="form-hint">Formato: ABC-1234</small>
                  </div>
                </div>
              )}

              {errors.submit && (
                <div className="error-message submit-error">
                  {errors.submit}
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="btn btn-secondary"
                >
                  Anterior
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Crear Cuenta'}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="register-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>

        {/* Listas de opciones */}
        <datalist id="marcas">
          <option value="Toyota" />
          <option value="Chevrolet" />
          <option value="Hyundai" />
          <option value="Kia" />
          <option value="Nissan" />
          <option value="Mazda" />
          <option value="Ford" />
          <option value="Volkswagen" />
          <option value="Renault" />
          <option value="Suzuki" />
        </datalist>

        <datalist id="colores">
          <option value="Blanco" />
          <option value="Negro" />
          <option value="Gris" />
          <option value="Plata" />
          <option value="Rojo" />
          <option value="Azul" />
          <option value="Verde" />
          <option value="Amarillo" />
          <option value="Beige" />
          <option value="Café" />
        </datalist>
      </div>
    </div>
  );
};

export default Register;
