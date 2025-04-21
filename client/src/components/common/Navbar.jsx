import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/navbar.css';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand-container">
          <Link to="/" className="navbar-brand">
            <h1>Quizlet</h1>
          </Link>
        </div>
        
        <div className="navbar-links">
          {currentUser ? (
            <>
              <Link 
                to="/join/code" 
                className={`navbar-link ${location.pathname.includes('/join') ? 'active' : ''}`}
              >
                Join Survey
              </Link>
              <Link 
                to="/dashboard" 
                className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link to="/logout" className="navbar-link account-link">
                <div className="user-avatar">
                  <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?'}</span>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/join/code" 
                className={`navbar-link ${location.pathname.includes('/join') ? 'active' : ''}`}
              >
                Join Survey
              </Link>
              <Link 
                to="/login" 
                className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="navbar-link btn-nav"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;