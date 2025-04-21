import React from 'react';

export const WordCloudQuestion = ({ 
  question = {}, 
  onChange, 
  index 
}) => {
  return (
    <div className="question-item word-cloud">
      <div className="question-header">
        <span className="question-type-label">Word Cloud</span>
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
      
      <div className="word-cloud-settings">
        <div className="setting-group">
          <label>Maximum words:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={question.maxWords || 1}
            onChange={(e) => onChange('maxWords', index, parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default WordCloudQuestion;