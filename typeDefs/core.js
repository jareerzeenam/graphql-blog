const { gql } = require('apollo-server-express');

const typeDefs = gql`
  "Auth directive for permissions and roles"
  directive @auth(
    "Authorization to check if the requested user has the correct role/roles to access specific schema"
    roles: [String]
  ) on OBJECT | FIELD_DEFINITION

  "Blog Object"
  type Blog {
    "Blog ID"
    id: ID
    "Blog Title"
    title: String
    "Blog Description"
    description: String
    "Blog Author Name"
    author: String
    "Blog Category"
    categoryId: Int
    "Blog Created At"
    createdAt: String
  }
`;

module.exports = typeDefs;
