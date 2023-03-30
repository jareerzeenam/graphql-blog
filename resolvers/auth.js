const { registerUser, loginUser } = require('../services/auth');

const users = {
  Query: {
    // Login User
    loginUser: async (_, { loginInput }) =>
      loginUser({ ...loginInput }),
  },
  Mutation: {
    // Register User
    registerUser: async (_, { registerInput }) =>
      registerUser({ ...registerInput }),
  },
};

module.exports = users;
