import React, { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { useSocket } from '../../contexts/SocketContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function VotingCard({ poll }) {
  const { socket } = useSocket();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleVote = (optionId) => {
    setSelectedOption(optionId);
    socket.emit('submit-vote', { 
      roomCode: poll.roomCode, 
      optionId 
    });
  };

  return (
    <div className="voting-container">
      <h2 className="poll-question">{poll.question}</h2>
      <div className="options-grid">
        <AnimatePresence>
          {poll.options.map((option) => (
            <motion.div
              key={option.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`option-card ${
                selectedOption === option.id ? 'selected' : ''
              }`}
              onClick={() => handleVote(option.id)}
            >
              <div className="option-content">
                <span className="option-text">{option.text}</span>
                {selectedOption === option.id && (
                  <motion.div 
                    className="checkmark"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <FiCheck />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}