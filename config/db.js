const mongoose = require('mongoose');
const env = process.env.NODE_ENV || 'development';
const config = require('./database')[env];

let isConnected = null;

const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB:: Using existing connected database!');
  }

  try {
    // Add MONGO_URI to ./config/.env
    const conn = await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 100,
    });

    //Assign isConnected if connected to DB
    isConnected = mongoose.connection.readyState;

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('DB Connection failed!', error);
    process.exit(1);
  }
};

module.exports = connectDB;
