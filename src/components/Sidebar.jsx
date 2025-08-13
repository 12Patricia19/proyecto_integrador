import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiMenu, FiHome, FiGrid, FiSettings, FiLogIn, FiUser
} from "react-icons/fi";
import { useAuth } from '../context/AuthContext';
import "./Sidebar.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, user } = useAuth();

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
          <img src={user.avatar} alt={user.name} className="user-avatar" />
          <div className="user-details">
            <div className="user-name">{user.name}</div>
            <div className="user-rating">⭐ {user.rating}</div>
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
            <NavLink to="/dashboard" className="sidebar-link">
              <FiGrid />
              {!collapsed && <span>Mi Dashboard</span>}
            </NavLink>
            <NavLink to="/settings" className="sidebar-link">
              <FiSettings />
              {!collapsed && <span>Configuración</span>}
            </NavLink>
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