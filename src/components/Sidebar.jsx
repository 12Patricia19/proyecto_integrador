import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiMenu, FiHome, FiInfo, FiGrid, FiSettings
} from "react-icons/fi";
import "./Sidebar.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
      <div className="sidebar-top">
        <button className="sidebar-logo" aria-label="toggle menu" onClick={() => setCollapsed(!collapsed)}>
          <FiMenu />
        </button>
        {!collapsed && <span className="sidebar-title">Arai Sotalin PRACTICO</span>}
      </div>
      <nav className="sidebar-content">
        <NavLink to="/" end className="sidebar-link">
          <FiHome />
          {!collapsed && <span>Home</span>}
        </NavLink>
        <NavLink to="/about" className="sidebar-link">
          <FiInfo />
          {!collapsed && <span>Acerca de</span>}
        </NavLink>
        <NavLink to="/dashboard" className="sidebar-link">
          <FiGrid />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/settings" className="sidebar-link">
          <FiSettings />
          {!collapsed && <span>Configuración</span>}
        </NavLink>
      </nav>
    </aside>
  );
}