const {
  registerUser,
  loginUser,
  sendResetPasswordEmail,
  resetPassword,
} = require('../services/auth');

const users = {
  Query: {
    // Send Reset Password Email
    sendResetPasswordEmail: async (_, { email }) =>
      sendResetPasswordEmail(email),
  },
  Mutation: {
    // Register User
    registerUser: async (_, { registerInput }) =>
      registerUser({ ...registerInput }),

    // Login User
    loginUser: async (_, { loginInput }) =>
      loginUser({ ...loginInput }),

    // Reset Password
    resetPassword: async (_, { resetPasswordInput }) =>
      resetPassword({ ...resetPasswordInput }),
  },
};

module.exports = users;
