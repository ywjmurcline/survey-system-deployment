import React from 'react';

const ScaleQuestionEditor = ({ question, onChange, index }) => {
  const handleMinChange = (e) => {
    const min = parseInt(e.target.value);
    onChange('scaleRange', index, {
      min,
      max: question.maxValue
    });
  };

  const handleMaxChange = (e) => {
    const max = parseInt(e.target.value);
    onChange('scaleRange', index, {
      min: question.minValue,
      max
    });
  };

  return (
    <div className="question-editor">
      <div className="question-header">
        <h3>Scale Question</h3>
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
      
      <div className="scale-range">
        <div className="form-group">
          <label>Min Value</label>
          <input
            type="number"
            value={question.minValue || 1}
            onChange={handleMinChange}
            className="form-control"
            min="0"
            max="9"
          />
        </div>
        
        <div className="form-group">
          <label>Max Value</label>
          <input
            type="number"
            value={question.maxValue || 5}
            onChange={handleMaxChange}
            className="form-control"
            min="1"
            max="10"
          />
        </div>
      </div>
      
      <div className="scale-labels">
        <div className="form-group">
          <label>Min Label</label>
          <input
            type="text"
            value={question.minLabel || ''}
            onChange={(e) => onChange('minLabel', index, e.target.value)}
            placeholder="e.g. Poor"
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label>Max Label</label>
          <input
            type="text"
            value={question.maxLabel || ''}
            onChange={(e) => onChange('maxLabel', index, e.target.value)}
            placeholder="e.g. Excellent"
            className="form-control"
          />
        </div>
      </div>
    </div>
  );
};

export default ScaleQuestionEditor;