import React from 'react';

const QuestionTypeSelector = ({ onSelect }) => {
  const questionTypes = [
    {
      type: 'multiple-choice',
      name: 'Multiple Choice',
      description: 'Let participants select from predefined options'
    },
    {
      type: 'word-cloud',
      name: 'Word Cloud',
      description: 'Collect open-ended responses and display as a word cloud'
    },
    {
      type: 'scale',
      name: 'Rating Scale',
      description: 'Use a scale to measure opinion or sentiment'
    },
    {
      type: 'quiz-mc',
      name: 'Quiz Question',
      description: 'Multiple choice question with correct answers'
    },
    {
      type: 'instruction',
      name: 'Instruction',
      description: 'Add text instruction or information slides'
    }
  ];

  return (
    <div className="question-type-selector">
      <h2>Select Question Type</h2>
      <div className="question-type-grid">
        {questionTypes.map((qt) => (
          <div 
            key={qt.type} 
            className="question-type-card"
            onClick={() => onSelect(qt.type)}
          >
            <h3>{qt.name}</h3>
            <p>{qt.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionTypeSelector;