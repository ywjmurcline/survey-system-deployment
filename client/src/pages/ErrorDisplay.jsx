import React from 'react';

const ErrorDisplay = ({ message, buttonText, onButtonClick }) => {
  return (
    <div className="error-container">
      <div className="error-card">
        <h2>Error</h2>
        <p>{message}</p>
        {buttonText && onButtonClick && (
          <button className="btn-primary" onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;