require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectToMongoDB = require('./config/db.config');

// PORT initialization
const PORT = process.env.PORT || 5000;

// App initialization
const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Listening to server
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on PORT: ${PORT}`);
});
