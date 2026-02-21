import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        Home
      </NavLink>
      <NavLink
        to="/load-data"
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        Load Data
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        Settings
      </NavLink>
      <NavLink
        to="/portfolio"
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        Portfolio
      </NavLink>
      <NavLink
        to="/risk"
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        Risk
      </NavLink>
      <NavLink
        to="/results"
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        Results
      </NavLink>
    </nav>
  );
}
