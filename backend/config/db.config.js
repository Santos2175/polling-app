const mongoose = require('mongoose');

// Function to connect to mongo database
const connectToMongoDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error(
        `Connection URI is missing. Please include in your environment variables`
      );
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');
  } catch (error) {
    console.error(`Error connecting to database`, error);
    process.exit(1);
  }
};

module.exports = connectToMongoDB;
