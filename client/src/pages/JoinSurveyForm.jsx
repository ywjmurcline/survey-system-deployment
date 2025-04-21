import React, { useState } from 'react';
import axios from 'axios';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../styles/join-survey.css';
import Navbar from '../components/common/Navbar';

const JoinSurveyForm = () => {
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!code) {
      setError('Please enter a survey code');
      setLoading(false);
      return;
    }
    
    try {
      const response = await API.post('/join', {
        code,
        nickname
      });
      
      navigate(`/survey/${response.data.surveyId}`, { 
        state: { 
          participantId: response.data.participantId,
          nickname: nickname || 'Anonymous'
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join survey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="join-container">
        <div className="join-card">
          <h1>Join Survey</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="code">Enter Survey Code</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                autoComplete="off"
                autoCapitalize="characters"
                maxLength="6"
              />
            </div>
            <div className="form-group">
              <label htmlFor="nickname">Your Nickname</label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
                autoComplete="off"
                maxLength="20"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Joining...' : 'Join'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default JoinSurveyForm;