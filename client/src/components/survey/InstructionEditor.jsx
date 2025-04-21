import React from 'react';

const InstructionEditor = ({ question, onChange, index }) => {
  return (
    <div className="question-editor instruction-editor">
      <div className="question-header">
        <h3>Instruction Slide</h3>
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
        <label>Title</label>
        <input
          type="text"
          value={question.title || ''}
          onChange={(e) => onChange('title', index, e.target.value)}
          placeholder="Enter slide title"
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label>Instructions</label>
        <textarea
          value={question.content || ''}
          onChange={(e) => onChange('content', index, e.target.value)}
          placeholder="Enter instructions or information for participants"
          className="form-control"
          rows="4"
        />
      </div>
    </div>
  );
};

export default InstructionEditor;