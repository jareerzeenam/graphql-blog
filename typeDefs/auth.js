const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    username: String
    email: String
    password: String
    token: String
  }

  input RegisterInput {
    username: String
    email: String
    password: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type Query {
    loginUser(loginInput: LoginInput): User
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): User
  }
`;

module.exports = typeDefs;
