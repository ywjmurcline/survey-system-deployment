import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API from '../utils/api';
import Navbar from '../components/common/Navbar';
import MCQuestionEditor from '../components/survey/MCQuestionEditor';
import WordCloudEditor from '../components/survey/WordCloudEditor';
import ScaleQuestionEditor from '../components/survey/ScaleQuestionEditor';
import QuizMCEditor from '../components/survey/QuizMCEditor';
import InstructionEditor from '../components/survey/InstructionEditor';
import '../styles/create-survey.css';

const CreateSurvey = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    if (isEditing && id) {
      const fetchSurvey = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await API.get(`/surveys/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const survey = response.data;
          setSurveyTitle(survey.title);
          setSurveyDescription(survey.description || '');
          setQuestions(survey.questions || []);
        } catch (err) {
          setError('Failed to load survey. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchSurvey();
    }
  }, [isEditing, id]);
  
  const handleAddQuestion = (type) => {
    let newQuestion;
    
    switch (type) {
      case 'mc':
        newQuestion = {
          type: 'mc',
          title: '',
          options: [{ text: '' }, { text: '' }]
        };
        break;
      case 'wordcloud':
        newQuestion = {
          type: 'wordcloud',
          title: '',
          maxWords: 1
        };
        break;
      case 'scale':
        newQuestion = {
          type: 'scale',
          title: '',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Poor',
          maxLabel: 'Excellent'
        };
        break;
      case 'quiz':
        newQuestion = {
          type: 'quiz-mc',
          title: '',
          options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }]
        };
        break;
      case 'instruction':
        newQuestion = {
          type: 'instruction',
          title: '',
          content: ''
        };
        break;
      default:
        return;
    }
    
    setQuestions([...questions, newQuestion]);
  };
  
  const handleQuestionChange = (action, index, value, optionIndex) => {
    const updatedQuestions = [...questions];
    
    switch (action) {
      case 'title':
        updatedQuestions[index].title = value;
        break;
      case 'content':
        updatedQuestions[index].content = value;
        break;
      case 'maxWords':
        updatedQuestions[index].maxWords = value;
        break;
      case 'scaleRange':
        updatedQuestions[index].minValue = value.min;
        updatedQuestions[index].maxValue = value.max;
        break;
      case 'minLabel':
        updatedQuestions[index].minLabel = value;
        break;
      case 'maxLabel':
        updatedQuestions[index].maxLabel = value;
        break;
      case 'optionText':
        updatedQuestions[index].options[optionIndex].text = value;
        break;
      case 'setCorrect':
        updatedQuestions[index].options = updatedQuestions[index].options.map((opt, i) => ({
          ...opt,
          isCorrect: i === optionIndex
        }));
        break;
      case 'addOption':
        updatedQuestions[index].options.push({ text: '', isCorrect: false });
        break;
      case 'removeOption':
        if (updatedQuestions[index].options.length > 2) {
          updatedQuestions[index].options.splice(optionIndex, 1);
        }
        break;
      case 'moveUp':
        if (index > 0) {
          [updatedQuestions[index - 1], updatedQuestions[index]] = [updatedQuestions[index], updatedQuestions[index - 1]];
        }
        break;
      case 'moveDown':
        if (index < updatedQuestions.length - 1) {
          [updatedQuestions[index], updatedQuestions[index + 1]] = [updatedQuestions[index + 1], updatedQuestions[index]];
        }
        break;
      case 'delete':
        updatedQuestions.splice(index, 1);
        break;
      default:
        return;
    }
    
    setQuestions(updatedQuestions);
  };
  
  const handleSubmit = async () => {
    if (!surveyTitle.trim()) {
      setError('Please enter a survey title');
      return;
    }
    
    if (questions.length === 0) {
      setError('Please add at least one question');
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      const survey = {
        title: surveyTitle,
        description: surveyDescription,
        questions
      };
      
      if (isEditing) {
        await API.put(`/surveys/${id}`, survey, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Survey updated successfully!');
      } else {
        await API.post('/surveys', survey, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Survey created successfully!');
      }
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard', { state: { message: success } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save survey');
    }
  };
  
  const renderQuestionComponent = (question, index) => {
    switch (question.type) {
      case 'mc':
        return <MCQuestionEditor question={question} onChange={handleQuestionChange} index={index} />;
      case 'wordcloud':
        return <WordCloudEditor question={question} onChange={handleQuestionChange} index={index} />;
      case 'scale':
        return <ScaleQuestionEditor question={question} onChange={handleQuestionChange} index={index} />;
      case 'quiz-mc':
        return <QuizMCEditor question={question} onChange={handleQuestionChange} index={index} />;
      case 'instruction':
        return <InstructionEditor question={question} onChange={handleQuestionChange} index={index} />;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="create-survey-container">
        <Navbar />
        <div className="loading">Loading survey...</div>
      </div>
    );
  }
  
  return (
    <div className="create-survey-container">
      <Navbar />
      
      <div className="create-survey-content">
        <div className="create-survey-header">
          <h1>{isEditing ? 'Edit Survey' : 'Create New Survey'}</h1>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="survey-form">
          <div className="form-group">
            <label htmlFor="survey-title">Survey Title</label>
            <input
              id="survey-title"
              type="text"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              placeholder="Enter survey title"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="survey-description">Description (Optional)</label>
            <textarea
              id="survey-description"
              value={surveyDescription}
              onChange={(e) => setSurveyDescription(e.target.value)}
              placeholder="Enter a brief description"
              className="form-control"
              rows="3"
            />
          </div>
          
          <div className="questions-container">
            <h2>Questions</h2>
            
            {questions.map((question, index) => (
              <div key={index} className="question-wrapper">
                {renderQuestionComponent(question, index)}
              </div>
            ))}
            
            <div className="add-question-section">
              <h3>Add Question</h3>
              <div className="question-type-buttons">
                <button type="button" className="question-type-btn" onClick={() => handleAddQuestion('mc')}>
                  Multiple Choice
                </button>
                <button type="button" className="question-type-btn" onClick={() => handleAddQuestion('wordcloud')}>
                  Word Cloud
                </button>
                <button type="button" className="question-type-btn" onClick={() => handleAddQuestion('scale')}>
                  Scale
                </button>
                <button type="button" className="question-type-btn" onClick={() => handleAddQuestion('quiz')}>
                  Quiz
                </button>
                <button type="button" className="question-type-btn" onClick={() => handleAddQuestion('instruction')}>
                  Instruction
                </button>
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSubmit}>
              {isEditing ? 'Update Survey' : 'Create Survey'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSurvey;