import React, { useState, useEffect } from 'react';

const ParticipantWordCloud = ({ question, answer, onAnswerChange }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [words, setWords] = useState([]);
  
  // Reset words when question changes - use more reliable dependencies
  useEffect(() => {
    // Clear current input when question changes
    setCurrentWord('');
    
    // Parse answer from current question only
    setWords(answer ? answer.split(',').filter(w => w) : []);
  }, [question.id, question.title, answer]); // Added title as fallback dependency

  const handleAddWord = () => {
    if (!currentWord.trim()) return;
    
    // Enforce max of 1 word per question
    const newWords = [currentWord.trim()];
    setWords(newWords);
    onAnswerChange(newWords.join(','));
    setCurrentWord('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddWord();
    }
  };

  const removeWord = (indexToRemove) => {
    const newWords = words.filter((_, index) => index !== indexToRemove);
    setWords(newWords);
    onAnswerChange(newWords.join(','));
  };

  // Enforce limit of exactly 1 word per question
  const maxWords = 1;

  return (
    <div className="question-container">
      <h3 className="question-title">{question.title}</h3>
      
      <div className="wordcloud-input-area">
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            value={currentWord}
            onChange={(e) => setCurrentWord(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a word and press Enter"
            disabled={words.length >= maxWords}
          />
          <small className="text-muted">
            Enter one word for this question. {maxWords - words.length} remaining.
          </small>
        </div>
        
        <button 
          className="btn btn-primary mb-3"
          onClick={handleAddWord}
          disabled={!currentWord.trim() || words.length >= maxWords}
        >
          Add Word
        </button>
      </div>
      
      <div className="wordcloud-words">
        {words.map((word, index) => (
          <span 
            key={index} 
            className="badge bg-primary me-2 mb-2 p-2 wordcloud-badge"
          >
            {word} <span 
              className="remove-word" 
              onClick={() => removeWord(index)}
              style={{ cursor: 'pointer', marginLeft: '5px' }}
            >×</span>
          </span>
        ))}
        {words.length === 0 && (
          <p className="text-muted">Add a word for this question</p>
        )}
      </div>
    </div>
  );
};

export default ParticipantWordCloud;