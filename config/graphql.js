const { resolve } = require('path');
require('dotenv').config({ path: resolve(__dirname, '../config/.env') });

module.exports = {
  prefix: process.env.SCHEMA_PREFIX, // Prefix for GraphQL schema
};
