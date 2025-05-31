require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectToMongoDB = require('./config/db.config');
const authRoutes = require('./routes/auth.routes');
const pollRoutes = require('./routes/poll.routes');

// PORT initialization
const PORT = process.env.PORT || 8000;

// App initialization
const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Api routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/polls', pollRoutes);

// Route to hit by the cron job server to keep the render server alive to avoid cold start
app.get('/ping', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is awake' });
});

// Listening to server
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on PORT: ${PORT}`);
});
