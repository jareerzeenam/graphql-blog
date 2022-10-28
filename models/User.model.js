const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
  },
  roles: {
    type: Array,
    default: ['User'],
  },
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('user', UserSchema);

module.exports = { mongoose, User };
