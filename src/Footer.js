import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaFilm, FaTv, FaSearch } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-credit">
        Made by{" "}
        <a href="https://www.omertechdude.com" target="_blank" rel="noopener noreferrer">
          Omer Tech Dude
        </a>
      </div>
    </footer>
  );
}
