import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import '../styles/not-found.css';

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="not-found-container">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </>
  );
};

export default NotFound;