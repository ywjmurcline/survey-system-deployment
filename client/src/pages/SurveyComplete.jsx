import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/survey-complete.css';

const SurveyComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="survey-complete-container">
      <div className="survey-complete-card">
        <h1>Thank You!</h1>
        <p>Your responses have been submitted successfully.</p>
        <button 
          onClick={() => navigate('/')} 
          className="btn-primary"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default SurveyComplete;