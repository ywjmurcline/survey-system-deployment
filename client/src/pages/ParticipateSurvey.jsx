import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import '../styles/participate-survey.css';

const ParticipateSurvey = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  
  // Get participant data from location state
  const participantId = location.state?.participantId;
  const nickname = location.state?.nickname || 'Anonymous';
  
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await API.get(`/join/survey/${id}`);
        console.log("API Response:", response.data);
        console.log("Questions:", response.data.questions);
        setSurvey(response.data);
        
        // Initialize answers object
        const initialAnswers = {};
        response.data.questions.forEach(q => {
          initialAnswers[q._id] = q.type === 'multiple-choice' ? '' : '';
        });
        setAnswers(initialAnswers);
      } catch (err) {
        console.error('Error fetching survey:', err);
        setError(err.response?.data?.message || 'Survey not found or has expired');
      } finally {
        setLoading(false);
      }
    };
    
    if (!participantId) {
      // Redirect if no participant ID (direct URL access)
      navigate('/join');
      return;
    }
    
    fetchSurvey();
  }, [id, participantId, navigate]);
  
// Complete the handleSubmit function
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Submit answers
      await API.post(`/join/submit/${id}`, {
        participantId,
        answers
      });
      
      // Navigate to completion page
      navigate('/survey/complete', {
        state: {
          returnToHome: true
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit survey');
    } finally {
      setLoading(false);
    }
  };
  
if (loading) return <div className="loading">Loading survey...</div>;
if (error) return <div className="error">{error}</div>;
if (!survey) return <div className="error">Survey not found</div>;

return (
  <div className="participate-survey-container">
    <h1>{survey.title}</h1>
    {survey.description && <p className="survey-description">{survey.description}</p>}
    
    <form onSubmit={handleSubmit}>
        {survey.questions && survey.questions.map((question) => (
        <div key={question._id} className="question-card">
            <h3>{question.title || question.text}</h3>
            
            {/* Multiple choice question */}
            {(question.type === 'multiple-choice' || question.type === 'multiple_choice' || question.type === 'mc') && (
            <div className="options-container">
                {/* Debug display */}
                {!question.options && <p className="error-text">No options available for this question</p>}
                
                {/* Make sure we handle both formats of options */}
                {(question.options || []).map((option, i) => (
                <div key={i} className="option">
                    <label>
                    <input
                        type="radio"
                        name={question._id}
                        value={typeof option === 'string' ? option : (option.text || option.value || '')}
                        checked={answers[question._id] === (typeof option === 'string' ? option : (option.text || option.value || ''))}
                        onChange={() => setAnswers({
                        ...answers, 
                        [question._id]: typeof option === 'string' ? option : (option.text || option.value || '')
                        })}
                    />
                    <span>{typeof option === 'string' ? option : (option.text || option.value || '')}</span>
                    </label>
                </div>
                ))}
            </div>
            )}

            {/* Word cloud question */}
            {(question.type === 'word-cloud' || question.type === 'wordcloud') && (
            <div className="word-cloud-input">
                <input
                type="text"
                value={answers[question._id] || ''}
                onChange={(e) => setAnswers({
                    ...answers,
                    [question._id]: e.target.value
                })}
                maxLength={question.maxWords ? question.maxWords * 15 : 50}
                placeholder="Type your response here"
                />
                <p className="word-limit">Max words: {question.maxWords || 1}</p>
            </div>
            )}

            {/* Scale question */}
            {(question.type === 'scale') && (
            <div className="scale-container">
                <div className="scale-labels">
                <span>{question.minLabel || '1'}</span>
                <span>{question.maxLabel || '5'}</span>
                </div>
                <input
                type="range"
                min={question.minValue || 1}
                max={question.maxValue || 5}
                value={answers[question._id] || '3'}
                onChange={(e) => setAnswers({...answers, [question._id]: e.target.value})}
                />
            </div>
            )}

            {/* Instruction question type */}
            {(question.type === 'instruction') && (
            <div className="instruction-container">
                <div className="instruction-content">
                {question.content || question.instruction}
                </div>
            </div>
            )}

            {/* Add a fallback for unrecognized question types */}
            {(!question.type || 
            (question.type !== 'multiple-choice' && 
            question.type !== 'multiple_choice' && 
            question.type !== 'mc' &&
            question.type !== 'word-cloud' &&
            question.type !== 'wordcloud' &&
            question.type !== 'instruction' &&
            question.type !== 'scale')) && (
            <div className="unknown-question-type">
                <p>Question type not supported: {question.type}</p>
            </div>
            )}
        </div>
        ))}
      
      <button type="submit" className="btn-submit">
        Submit Responses
      </button>
    </form>
  </div>
);
}

export default ParticipateSurvey;