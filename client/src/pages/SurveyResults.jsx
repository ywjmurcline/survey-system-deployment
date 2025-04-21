import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MCResults from '../components/results/MCResults';
import QuizResults from '../components/results/QuizResults';
import ScaleResults from '../components/results/ScaleResults';
import WordCloudResults from '../components/results/WordCloudResults';
import '../styles/results.css';

const SurveyResults = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // This is just an example - replace with your actual API calls
    const fetchData = async () => {
      try {
        // Fetch survey details
        const surveyData = await fetch(`/api/surveys/${surveyId}`).then(res => res.json());
        setSurvey(surveyData);
        
        // Fetch responses
        const responsesData = await fetch(`/api/surveys/${surveyId}/responses`).then(res => res.json());
        setResponses(responsesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [surveyId]);
  
  if (loading) return <div className="loading">Loading survey results...</div>;
  if (!survey) return <div className="not-found">Survey not found</div>;
  
  // Group responses by questionId
  const responsesByQuestion = {};
  responses.forEach(response => {
    response.answers.forEach(answer => {
      if (!responsesByQuestion[answer.questionId]) {
        responsesByQuestion[answer.questionId] = [];
      }
      responsesByQuestion[answer.questionId].push(answer);
    });
  });
  
  return (
    <div className="survey-results-page">
      <header className="page-header">
        <h1>{survey.title}</h1>
        <div className="survey-meta">
          <span>Total Responses: {responses.length}</span>
        </div>
      </header>
      
      <div className="results-sections">
        {survey.questions.map(question => {
          const questionResponses = responsesByQuestion[question.id] || [];
          
          switch (question.type) {
            case 'multiple-choice':
            case 'mc':
              return (
                <div key={question.id} className="question-result-section">
                  <h2 className="question-title">{question.title}</h2>
                  <MCResults 
                    question={question} 
                    responses={questionResponses} 
                    totalParticipants={responses.length} 
                  />
                </div>
              );
              
            case 'quiz':
            case 'quiz-mc':
              return (
                <div key={question.id} className="question-result-section">
                  <h2 className="question-title">{question.title}</h2>
                  <QuizResults 
                    question={question} 
                    responses={questionResponses} 
                    totalParticipants={responses.length} 
                  />
                </div>
              );
              
            case 'scale':
            case 'rating':
              return (
                <div key={question.id} className="question-result-section">
                  <h2 className="question-title">{question.title}</h2>
                  <ScaleResults 
                    question={question} 
                    responses={questionResponses} 
                    totalParticipants={responses.length} 
                  />
                </div>
              );
              
            case 'wordcloud':
            case 'word-cloud':
              return (
                <div key={question.id} className="question-result-section">
                  <h2 className="question-title">{question.title}</h2>
                  <WordCloudResults 
                    question={question} 
                    responses={questionResponses} 
                    totalParticipants={responses.length} 
                  />
                </div>
              );
              
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default SurveyResults;