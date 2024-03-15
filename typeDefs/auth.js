const { gql } = require('apollo-server-express');

const typeDefs = gql`
  "User Object"
  type User {
    username: String
    email: String
    password: String
    token: String
  }

  type Message {
    message: String
  }

  "Register from inputs"
  input RegisterInput {
    username: String
    email: String
    password: String
  }

  "Login form inputs"
  input LoginInput {
    email: String
    password: String
  }

  "Reset Password inputs"
  input ResetPasswordInput {
    email: String
    token: String
    newPassword: String
  }

  type Query {
    "Send Reset Password Email"
    sendResetPasswordEmail(email: String!): Message
  }

  type Mutation {
    "Register User"
    registerUser(registerInput: RegisterInput): User

    "Login User"
    loginUser(loginInput: LoginInput): User

    "Reset Password"
    resetPassword(resetPasswordInput: ResetPasswordInput): User

    # "Logout User"
    # logoutUser(logoutInput: LogoutInput): Message
  }
`;

module.exports = typeDefs;
