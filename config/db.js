const mongoose = require('mongoose');
const env = process.env.NODE_ENV || 'development';
const config = require('./database')[env];

const connectDB = async () => {
  try {
    // Add MONGO_URI to ./config/.env
    const conn = await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('DB Connection failed!', error);
    process.exit(1);
  }
};

module.exports = connectDB;
