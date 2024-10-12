import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'; // Import the CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/home" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/receivedRequests" className="nav-link">
              Received Requests
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
