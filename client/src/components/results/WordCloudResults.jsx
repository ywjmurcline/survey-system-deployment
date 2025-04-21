import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import axios from 'axios';
const WordCloudResults = ({ question, responses, totalParticipants }) => {
 
  const [adjectives, setAdjectives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  if (!question || !responses) return null;

  // Process all words from responses
  const wordCounts = {};
  
  responses.forEach(response => {
    if (response.answer && typeof response.answer === 'string') {
      // Split by comma (word cloud saves words as comma-separated)
      const words = response.answer.split(',').map(w => w.trim().toLowerCase());
      
      words.forEach(word => {
        if (word) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });
    }
  });
  
  // Convert to array for chart data, sort by count descending
  const wordData = Object.keys(wordCounts)
    .map(word => ({
      name: word,
      count: wordCounts[word],
      fill: '#3182CE'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15); // Top 15 words
  
  // Custom wordcloud-like display (simple version)
  const getFontSize = (count, maxCount) => {
    const minSize = 14;
    const maxSize = 40;
    if (maxCount === 0) return minSize;
    return minSize + ((count / maxCount) * (maxSize - minSize));
  };
  
  const maxCount = wordData.length > 0 ? wordData[0].count : 0;
  
  const colors = [
    '#215BA6', '#3182CE', '#4299E1', '#63B3ED', '#90CDF4',
    '#215BA6', '#3182CE', '#4299E1', '#63B3ED', '#90CDF4',
  ];

  const handleExtractAdjectives = async () => {
    if (!description.trim()) {
      setError('Please enter a course description.');
      return;
    }

    setError('');
    setLoading(true);
    setAdjectives([]);
 // Combine all responses into a single description string
 const description = responses.map((r) => r.answer).join(' ');
    try {
      const response = await axios.post('/api/extract', { description });
      setAdjectives(response.data.adjectives);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to extract adjectives.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="results-container">
      {/* Word cloud visualization */}
      <div className="word-cloud-visual" style={{ 
        padding: '30px', 
        background: '#f7fafc', 
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
        minHeight: '200px'
      }}>
        {wordData.length > 0 ? (
          wordData.map((word, index) => (
            <span
              key={index}
              style={{
                fontSize: `${getFontSize(word.count, maxCount)}px`,
                color: colors[index % colors.length],
                fontWeight: index < 3 ? 'bold' : 'normal',
                margin: '8px',
                display: 'inline-block',
              }}
            >
              {word.name}
            </span>
          ))
        ) : (
          <div className="no-data">No word responses yet</div>
        )}
      </div>
      
      {/* Bar chart for top words */}
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart 
            data={wordData} 
            layout="vertical" 
            margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: '#3F3F3F', fontWeight: 600 }} 
              width={80}
            />
            <Tooltip />
            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
              <LabelList dataKey="count" position="right" fill="#3F3F3F" formatter={(value) => value} />
              {wordData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
        {/* Extract Adjectives Button */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={handleExtractAdjectives}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Extracting...' : 'Extract Key Adjectives'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {adjectives.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Key Adjectives:</h3>
            <ul>
              {adjectives.map((adj, index) => (
                <li key={index}>{adj}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordCloudResults;