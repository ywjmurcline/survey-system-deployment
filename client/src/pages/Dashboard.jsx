import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import SurveyCard from '../components/common/SurveyCard';
import API from '../utils/api';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Use currentUser to verify authentication
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log('Fetching surveys with token:', token ? 'Token exists' : 'No token');

        const response = await API.get('/surveys', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Surveys fetched:', response.data);
        setSurveys(response.data);
      } catch (err) {
        console.error('Survey fetch error details:', err.response?.data || err.message);
        setError(`Failed to fetch surveys: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [currentUser, navigate]);

  const handleCreateNew = () => {
    navigate('/create');
  };

  const handlePresentSurvey = (surveyId) => {
    navigate(`/present/${surveyId}`);
  };

  const handleEditSurvey = (surveyId) => {
    navigate(`/edit/${surveyId}`);
  };

  const handleDeleteSurvey = async (surveyId) => {
    if (!window.confirm('Are you sure you want to delete this survey?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await API.delete(`/surveys/${surveyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove from state
      setSurveys(surveys.filter(survey => survey._id !== surveyId));
    } catch (err) {
      setError('Failed to delete survey');
      console.error(err);
    }
  };

  // Add the new handleActivateSurvey function
  const handleActivateSurvey = async (surveyId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await API.patch(
        `/surveys/${surveyId}/activate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the surveys state to show the survey is now active
      setSurveys(surveys.map(survey =>
        survey._id === surveyId
          ? { ...survey, isActive: true }
          : survey
      ));

      // Show success message
      alert(`Survey activated! Code: ${response.data.survey.code}`);
    } catch (error) {
      console.error('Error activating survey:', error);
      setError('Failed to activate survey');
    }
  };

  // Add the new handleDeactivateSurvey function
  const handleDeactivateSurvey = async (surveyId) => {
    try {
      const response = await API.patch(`/surveys/${surveyId}/deactivate`);
      
      // Only update UI if the API call succeeds
      setSurveys(surveys.map(survey => 
        survey._id === surveyId 
          ? { ...survey, isActive: false } 
          : survey
      ));
      
      console.log('Survey deactivated:', response.data);
    } catch (error) {
      console.error('Deactivation error details:', error);
      // Show detailed error if available
      const errorMessage = error.response?.data?.message || 'Failed to deactivate survey';
      alert(`Error: ${errorMessage}`);
    }
  };

  // Add the new handleStatusChange function
  const handleStatusChange = (surveyId, isActive) => {
    setSurveys(surveys.map(survey =>
      survey._id === surveyId
        ? { ...survey, isActive }
        : survey
    ));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading your surveys...</div>
      </>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Your Surveys</h1>
          <button className="btn-primary create-btn" onClick={handleCreateNew}>
            Create New Survey
          </button>
        </div>

        {location.state?.message && (
          <div className="success-message">{location.state.message}</div>
        )}

        {error && <div className="error-message">{error}</div>}

        {surveys.length === 0 ? (
          <div className="empty-state">
            <h2>No surveys yet</h2>
            <p>Create your first survey to get started!</p>
            <button className="btn-primary" onClick={handleCreateNew}>
              Create Your First Survey
            </button>
          </div>
        ) : (
          <div className="surveys-grid">
            {surveys.map(survey => (
              <SurveyCard
                key={survey._id}
                survey={survey}
                onPresent={() => handlePresentSurvey(survey._id)}
                onEdit={() => handleEditSurvey(survey._id)}
                onDelete={() => handleDeleteSurvey(survey._id)}
                onActivate={() => handleActivateSurvey(survey._id)}
                onDeactivate={() => handleDeactivateSurvey(survey._id)}
                onStatusChange={(isActive) => handleStatusChange(survey._id, isActive)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;