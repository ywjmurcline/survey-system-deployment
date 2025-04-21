import React from "react";

const PcSurveyButton = ({ className, onClick }) => {
  return (
    <div 
      className={`PC-survey-button ${className || ""}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label="Create new survey"
      onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') onClick()}}
    >
      <div className="create-new-survey">
        Create
        <br />
        New Survey
      </div>

      <div className="frame">
        <div className="div">
          <div className="rectangle"></div>
          <div className="rectangle-2"></div>
          <div className="rectangle-3"></div>
          <div className="rectangle-4"></div>
        </div>
      </div>
    </div>
  );
};

export default PcSurveyButton;