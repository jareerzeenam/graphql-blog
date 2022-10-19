const { gql } = require('apollo-server-express');

const typeDefs = gql`
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
  }
`;

module.exports = typeDefs;
