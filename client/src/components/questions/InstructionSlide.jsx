import React from 'react';
export const InstructionSlide = ({ 
    question = {}, 
    onChange, 
    index 
  }) => {
    return (
      <div className="question-item instruction">
        <div className="question-header">
          <span className="question-type-label">Instruction</span>
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
          placeholder="Enter title"
        />
        
        <textarea
          className="instruction-content"
          value={question.content || ''}
          onChange={(e) => onChange('content', index, e.target.value)}
          placeholder="Enter instruction content"
          rows="5"
        />
      </div>
    );
  };

export default InstructionSlide;