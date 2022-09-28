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

  type Query {
    "Test"
    hello: String
    "Gets all the Blogs"
    getAllBlogs: [Blog]
  }

  "Blog Input Fields"
  input BlogInput {
    title: String!
    description: String
    author: String
    categoryId: Int
  }

  "Create Blog Mutation"
  type Mutation {
    "Create a new blog"
    createBlog(blog: BlogInput): Blog
  }
`;

module.exports = typeDefs;
