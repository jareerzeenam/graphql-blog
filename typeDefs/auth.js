const { gql } = require('apollo-server-express');

const typeDefs = gql`
  "User Object"
  type User {
    username: String
    email: String
    password: String
    token: String
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

  type Query {
    "Login User"
    loginUser(loginInput: LoginInput): User
  }

  type Mutation {
    "Register User"
    registerUser(registerInput: RegisterInput): User
  }
`;

module.exports = typeDefs;
