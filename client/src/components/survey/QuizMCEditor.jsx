import React from 'react';

const QuizMCEditor = ({ question, onChange, index }) => {
  return (
    <div className="question-editor">
      <div className="question-header">
        <h3>Quiz Question</h3>
        <div className="question-actions">
          <button 
            type="button" 
            className="action-btn" 
            onClick={() => onChange('moveUp', index)}
            title="Move Up"
          >↑</button>
          <button 
            type="button" 
            className="action-btn" 
            onClick={() => onChange('moveDown', index)}
            title="Move Down"
          >↓</button>
          <button 
            type="button" 
            className="action-btn delete-btn" 
            onClick={() => onChange('delete', index)}
            title="Delete Question"
          >×</button>
        </div>
      </div>
      
      <div className="form-group">
        <label>Question</label>
        <input
          type="text"
          value={question.title || ''}
          onChange={(e) => onChange('title', index, e.target.value)}
          placeholder="Enter your question"
          className="form-control"
        />
      </div>
      
      <div className="options-container">
        <label>Options (select the correct answer)</label>
        {(question.options || []).map((option, optionIndex) => (
          <div key={optionIndex} className="option-row quiz-option">
            <input
              type="radio"
              checked={option.isCorrect || false}
              onChange={() => onChange('setCorrect', index, null, optionIndex)}
              name={`correct-option-${index}`}
              id={`option-${index}-${optionIndex}`}
            />
            <input
              type="text"
              value={option.text || ''}
              onChange={(e) => onChange('optionText', index, e.target.value, optionIndex)}
              placeholder={`Option ${optionIndex + 1}`}
              className="form-control"
            />
            <button
              type="button"
              className="btn-icon"
              onClick={() => onChange('removeOption', index, null, optionIndex)}
              disabled={(question.options || []).length <= 2}
              title="Remove Option"
            >
              ×
            </button>
          </div>
        ))}
        
        <button
          type="button"
          className="btn-secondary btn-sm"
          onClick={() => onChange('addOption', index)}
        >
          Add Option
        </button>
      </div>
    </div>
  );
};

export default QuizMCEditor;