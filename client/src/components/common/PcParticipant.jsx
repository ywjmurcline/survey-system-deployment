import React, { useState } from "react";

const PcParticipant = ({ className, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className={`PC-participant ${isHovered ? 'variant-2' : 'default'} ${className || ""}`}
      onMouseLeave={() => setIsHovered(false)}
      onMouseEnter={() => setIsHovered(true)}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label="Join as participant"
      onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') onClick()}}
    >
      <div className="frame">
        <div className="overlap">
          <div className="overlap-group">
            {/* <img
              className="subtract"
              alt="Participant"
              src={isHovered ? "/participant-hover.svg" : "/participant-default.svg"}
            /> */}
            <div className="ellipse"></div>
            {!isHovered && <div className="rectangle"></div>}
          </div>
          <div className="div"></div>
          {isHovered && <div className="rectangle-2"></div>}
        </div>
      </div>
      <div className="join-as-a">
        Join as a<br />
        Participant
      </div>
    </div>
  );
};

export default PcParticipant;