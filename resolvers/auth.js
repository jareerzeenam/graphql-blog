const {
  registerUser,
  loginUser,
  sendResetPasswordEmail,
  resetPassword,
} = require('../services/auth');

const users = {
  Query: {
    // Login User
    loginUser: async (_, { loginInput }) =>
      loginUser({ ...loginInput }),

    // Send Reset Password Email
    sendResetPasswordEmail: async (_, { email }) =>
      sendResetPasswordEmail(email),
  },
  Mutation: {
    // Register User
    registerUser: async (_, { registerInput }) =>
      registerUser({ ...registerInput }),

    // Reset Password
    resetPassword: async (_, { resetPasswordInput }) =>
      resetPassword({ ...resetPasswordInput }),
  },
};

module.exports = users;
