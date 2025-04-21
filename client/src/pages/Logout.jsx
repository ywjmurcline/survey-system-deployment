import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import '../styles/logout.css';

const Logout = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to homepage after logout
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="logout-container">
      <Navbar />
      
      <div className="logout-content">
        <div className="logout-card">
          <h1>Account Settings</h1>
          
          <div className="user-profile">
            <div className="user-avatar large">
              <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?'}</span>
            </div>
            <div className="user-details">
              <h2>{currentUser.name || 'User'}</h2>
              <p>{currentUser.email}</p>
            </div>
          </div>
          
          <div className="account-actions">
            <Link to="/dashboard" className="btn-secondary">
              Back to Dashboard
            </Link>
            <button onClick={handleLogout} className="btn-danger">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;