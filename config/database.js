const mongoose = require('mongoose');
require('dotenv').config();

// Establish connection with the database
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

connect(); // Connect to the database immediately upon importing this module

// export connection
module.exports = connect;
