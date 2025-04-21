import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell, PieChart, Pie, Legend } from 'recharts';

const QuizResults = ({ question, responses, totalParticipants }) => {
  if (!question || !responses) return null;

  // Option distribution chart data
  const optionData = question.options.map((option, index) => {
    const count = responses.filter(r => r.answer === option.id).length;
    return {
      name: option.label || option.text,
      count,
      fill: option.isCorrect ? '#4CAF50' : '#FF5252', // Green for correct, red for incorrect
      isCorrect: option.isCorrect
    };
  });

  // Calculate correct/incorrect counts for pie chart
  const correctOption = question.options.find(o => o.isCorrect);
  const correctCount = correctOption 
    ? responses.filter(r => r.answer === correctOption.id).length 
    : 0;
  const incorrectCount = responses.length - correctCount;
  
  const pieData = [
    { name: 'Correct', value: correctCount, fill: '#4CAF50' },
    { name: 'Incorrect', value: incorrectCount, fill: '#FF5252' }
  ];

  // Calculate percentage correct
  const percentCorrect = responses.length 
    ? Math.round((correctCount / responses.length) * 100) 
    : 0;

  return (
    <div className="results-container">
      <div className="results-header quiz-header">
        <div className="quiz-stats">
          <div className="stat-item">
            <span>Correct Answers: <strong>{correctCount}/{responses.length}</strong></span>
          </div>
          <div className="stat-item">
            <span>Success Rate: <strong>{percentCorrect}%</strong></span>
          </div>
        </div>
      </div>
      
      <div className="charts-row" style={{ display: 'flex', gap: '20px' }}>
        {/* Bar chart showing distribution */}
        <div style={{ width: '60%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={optionData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fill: '#3F3F3F', fontWeight: 600 }} />
              <YAxis hide />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="custom-tooltip" style={{ 
                      backgroundColor: '#fff', 
                      padding: '10px', 
                      border: '1px solid #ccc' 
                    }}>
                      <p>{data.name}</p>
                      <p>Responses: {data.count}</p>
                      <p>Status: {data.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}> 
                <LabelList dataKey="count" position="top" fill="#3F3F3F" formatter={(value) => value} />
                {optionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Pie chart showing correct/incorrect ratio */}
        <div style={{ width: '40%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie 
                data={pieData} 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                dataKey="value" 
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;