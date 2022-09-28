const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Add MONGO_URI to ./config/.env
    const conn = await mongoose.connect(process.env.MONGO_URI, {
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
