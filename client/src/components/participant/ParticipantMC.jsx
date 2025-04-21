import React from 'react';

const ParticipantMC = ({ question, answer, onAnswerChange }) => {
  // Function to handle option selection
  const handleOptionSelect = (optionId) => {
    console.log("Selected option:", optionId);
    onAnswerChange(optionId);
  };

  // If question has no options, show a message
  if (!question.options || question.options.length === 0) {
    return (
      <div className="question-container">
        <h3 className="question-title">{question.title}</h3>
        <p className="text-muted">This question has no options.</p>
      </div>
    );
  }

  return (
    <div className="question-container">
      <h3 className="question-title">{question.title}</h3>
      
      <div className="mc-options">
        {question.options.map((option, index) => {
          // For debugging
          console.log("Option:", option);
          console.log("Checking if", answer, "===", option.id || index);
          
          return (
            <div key={index} className="mc-option">
              <div className="form-check option-item">
                <input
                  className="form-check-input"
                  type="radio"
                  id={`option-${question.id || 'q'}-${index}`}
                  name={`question-${question.id || 'q'}`}
                  checked={answer === (option.id || index.toString())}
                  onChange={() => handleOptionSelect(option.id || index.toString())}
                />
                <label 
                  className="form-check-label" 
                  htmlFor={`option-${question.id || 'q'}-${index}`}
                >
                  {option.text}
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantMC;