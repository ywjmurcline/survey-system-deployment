const Response = require('../models/Response');

/**
 * Socket.IO service for real-time survey functionality
 * Handles connections, room management, and real-time updates
 */
const setupSockets = (io) => {
  // Track active presenters and participants
  const activePresenters = new Map();
  const activeParticipants = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Handle presenter joining their survey
    socket.on('presenterJoin', async (data) => {
      try {
        const { surveyId, userId } = data;
        
        // Store presenter info
        activePresenters.set(socket.id, { surveyId, userId });
        
        // Join presenter to survey room
        socket.join(`survey:${surveyId}`);
        socket.join(`presenter:${surveyId}`);
        
        console.log(`Presenter ${userId} joined survey ${surveyId}`);
        
        // Emit current participants count
        const participantCount = getParticipantCount(surveyId);
        socket.emit('participantCount', { count: participantCount });
        
        // Load existing responses
        try {
          const responses = await Response.find({ surveyId });
          if (responses.length > 0) {
            // Group responses by question
            const questionResponses = {};
            
            responses.forEach(response => {
              if (!questionResponses[response.questionId]) {
                questionResponses[response.questionId] = [];
              }
              
              questionResponses[response.questionId].push(response.response);
            });
            
            socket.emit('existingResponses', questionResponses);
          }
        } catch (err) {
          console.error('Error loading responses:', err);
        }
      } catch (error) {
        console.error('Error in presenterJoin:', error);
        socket.emit('error', { message: 'Error joining survey' });
      }
    });
    
    // Handle participant joining a survey
    socket.on('participantJoin', (data) => {
      try {
        const { surveyId, nickname } = data;
        
        // Store participant info
        activeParticipants.set(socket.id, { 
          surveyId, 
          nickname,
          joinedAt: new Date() 
        });
        
        // Join participant to survey room
        socket.join(`survey:${surveyId}`);
        socket.join(`participant:${surveyId}`);
        
        console.log(`Participant ${nickname} joined survey ${surveyId}`);
        
        // Notify presenter about new participant
        const participantCount = getParticipantCount(surveyId);
        io.to(`presenter:${surveyId}`).emit('participantJoined', { 
          nickname,
          count: participantCount
        });
        
        socket.emit('joinSuccess', { surveyId, nickname });
      } catch (error) {
        console.error('Error in participantJoin:', error);
        socket.emit('error', { message: 'Failed to join survey' });
      }
    });
    
    // Handle response submission
    socket.on('submitResponse', async (data) => {
      try {
        const { surveyId, questionId, response } = data;
        const participant = activeParticipants.get(socket.id);
        
        if (!participant || participant.surveyId !== surveyId) {
          return socket.emit('error', { message: 'Not authorized to submit to this survey' });
        }
        
        // Save response to database
        const newResponse = new Response({
          surveyId,
          questionId,
          response,
          participant: {
            nickname: participant.nickname
          }
        });
        
        await newResponse.save();
        
        // Emit to presenters in real-time
        io.to(`presenter:${surveyId}`).emit('newResponse', {
          questionId,
          response,
          participant: participant.nickname,
        });
        
        // Confirm to participant
        socket.emit('responseSubmitted', { questionId });
        
        // Update aggregate results for everyone
        updateAggregateResults(io, surveyId, questionId);
        
        console.log(`Response submitted to survey ${surveyId}, question ${questionId} by ${participant.nickname}`);
      } catch (error) {
        console.error('Error in submitResponse:', error);
        socket.emit('error', { message: 'Failed to submit response' });
      }
    });
    
    // Handle presenter controlling survey flow
    socket.on('controlSurvey', (data) => {
      try {
        const { surveyId, action, questionId } = data;
        const presenter = activePresenters.get(socket.id);
        
        if (!presenter || presenter.surveyId !== surveyId) {
          return socket.emit('error', { message: 'Not authorized to control this survey' });
        }
        
        switch (action) {
          case 'start':
            io.to(`survey:${surveyId}`).emit('surveyStarted', { surveyId });
            break;
          case 'next':
            io.to(`survey:${surveyId}`).emit('showQuestion', { questionId });
            break;
          case 'previous':
            io.to(`survey:${surveyId}`).emit('showQuestion', { questionId });
            break;
          case 'end':
            io.to(`survey:${surveyId}`).emit('surveyEnded', { surveyId });
            break;
          case 'reveal':
            io.to(`survey:${surveyId}`).emit('resultsRevealed', { questionId });
            break;
          default:
            io.to(`survey:${surveyId}`).emit('surveyControl', { action, questionId });
        }
        
        console.log(`Survey ${surveyId} control: ${action}`);
      } catch (error) {
        console.error('Error in controlSurvey:', error);
        socket.emit('error', { message: 'Failed to control survey' });
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      try {
        // Handle presenter disconnect
        if (activePresenters.has(socket.id)) {
          const { surveyId, userId } = activePresenters.get(socket.id);
          console.log(`Presenter ${userId} disconnected from survey ${surveyId}`);
          activePresenters.delete(socket.id);
        }
        
        // Handle participant disconnect
        if (activeParticipants.has(socket.id)) {
          const { surveyId, nickname } = activeParticipants.get(socket.id);
          activeParticipants.delete(socket.id);
          
          // Update participant count for presenter
          const participantCount = getParticipantCount(surveyId);
          io.to(`presenter:${surveyId}`).emit('participantLeft', { 
            nickname, 
            count: participantCount
          });
          
          console.log(`Participant ${nickname} disconnected from survey ${surveyId}`);
        }
        
        console.log('Client disconnected:', socket.id);
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });
  
  // Helper function to get participant count for a survey
  function getParticipantCount(surveyId) {
    let count = 0;
    activeParticipants.forEach(participant => {
      if (participant.surveyId === surveyId) count++;
    });
    return count;
  }
  
  // Helper function to update aggregate results
  async function updateAggregateResults(io, surveyId, questionId) {
    try {
      const responses = await Response.find({ surveyId, questionId });
      
      if (responses.length === 0) return;
      
      // Group and count responses
      const counts = {};
      const textResponses = [];
      
      responses.forEach(r => {
        if (typeof r.response === 'string' && r.response.length > 30) {
          // Likely a text response
          textResponses.push(r.response);
        } else if (Array.isArray(r.response)) {
          // Multiple choice with multiple selections
          r.response.forEach(val => {
            counts[val] = (counts[val] || 0) + 1;
          });
        } else {
          // Single value response
          counts[r.response] = (counts[r.response] || 0) + 1;
        }
      });
      
      const aggregateData = {
        counts,
        textResponses,
        totalResponses: responses.length
      };
      
      // Emit to everyone in the survey room
      io.to(`survey:${surveyId}`).emit('aggregateResults', { 
        questionId, 
        results: aggregateData 
      });
    } catch (error) {
      console.error('Error updating aggregate results:', error);
    }
  }
};

module.exports = { setupSockets };