import React from 'react';
export const ScaleQuestion = ({ 
  question = {}, 
  onChange, 
  index 
}) => {
  return (
    <div className="question-item scale">
      <div className="question-header">
        <span className="question-type-label">Scale</span>
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
      
      <div className="scale-settings">
        <div className="setting-group">
          <label>Scale range:</label>
          <select
            value={`${question.minValue || 1}-${question.maxValue || 5}`}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-').map(Number);
              onChange('scaleRange', index, { min, max });
            }}
          >
            <option value="1-5">1 to 5</option>
            <option value="1-7">1 to 7</option>
            <option value="1-10">1 to 10</option>
          </select>
        </div>
        
        <div className="scale-labels">
          <div className="label-group">
            <label>Min label:</label>
            <input
              type="text"
              value={question.minLabel || ''}
              onChange={(e) => onChange('minLabel', index, e.target.value)}
              placeholder="Poor"
            />
          </div>
          
          <div className="label-group">
            <label>Max label:</label>
            <input
              type="text"
              value={question.maxLabel || ''}
              onChange={(e) => onChange('maxLabel', index, e.target.value)}
              placeholder="Excellent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScaleQuestion;