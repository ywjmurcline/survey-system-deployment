import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import { 
  Container, Tabs, Tab, Card, Row, Col, Badge, Button, 
  ProgressBar, Alert, Modal, Spinner 
} from 'react-bootstrap';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, PieChart, Pie, Cell 
} from 'recharts';
import { format } from 'date-fns';
import '../styles/surveyDashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const SurveyDashboard = () => {
  const [activeTab, setActiveTab] = useState('created');
  const [createdSurveys, setCreatedSurveys] = useState([]);
  const [joinedSurveys, setJoinedSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [surveyStats, setSurveyStats] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    fetchCreatedSurveys();
    fetchJoinedSurveys();
  }, [currentUser, navigate]);

  const fetchCreatedSurveys = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await API.get('/surveys', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCreatedSurveys(response.data);
    } catch (err) {
      setError('Failed to fetch your created surveys');
      console.error('Error fetching created surveys:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedSurveys = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await API.get('/surveys/joined', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJoinedSurveys(response.data);
    } catch (err) {
      console.error('Error fetching joined surveys:', err);
      // Continue without joined surveys if there's an error
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveyStats = async (surveyId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await API.get(`/surveys/${surveyId}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSurveyStats(response.data);
    } catch (err) {
      console.error('Error fetching survey stats:', err);
      setSurveyStats({ error: 'Failed to load statistics' });
    }
  };

  const closeSurvey = async (surveyId) => {
    try {
      const token = localStorage.getItem('authToken');
      await API.patch(`/surveys/${surveyId}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local state
      setCreatedSurveys(prevSurveys => 
        prevSurveys.map(survey => 
          survey._id === surveyId ? { ...survey, isActive: false } : survey
        )
      );
    } catch (err) {
      console.error('Error closing survey:', err);
      setError('Failed to close survey');
    }
  };

  const viewSurveyStats = (survey) => {
    setCurrentSurvey(survey);
    fetchSurveyStats(survey._id);
    setShowStatsModal(true);
  };

  const continueSurvey = (surveyId, responseId) => {
    navigate(`/survey/${surveyId}/respond?responseId=${responseId}`);
  };

  const viewResponses = (surveyId, responseId) => {
    navigate(`/survey/${surveyId}/results?responseId=${responseId}`);
  };

  const renderCreatedSurveysTab = () => (
    <div className="created-surveys-container">
      <h3 className="section-title">Surveys You've Created</h3>
      {createdSurveys.length === 0 ? (
        <Alert variant="info">You haven't created any surveys yet.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {createdSurveys.map(survey => (
            <Col key={survey._id}>
              <Card className="h-100 survey-card">
                <Card.Body>
                  <Card.Title>{survey.title}</Card.Title>
                  <Card.Text className="text-muted">{survey.description}</Card.Text>
                  
                  <div className="survey-stats-summary">
                    <div className="stat-item">
                      <span className="stat-label">Responses:</span>
                      <span className="stat-value">{survey.responseCount || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Created:</span>
                      <span className="stat-value">
                        {format(new Date(survey.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Status:</span>
                      <Badge bg={survey.isActive ? "success" : "secondary"}>
                        {survey.isActive ? "Active" : "Closed"}
                      </Badge>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Button 
                    variant="primary" 
                    onClick={() => viewSurveyStats(survey)}
                    className="action-button"
                  >
                    View Statistics
                  </Button>
                  {survey.isActive && (
                    <Button 
                      variant="outline-danger" 
                      onClick={() => closeSurvey(survey._id)}
                      className="action-button"
                    >
                      Close Survey
                    </Button>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );

  const renderJoinedSurveysTab = () => (
    <div className="joined-surveys-container">
      <h3 className="section-title">Surveys You've Joined</h3>
      {joinedSurveys.length === 0 ? (
        <Alert variant="info">You haven't participated in any surveys yet.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {joinedSurveys.map(participation => (
            <Col key={participation._id}>
              <Card className="h-100 survey-card">
                <Card.Body>
                  <Card.Title>{participation.survey.title}</Card.Title>
                  <Card.Text className="text-muted">{participation.survey.description}</Card.Text>
                  
                  <div className="participation-info">
                    <div className="info-item">
                      <span className="info-label">Started:</span>
                      <span className="info-value">
                        {format(new Date(participation.startedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Status:</span>
                      <Badge bg={participation.completed ? "success" : "warning"}>
                        {participation.completed ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                    {participation.completed && participation.completedAt && (
                      <div className="info-item">
                        <span className="info-label">Completed:</span>
                        <span className="info-value">
                          {format(new Date(participation.completedAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                    {!participation.completed && (
                      <div className="info-item">
                        <span className="info-label">Progress:</span>
                        <ProgressBar 
                          now={participation.progress || 0} 
                          label={`${participation.progress || 0}%`} 
                        />
                      </div>
                    )}
                  </div>
                </Card.Body>
                <Card.Footer>
                  {!participation.completed ? (
                    <Button 
                      variant="primary" 
                      onClick={() => continueSurvey(participation.survey._id, participation._id)}
                      className="action-button"
                    >
                      Continue Survey
                    </Button>
                  ) : (
                    <Button 
                      variant="outline-primary" 
                      onClick={() => viewResponses(participation.survey._id, participation._id)}
                      className="action-button"
                    >
                      View My Answers
                    </Button>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );

  const renderStatsModal = () => (
    <Modal
      show={showStatsModal}
      onHide={() => setShowStatsModal(false)}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Survey Statistics: {currentSurvey?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!surveyStats ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : surveyStats.error ? (
          <Alert variant="danger">{surveyStats.error}</Alert>
        ) : (
          <div className="stats-container">
            <div className="overall-stats">
              <Row>
                <Col md={4} className="stat-box">
                  <div className="stat-number">{surveyStats.totalResponses}</div>
                  <div className="stat-label">Total Responses</div>
                </Col>
                <Col md={4} className="stat-box">
                  <div className="stat-number">{surveyStats.completionRate}%</div>
                  <div className="stat-label">Completion Rate</div>
                </Col>
                <Col md={4} className="stat-box">
                  <div className="stat-number">{surveyStats.averageTime}</div>
                  <div className="stat-label">Avg. Completion Time</div>
                </Col>
              </Row>
            </div>
            
            <h5 className="mt-4">Response Distribution</h5>
            <div className="charts-container">
              <Row>
                <Col md={6}>
                  <PieChart width={300} height={200}>
                    <Pie
                      data={surveyStats.responseDistribution}
                      cx={150}
                      cy={100}
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {surveyStats.responseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </Col>
                <Col md={6}>
                  <BarChart
                    width={300}
                    height={200}
                    data={surveyStats.dailyResponses}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </Col>
              </Row>
            </div>
            
            <h5 className="mt-4">Question Summary</h5>
            <div className="question-stats">
              {surveyStats.questionStats.map((question, index) => (
                <div key={index} className="question-stat-item">
                  <h6>{question.text}</h6>
                  {question.type === 'multiple-choice' && (
                    <BarChart
                      width={600}
                      height={200}
                      data={question.optionCounts}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="option" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  )}
                  {question.type === 'text' && (
                    <div className="text-responses">
                      <p><strong>Sample responses:</strong></p>
                      <ul>
                        {question.responses.slice(0, 5).map((response, i) => (
                          <li key={i}>{response}</li>
                        ))}
                      </ul>
                      {question.responses.length > 5 && (
                        <p className="text-muted">
                          {question.responses.length - 5} more responses...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {currentSurvey?.isActive && (
          <Button variant="warning" onClick={() => closeSurvey(currentSurvey._id)}>
            Close Survey
          </Button>
        )}
        <Button variant="primary" onClick={() => setShowStatsModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (loading && !createdSurveys.length && !joinedSurveys.length) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="survey-dashboard-container">
      <h2 className="page-title">Survey Dashboard</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="created" title="My Surveys">
          {renderCreatedSurveysTab()}
        </Tab>
        <Tab eventKey="joined" title="Joined Surveys">
          {renderJoinedSurveysTab()}
        </Tab>
      </Tabs>
      
      {renderStatsModal()}
    </Container>
  );
};

export default SurveyDashboard;