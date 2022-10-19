const { gql } = require('apollo-server-express');

const typeDefs = gql`
  "Pagination Inputs"
  input PaginationInput {
    offset: Int!
    limit: Int!
  }

  "Sort Order Ascending/Descending"
  enum SortOrder {
    ASC
    DESC
  }

  "Sort inputs"
  input SortInput {
    fieldName: String!
    order: SortOrder!
  }

  # Blog Object is in ./core.js

  "Blog List"
  type BlogList {
    data: [Blog]
    total: Int
    offset: Int
    limit: Int
  }

  "Blog Queries"
  type Query {
    "Test"
    hello: String
    "Gets all the Blogs"
    getAllBlogs(paginate: PaginationInput, sort: SortInput): BlogList
    "Get single blog by ID"
    showBlog(blogId: String!): Blog
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
