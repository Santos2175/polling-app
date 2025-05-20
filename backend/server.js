require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectToMongoDB = require('./config/db.config');
const authRoutes = require('./routes/auth.routes');

// PORT initialization
const PORT = process.env.PORT || 5000;

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

// Listening to server
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on PORT: ${PORT}`);
});
