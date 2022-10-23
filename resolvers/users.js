const { User } = require('../models/User.model');
const { registerUser, loginUser } = require('../services/auth');

const users = {
  Query: {
    // Find User
    user: (_, { id }) => User.findById(id).exec(),

    // Login User
    loginUser: async (_, { loginInput }) => loginUser({ ...loginInput }),
  },
  Mutation: {
    // Register User
    registerUser: async (_, { registerInput }) =>
      registerUser({ ...registerInput }),
  },
};

module.exports = users;
