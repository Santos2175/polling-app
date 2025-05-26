# Polling Application

A modern real-time polling application built with Node.js, Express, and React. This application allows users to create polls, vote on them, and view results in real-time.

## 🚀 Features

- Create and manage polls
- Real-time voting and results
- User authentication and authorization
- Responsive design
- File upload support
- Docker support for easy development

## 🛠️ Tech Stack

### Backend

- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.IO for real-time updates
- Multer for file uploads

### Frontend

- React with Vite
- TailwindCSS for styling
- Socket.IO Client
- Axios for API requests

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized development)
- MongoDB (if running locally)

## 🚀 Getting Started

### Environment Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd polling-app
```

2. Create environment files:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp client/.env.example client/.env
```

3. Update the environment variables in both `.env` files with your configuration.

### Development with Docker

1. Build and start the containers:

```bash
docker-compose up --build
```

2. Access the applications:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

### Development without Docker

#### Backend Setup

```bash
cd backend
npm install
npm run dev
```

#### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## 📁 Project Structure

```
polling-app/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middlewares/    # Custom middlewares
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── uploads/        # File upload directory
├── client/
│   ├── public/         # Static files
│   └── src/
│       ├── components/ # React components
│       ├── pages/      # Page components
│       ├── services/   # API services
│       └── utils/      # Utility functions
└── docker-compose.yml  # Docker configuration
```

## 🔧 Configuration

### Backend Environment Variables

```
PORT=8000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend Environment Variables

```
VITE_API_URL=http://localhost:8000
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd client
npm test
```

## 📝 API Documentation

The API documentation is available at `/api-docs` when running the backend server.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- List any acknowledgments here
