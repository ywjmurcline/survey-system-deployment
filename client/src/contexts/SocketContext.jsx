import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to socket server - use the same URL as the API
    const SOCKET_URL = 'http://localhost:3000';
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    
    console.log('Socket connecting to:', SOCKET_URL);
    
    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    // Clean up on unmount
    return () => {
      console.log('Disconnecting socket');
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};