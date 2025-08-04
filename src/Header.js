import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FaHome, FaFilm, FaTv, FaSearch, FaHeart } from "react-icons/fa";
import "./Header.css";

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
          <li>
            <NavLink to="/mylist" className={({ isActive }) => isActive ? "active" : ""}>
              <FaHeart className="nav-icon" /> My List
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
}
