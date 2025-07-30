import React from "react";
import { NavLink } from "react-router-dom";
import "./Menu.css";

function Menu() {
  return (
    <nav className="menu">
      <NavLink to="/" end className="menu-link">
        Home
      </NavLink>
      <NavLink to="/about" className="menu-link">
        Acerca de
      </NavLink>
      <NavLink to="/dashboard" className="menu-link">
        Dashboard
      </NavLink>
      <NavLink to="/settings" className="menu-link">
        Configuración
      </NavLink>
    </nav>
  );
}

export default Menu;