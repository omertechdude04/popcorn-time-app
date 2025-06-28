import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaFilm, FaTv, FaSearch } from "react-icons/fa";
import "./Header.css";
import { Link } from "react-router-dom";


export default function Header() {
  return (
    <header>
      <div className="menu-container">
      <Link to="/">
        <img src="/popcorntimelogo.png" alt="Popcorn Time Logo" />
      </Link>
        <ul className="menu-content">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              <FaHome className="nav-icon" /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/movies" className={({ isActive }) => isActive ? "active" : ""}>
              <FaFilm className="nav-icon" /> Movies
            </NavLink>
          </li>
          <li>
            <NavLink to="/tvshows" className={({ isActive }) => isActive ? "active" : ""}>
              <FaTv className="nav-icon" /> Shows
            </NavLink>
          </li>
          <li>
            <NavLink to="/search" className={({ isActive }) => isActive ? "active" : ""}>
              <FaSearch className="nav-icon" /> Search
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
}
