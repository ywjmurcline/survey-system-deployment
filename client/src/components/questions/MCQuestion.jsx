import React from 'react';
export const MCQuestion = ({ 
  question = {}, 
  onChange, 
  index 
}) => {
  return (
    <div className="question-item multiple-choice">
      <div className="question-header">
        <span className="question-type-label">Multiple Choice</span>
        <div className="question-actions">
          <button type="button" className="action-btn" onClick={() => onChange('moveUp', index)}>↑</button>
          <button type="button" className="action-btn" onClick={() => onChange('moveDown', index)}>↓</button>
          <button type="button" className="action-btn delete" onClick={() => onChange('delete', index)}>×</button>
        </div>
      </div>
      
      <input
        type="text"
        className="question-title-input"
        value={question.title || ''}
        onChange={(e) => onChange('title', index, e.target.value)}
        placeholder="Enter question"
      />
      
      <div className="options-list">
        {(question.options || []).map((option, optIndex) => (
          <div className="option-item" key={optIndex}>
            <input
              type="text"
              value={option.text || ''}
              onChange={(e) => onChange('optionText', index, e.target.value, optIndex)}
              placeholder={`Option ${optIndex + 1}`}
            />
            <button 
              type="button" 
              className="remove-option-btn"
              onClick={() => onChange('removeOption', index, null, optIndex)}
            >
              ×
            </button>
          </div>
        ))}
        <button 
          type="button" 
          className="add-option-btn"
          onClick={() => onChange('addOption', index)}
        >
          + Add Option
        </button>
      </div>
    </div>
  );
};

export default MCQuestion;