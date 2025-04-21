import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import '../styles/account-created.css';

const AccountCreated = () => {
  return (
    <div className="page-container">
      <Navbar />
      
      <div className="account-created-container">
        <div className="success-card">
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#4ADE80"/>
              <path d="M20 32L28 40L44 24" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1>Account Created!</h1>
          <p>Your account has been successfully created. You can now create and manage your surveys.</p>
          
          <div className="action-buttons">
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
            <Link to="/create" className="btn-secondary">
              Create Your First Survey
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCreated;