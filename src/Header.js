import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaHome,
  FaFilm,
  FaTv,
  FaSearch,
  FaHeart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "./Header.css";

const navItems = [
  { to: "/", label: "Home", icon: <FaHome /> },
  { to: "/movies", label: "Movies", icon: <FaFilm /> },
  { to: "/tvshows", label: "Shows", icon: <FaTv /> },
  { to: "/search", label: "Search", icon: <FaSearch /> },
  { to: "/mylist", label: "My List", icon: <FaHeart /> },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <header className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <nav className="sidebar-nav" role="navigation" aria-label="Main menu">
          <Link to="/" className="logo-link">
            <img
              src="/popcorntimelogo.png"
              alt="Popcorn Time Logo"
              className="logo"
            />
          </Link>

          <ul className="nav-list">
            {navItems.map(({ to, label, icon }) => (
              <li key={to} className="nav-item">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={() => setIsOpen(false)} // Close after click
                >
                  <span className="nav-icon">{icon}</span>
                  <span className="nav-label">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
