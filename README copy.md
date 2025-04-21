# Survey-System

## Interactive Real-Time Survey Platform

Quizlet is web application that allows users to create interactive surveys, polls, and quizzes that can be presented in real-time. Participants can join using a unique code and respond from any device, with results updating live on the presenter's screen.

## 🚀 Features

- **Real-Time Interaction**: Live polling with instant result updates
- **Multiple Question Types**: Support for multiple-choice, open-ended questions, and more
- **Presenter Mode**: Dedicated view with participant counter and results visualization
- **Participant View**: Mobile-friendly interface for audience participation
- **Result Visualization**: Beautiful charts and graphs to display response data
- **User Authentication**: Secure account creation and management
- **Survey Management**: Create, edit, and delete surveys

## 💻 Technologies

### Frontend:
- React
- React Router
- Axios
- Socket.IO Client
- Chart.js
- Framer Motion

### Backend:
- Node.js
- Express
- MongoDB
- Socket.IO
- JWT Authentication

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## ⚙️ Installation

### Clone the repository
```bash
git clone https://github.com/yourusername/Survey-System.git
cd Survey-System
```

### Install backend dependencies
```bash
cd server
npm install
```

### Configure environment variables
Create a `.env` file in the server directory:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/survey-system
JWT_SECRET=your_jwt_secret_key
```

### Install frontend dependencies
```bash
cd ../client
npm install
```

## 🚀 Running the Application

### Docker Setup

If you have Docker installed, you can run the application using Docker Compose. This will set up the backend server, MongoDB, and frontend client in separate containers. The `docker-compose.yml` file is already configured for you.

```bash
# Clone the repository
git clone https://github.com/yourusername/Survey-System.git
cd Survey-System

# Start all services (client, server, MongoDB)
docker-compose up
```

This will:

1. build the client container from the Dockerfile in the `client` directory
2. build the server container from the Dockerfile in the `server` directory
3. start the MongoDB container
4. link all three services together

### Start the backend server
```bash
cd server
npm run dev
```

### Start the frontend development server
```bash
cd client
npm start
```

### Start the Mongodb server
```bash
brew services start mongodb-community
```

The application will be available at http://localhost:3001 and https://localhost:3002

## 📱 Usage

### Creating a Survey
1. Register or log in to your account
2. Navigate to the Dashboard
3. Click "Create New Survey"
4. Add questions and configure options
5. Save your survey

### Presenting a Survey
1. From the Dashboard, click "Present" on any survey
2. Share the displayed code with participants
3. Click "Start Survey" to begin
4. Navigate through questions using the Next/Previous buttons

### Joining as a Participant
1. Go to the Join page or scan the QR code
2. Enter the survey code
3. Respond to questions as they are presented

## 📁 Project Structure

```
Survey-System/
├── client/                  # Frontend React application
│   ├── public/              # Static files
│   ├── src/                 # Source files
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── styles/          # CSS files
│   │   ├── App.jsx          # Main App component
│   │   └── index.js         # Entry point
│   └── package.json         # Frontend dependencies
├── server/                  # Backend Node.js application
│   ├── controllers/         # Route controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── app.js               # Express app setup
│   ├── server.js            # Server entry point
│   └── package.json         # Backend dependencies
└── README.md                # Project documentation
```

## 🔮 Future Enhancements

- Word cloud visualization
- Quiz mode with scoring
- Customizable themes
- Data export functionality
- Teams and collaboration features
- Advanced analytics

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Socket.IO](https://socket.io/)
- [Chart.js](https://www.chartjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

---

Developed with ❤️ by COMP3421 
