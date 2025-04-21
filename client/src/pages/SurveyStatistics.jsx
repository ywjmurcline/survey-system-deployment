import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API from '../utils/api';
import { 
  Container, Row, Col, Card, Table, Spinner, Alert, 
  Tabs, Tab, Badge, Button, ProgressBar, Dropdown
} from 'react-bootstrap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer,
  AreaChart, Area, Scatter, ScatterChart
} from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import '../styles/surveyStatistics.css';

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6666', '#6666FF'];

const SurveyStatistics = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('all'); // 'all', 'week', 'month', 'year'
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  useEffect(() => {
    fetchSurveyData();
  }, [id]);
  
  useEffect(() => {
    if (survey && survey.questions && survey.questions.length > 0) {
      setSelectedQuestion(survey.questions[0]);
    }
  }, [survey]);
  
  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      // Fetch survey details
      const surveyResponse = await API.get(`/surveys/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSurvey(surveyResponse.data);
      
      // Fetch survey responses
      const responsesResponse = await API.get(`/surveys/${id}/responses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setResponses(responsesResponse.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching survey data:', err);
      setError('Failed to load survey statistics. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  // Filter responses based on date range
  const getFilteredResponses = () => {
    if (dateRange === 'all') return responses;
    
    const now = new Date();
    let filterDate;
    
    switch (dateRange) {
      case 'week':
        filterDate = subDays(now, 7);
        break;
      case 'month':
        filterDate = subDays(now, 30);
        break;
      case 'year':
        filterDate = subDays(now, 365);
        break;
      default:
        return responses;
    }
    
    return responses.filter(response => 
      new Date(response.createdAt) >= filterDate
    );
  };
  
  // Calculate basic statistics
  const calculateStats = () => {
    const filteredResponses = getFilteredResponses();
    const totalResponses = filteredResponses.length;
    
    // Calculate completion rate
    const completedResponses = filteredResponses.filter(r => r.completed).length;
    const completionRate = totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0;
    
    // Calculate average completion time (in seconds)
    const completionTimes = filteredResponses
      .filter(r => r.completed && r.startedAt && r.completedAt)
      .map(r => (new Date(r.completedAt) - new Date(r.startedAt)) / 1000);
      
    const avgCompletionTime = completionTimes.length > 0 
      ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
      : 0;
    
    // Format time as minutes:seconds
    const minutes = Math.floor(avgCompletionTime / 60);
    const seconds = Math.floor(avgCompletionTime % 60);
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Daily response trend
    const responseTrend = generateResponseTrend(filteredResponses);
    
    // Calculate device breakdown
    const devices = filteredResponses.reduce((acc, response) => {
      const device = response.deviceInfo?.deviceType || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});
    
    const deviceBreakdown = Object.keys(devices).map(device => ({
      name: device,
      value: devices[device]
    }));
    
    return {
      totalResponses,
      completedResponses,
      completionRate: completionRate.toFixed(1),
      avgCompletionTime: formattedTime,
      responseTrend,
      deviceBreakdown
    };
  };
  
  // Generate daily response trend
  const generateResponseTrend = (responses) => {
    const dateMap = new Map();
    const now = new Date();
    
    // Initialize with past 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i);
      const formattedDate = format(date, 'MMM dd');
      dateMap.set(formattedDate, 0);
    }
    
    // Count responses by date
    responses.forEach(response => {
      const date = format(new Date(response.createdAt), 'MMM dd');
      if (dateMap.has(date)) {
        dateMap.set(date, dateMap.get(date) + 1);
      }
    });
    
    // Convert to array for charts
    return Array.from(dateMap).map(([date, count]) => ({ date, count }));
  };
  
  // Analyze a specific question's responses
  const analyzeQuestionResponses = (question) => {
    const filteredResponses = getFilteredResponses();
    
    // Find answers for this question
    const answers = filteredResponses.flatMap(response => {
      const answer = response.answers?.find(a => a.questionId === question._id);
      return answer ? [answer.answer] : [];
    });
    
    if (answers.length === 0) {
      return { noData: true };
    }
    
    switch (question.type) {
      case 'multiple-choice':
      case 'mc':
      case 'quiz-mc':
        return analyzeMultipleChoiceQuestion(question, answers);
        
      case 'scale':
      case 'rating':
        return analyzeRatingQuestion(answers);
        
      case 'text':
      case 'open-ended':
        return analyzeTextQuestion(answers);
        
      case 'wordcloud':
      case 'word-cloud':
        return analyzeWordCloudQuestion(answers);
        
      default:
        return { noData: true };
    }
  };
  
  // Multiple choice question analysis
  const analyzeMultipleChoiceQuestion = (question, answers) => {
    // Count answers for each option
    const optionCounts = {};
    
    // Initialize all options with 0
    if (question.options) {
      question.options.forEach(opt => {
        const key = opt.text || opt.value;
        optionCounts[key] = 0;
      });
    }
    
    // Count actual answers
    answers.forEach(answer => {
      if (Array.isArray(answer)) {
        // For checkbox (multiple selection)
        answer.forEach(selection => {
          optionCounts[selection] = (optionCounts[selection] || 0) + 1;
        });
      } else {
        // For single selection
        optionCounts[answer] = (optionCounts[answer] || 0) + 1;
      }
    });
    
    // Convert to chart data format
    const chartData = Object.keys(optionCounts).map(option => ({
      name: option,
      count: optionCounts[option],
      percentage: answers.length ? ((optionCounts[option] / answers.length) * 100).toFixed(1) : 0
    }));
    
    return {
      type: 'multiple-choice',
      chartData,
      totalAnswers: answers.length,
      mostCommon: [...chartData].sort((a, b) => b.count - a.count)[0]?.name
    };
  };
  
  // Rating/scale question analysis
  const analyzeRatingQuestion = (answers) => {
    const ratings = answers.map(Number).filter(r => !isNaN(r));
    
    if (ratings.length === 0) {
      return { noData: true };
    }
    
    // Calculate stats
    const sum = ratings.reduce((total, rating) => total + rating, 0);
    const avg = sum / ratings.length;
    
    // Count distribution
    const distribution = {};
    ratings.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1;
    });
    
    // Convert to chart data
    const chartData = Object.keys(distribution)
      .sort((a, b) => Number(a) - Number(b))
      .map(rating => ({
        rating: Number(rating),
        count: distribution[rating],
        percentage: ((distribution[rating] / ratings.length) * 100).toFixed(1)
      }));
    
    return {
      type: 'rating',
      average: avg.toFixed(1),
      chartData,
      totalAnswers: ratings.length,
      distribution
    };
  };
  
  // Text question analysis
  const analyzeTextQuestion = (answers) => {
    const validAnswers = answers.filter(a => typeof a === 'string' && a.trim().length > 0);
    
    if (validAnswers.length === 0) {
      return { noData: true };
    }
    
    // Calculate basic text stats
    const wordCounts = validAnswers.map(answer => answer.split(/\s+/).filter(w => w.length > 0).length);
    const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);
    const avgWordCount = totalWords / validAnswers.length;
    
    // Find common words (simple approach)
    const words = validAnswers
      .join(' ')
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3 && !['this', 'that', 'with', 'from', 'have', 'were'].includes(word));
    
    const wordFrequency = {};
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    // Get top words
    const topWords = Object.keys(wordFrequency)
      .map(word => ({ text: word, count: wordFrequency[word] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      type: 'text',
      totalAnswers: validAnswers.length,
      averageWordCount: avgWordCount.toFixed(1),
      topWords,
      sampleAnswers: validAnswers.slice(0, 5) // First 5 answers as samples
    };
  };
  
  // Word cloud question analysis
  const analyzeWordCloudQuestion = (answers) => {
    // Similar to text but format differently for word cloud
    const validAnswers = answers.filter(a => typeof a === 'string' && a.trim().length > 0);
    
    if (validAnswers.length === 0) {
      return { noData: true };
    }
    
    // Extract all words
    const words = validAnswers
      .join(' ')
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 2 && !['the', 'and', 'for', 'but'].includes(word));
    
    const wordFrequency = {};
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    // Format for word cloud
    const wordCloudData = Object.keys(wordFrequency).map(word => ({
      text: word,
      value: wordFrequency[word]
    })).sort((a, b) => b.value - a.value).slice(0, 50);
    
    return {
      type: 'wordcloud',
      totalAnswers: validAnswers.length,
      wordCloudData,
      totalUniqueWords: Object.keys(wordFrequency).length
    };
  };
  
  // Export data to CSV
  const exportToCsv = () => {
    if (!survey || !responses.length) return;
    
    // Create CSV header
    const headers = ['Respondent ID', 'Timestamp'];
    survey.questions.forEach(q => {
      headers.push(q.text || q.questionText || 'Question');
    });
    
    // Create CSV rows
    const rows = responses.map(response => {
      const row = [
        response._id,
        format(new Date(response.createdAt), 'yyyy-MM-dd HH:mm:ss')
      ];
      
      // Add answers for each question
      survey.questions.forEach(question => {
        const answer = response.answers?.find(a => a.questionId === question._id);
        let formattedAnswer = '';
        
        if (answer) {
          if (Array.isArray(answer.answer)) {
            formattedAnswer = answer.answer.join(', ');
          } else {
            formattedAnswer = answer.answer;
          }
        }
        
        row.push(formattedAnswer);
      });
      
      return row;
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${survey.title}_responses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading survey statistics...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }
  
  if (!survey) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          <Alert.Heading>No Survey Found</Alert.Heading>
          <p>The survey you're looking for doesn't exist or you don't have permission to view it.</p>
        </Alert>
      </Container>
    );
  }
  
  const stats = calculateStats();
  
  return (
    <Container fluid className="survey-statistics-container">
      <div className="header-section">
        <div>
          <h1>{survey.title}</h1>
          <p className="text-muted">{survey.description}</p>
        </div>
        <div className="stats-actions">
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary">
              {dateRange === 'all' ? 'All Time' : 
               dateRange === 'week' ? 'Past Week' : 
               dateRange === 'month' ? 'Past Month' : 'Past Year'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setDateRange('all')}>All Time</Dropdown.Item>
              <Dropdown.Item onClick={() => setDateRange('week')}>Past Week</Dropdown.Item>
              <Dropdown.Item onClick={() => setDateRange('month')}>Past Month</Dropdown.Item>
              <Dropdown.Item onClick={() => setDateRange('year')}>Past Year</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
          <Button variant="primary" onClick={exportToCsv}>
            Export to CSV
          </Button>
        </div>
      </div>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 stats-tabs"
      >
        <Tab eventKey="overview" title="Overview">
          <Row className="stat-summary">
            <Col md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-value">{stats.totalResponses}</div>
                  <div className="stat-label">Total Responses</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-value">{stats.completedResponses}</div>
                  <div className="stat-label">Completed Responses</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-value">{stats.completionRate}%</div>
                  <div className="stat-label">Completion Rate</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-value">{stats.avgCompletionTime}</div>
                  <div className="stat-label">Avg. Completion Time</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row className="mt-4">
            <Col md={8}>
              <Card>
                <Card.Header>Response Trend</Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={stats.responseTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Header>Device Breakdown</Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.deviceBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.deviceBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} (${((value/stats.totalResponses)*100).toFixed(1)}%)`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Card className="mt-4">
            <Card.Header>Response Timeline</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={stats.responseTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="questions" title="Question Analysis">
          <Row>
            <Col md={3}>
              <Card className="mb-4">
                <Card.Header>Survey Questions</Card.Header>
                <Card.Body className="p-0">
                  <div className="question-list">
                    {survey.questions.map((question, index) => (
                      <div
                        key={index}
                        className={`question-item ${selectedQuestion && selectedQuestion._id === question._id ? 'active' : ''}`}
                        onClick={() => setSelectedQuestion(question)}
                      >
                        <span className="question-number">{index + 1}</span>
                        <span className="question-text">
                          {question.text || question.questionText || 'Question'}
                        </span>
                        <Badge bg="secondary" className="question-type">
                          {question.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={9}>
              {selectedQuestion && (
                <QuestionAnalysis 
                  question={selectedQuestion} 
                  analysis={analyzeQuestionResponses(selectedQuestion)}
                />
              )}
            </Col>
          </Row>
        </Tab>
        
        <Tab eventKey="respondents" title="Individual Responses">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Response Details ({responses.length} total)</span>
              <Button variant="outline-primary" size="sm" onClick={exportToCsv}>
                Export All
              </Button>
            </Card.Header>
            <Card.Body>
              {responses.length === 0 ? (
                <Alert variant="info">No responses recorded yet.</Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Completion</th>
                        <th>Time Spent</th>
                        <th>Device</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses.slice(0, 10).map((response, index) => (
                        <tr key={response._id}>
                          <td>{index + 1}</td>
                          <td>{format(new Date(response.createdAt), 'MMM dd, yyyy HH:mm')}</td>
                          <td>
                            {response.completed ? (
                              <Badge bg="success">Completed</Badge>
                            ) : (
                              <Badge bg="warning">Partial</Badge>
                            )}
                          </td>
                          <td>
                            {response.completed && response.startedAt && response.completedAt ? (
                              formatTimeSpent(new Date(response.completedAt) - new Date(response.startedAt))
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td>{response.deviceInfo?.deviceType || 'Unknown'}</td>
                          <td>
                            <Button variant="link" size="sm" className="p-0">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  
                  {responses.length > 10 && (
                    <div className="text-center mt-3">
                      <Button variant="outline-secondary" size="sm">
                        Load More
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

// Helper component for question analysis
const QuestionAnalysis = ({ question, analysis }) => {
  if (analysis.noData) {
    return (
      <Card>
        <Card.Header>
          {question.text || question.questionText || 'Question'}
        </Card.Header>
        <Card.Body>
          <Alert variant="info">
            No data available for this question.
          </Alert>
        </Card.Body>
      </Card>
    );
  }
  
  switch (analysis.type) {
    case 'multiple-choice':
      return (
        <Card>
          <Card.Header>{question.text || question.questionText}</Card.Header>
          <Card.Body>
            <Row>
              <Col md={8}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analysis.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Col>
              <Col md={4}>
                <div className="mc-stats">
                  <div className="stat-item">
                    <div className="stat-label">Total Answers</div>
                    <div className="stat-value">{analysis.totalAnswers}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Most Common</div>
                    <div className="stat-value">{analysis.mostCommon || 'N/A'}</div>
                  </div>
                  <hr />
                  <h6>Response Breakdown</h6>
                  <Table>
                    <thead>
                      <tr>
                        <th>Option</th>
                        <th>Count</th>
                        <th>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.chartData.map((item, i) => (
                        <tr key={i}>
                          <td>{item.name}</td>
                          <td>{item.count}</td>
                          <td>{item.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      );
      
    case 'rating':
      return (
        <Card>
          <Card.Header>{question.text || question.questionText}</Card.Header>
          <Card.Body>
            <Row>
              <Col md={8}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analysis.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Col>
              <Col md={4}>
                <div className="rating-stats">
                  <div className="rating-avg">
                    <div className="avg-value">{analysis.average}</div>
                    <div className="avg-label">Average Rating</div>
                  </div>
                  <div className="total-ratings">
                    <div className="total-label">Total Ratings</div>
                    <div className="total-value">{analysis.totalAnswers}</div>
                  </div>
                  <hr />
                  <Table>
                    <thead>
                      <tr>
                        <th>Rating</th>
                        <th>Count</th>
                        <th>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.chartData.map((item, i) => (
                        <tr key={i}>
                          <td>{item.rating}</td>
                          <td>{item.count}</td>
                          <td>{item.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      );
      
    case 'text':
      return (
        <Card>
          <Card.Header>{question.text || question.questionText}</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>Text Analysis</h5>
                <div className="text-stats">
                  <div className="stat-item">
                    <div className="stat-label">Total Responses</div>
                    <div className="stat-value">{analysis.totalAnswers}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Avg. Word Count</div>
                    <div className="stat-value">{analysis.averageWordCount}</div>
                  </div>
                </div>
                
                <h6 className="mt-4">Common Words</h6>
                <div className="common-words">
                  {analysis.topWords.map((word, i) => (
                    <Badge 
                      key={i} 
                      bg="primary" 
                      className="word-badge"
                      style={{ fontSize: `${Math.max(0.8, Math.min(1.5, 0.8 + (word.count / 10)))}rem` }}
                    >
                      {word.text} ({word.count})
                    </Badge>
                  ))}
                </div>
              </Col>
              <Col md={6}>
                <h5>Sample Responses</h5>
                <div className="sample-responses">
                  {analysis.sampleAnswers.map((answer, i) => (
                    <div key={i} className="sample-response">
                      <div className="response-number">{i + 1}</div>
                      <div className="response-text">{answer}</div>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      );
      
    case 'wordcloud':
      // In a real implementation, you'd use a word cloud visualization library
      return (
        <Card>
          <Card.Header>{question.text || question.questionText}</Card.Header>
          <Card.Body>
            <Row>
              <Col md={8}>
                <div className="wordcloud-visualization">
                  {/* This would be replaced with an actual word cloud visualization */}
                  <div className="wordcloud-placeholder">
                    {analysis.wordCloudData.slice(0, 30).map((word, i) => (
                      <span 
                        key={i} 
                        className="word-item"
                        style={{
                          fontSize: `${Math.max(0.8, Math.min(2.5, 0.8 + (word.value / 5)))}rem`,
                          opacity: Math.max(0.5, Math.min(1, 0.5 + (word.value / 10))),
                          margin: '0.2rem'
                        }}
                      >
                        {word.text}
                      </span>
                    ))}
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="wordcloud-stats">
                  <div className="stat-item">
                    <div className="stat-label">Total Responses</div>
                    <div className="stat-value">{analysis.totalAnswers}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Unique Words</div>
                    <div className="stat-value">{analysis.totalUniqueWords}</div>
                  </div>
                  
                  <h6 className="mt-4">Top Words</h6>
                  <Table>
                    <thead>
                      <tr>
                        <th>Word</th>
                        <th>Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.wordCloudData.slice(0, 10).map((word, i) => (
                        <tr key={i}>
                          <td>{word.text}</td>
                          <td>{word.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      );
      
    default:
      return (
        <Card>
          <Card.Header>{question.text || question.questionText}</Card.Header>
          <Card.Body>
            <Alert variant="warning">
              Analysis not available for this question type: {question.type}
            </Alert>
          </Card.Body>
        </Card>
      );
  }
};

// Helper function to format time spent
const formatTimeSpent = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export default SurveyStatistics;