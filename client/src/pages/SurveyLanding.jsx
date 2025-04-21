import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import PcSurveyButton from '../components/common/PcSurveyButton';
import PcParticipant from '../components/common/PcParticipant';
import '../styles/survey-landing.css';

const SurveyLanding = () => {
  const navigate = useNavigate();
  
  const handleCreateSurvey = () => {
    navigate('/login'); // Redirect to login before creating
  };
  
  const handleJoinSurvey = () => {
    navigate('/join/code'); // Navigate to the code entry page
  };
  
  return (
    <div className="admin-usertype">
      <Navbar />
      
      <div className="frame-2">
        <PcSurveyButton 
          className="PC-survey-button-instance" 
          onClick={handleCreateSurvey}
        />
        <PcParticipant 
          onClick={handleJoinSurvey}
        />
      </div>
    </div>
  );
};

export default SurveyLanding;