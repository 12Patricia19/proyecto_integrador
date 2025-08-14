
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiHome, FiGrid, FiSettings, FiLogIn, FiUser } from "react-icons/fi";
import { useAuth } from '../context/AuthContext';
import "./Sidebar.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
      <div className="sidebar-top">
        <button className="sidebar-logo" aria-label="toggle menu" onClick={() => setCollapsed(!collapsed)}>
          <FiMenu />
        </button>
        {!collapsed && <span className="sidebar-title">🚗 Viajes Compartidos</span>}
      </div>
      {isAuthenticated && !collapsed && (
        <div className="user-info">
          <div className="user-details">
            <div className="user-name">{user.nombres} {user.apellidos}</div>
            <div className="user-email">{user.email}</div>
            <div className="user-rol">Rol: {user.rol}</div>
          </div>
        </div>
      )}
      <nav className="sidebar-content">
        <NavLink to="/" end className="sidebar-link">
          <FiHome />
          {!collapsed && <span>Viajes Disponibles</span>}
        </NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/settings" className="sidebar-link">
              <FiSettings />
              {!collapsed && <span>Configuración</span>}
            </NavLink>
            <NavLink to="/admin/users" className="sidebar-link">
              <FiUser />
              {!collapsed && <span>Usuarios</span>}
            </NavLink>
            <NavLink to="/admin/trips" className="sidebar-link">
              <FiGrid />
              {!collapsed && <span>Viajes</span>}
            </NavLink>
            <NavLink to="/admin/user" className="sidebar-link">
              <FiUser />
              {!collapsed && <span>Buscar Usuario</span>}
            </NavLink>
            <button
              className="sidebar-link logout-btn"
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginTop: '1rem' }}
              onClick={() => { logout(); navigate('/login'); }}
            >
              <FiLogIn style={{ transform: 'rotate(180deg)' }} />
              {!collapsed && <span>Cerrar Sesión</span>}
            </button>
          </>
        ) : (
          <NavLink to="/login" className="sidebar-link">
            <FiLogIn />
            {!collapsed && <span>Iniciar Sesión</span>}
          </NavLink>
        )}
      </nav>
    </aside>
  );
}