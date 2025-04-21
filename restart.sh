#!/bin/bash
# Kill any existing node processes
killall node 2>/dev/null || true
echo "Killed all Node processes"

# Wait a moment for ports to be released
sleep 2

# Start server
cd server
npm run dev &
echo "Server started on port 3000"

# Wait for server to initialize
sleep 3

# Start client (on a different port)
cd ../client
npm start &
echo "Client started on port 3001"

echo "Both processes are now running"