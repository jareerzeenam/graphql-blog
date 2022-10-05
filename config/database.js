const { resolve } = require('path');

// Load config
require('dotenv').config({ path: resolve(__dirname, './.env') });

module.exports = {
  //dev
  development: {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SCHEMA_PREFIX: process.env.SCHEMA_PREFIX,
  },
  //stage
  stage: {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SCHEMA_PREFIX: process.env.SCHEMA_PREFIX,
  },
  //prod
  production: {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SCHEMA_PREFIX: process.env.SCHEMA_PREFIX,
  },
};
