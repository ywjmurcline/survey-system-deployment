import React from 'react';

const WordCloudEditor = ({ question, onChange, index }) => {
  return (
    <div className="question-editor">
      <div className="question-header">
        <h3>Word Cloud Question</h3>
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
      
      <div className="form-group">
        <label>Max Words Per Response</label>
        <input
          type="number"
          min="1"
          max="10"
          value={question.maxWords || 1}
          onChange={(e) => onChange('maxWords', index, parseInt(e.target.value))}
          className="form-control"
        />
      </div>
    </div>
  );
};

export default WordCloudEditor;