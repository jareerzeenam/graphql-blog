const { gql } = require('apollo-server-express');

const typeDefs = gql`
  "Pagination Inputs"
  input PaginationInput {
    offset: Int!
    limit: Int!
  }

  "Sort by Ascending or Descending order"
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
    "Test Hello World"
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
    categoryId: Int
  }

  "Create Blog Mutation"
  type Mutation {
    "Create a new blog"
    createBlog(blog: BlogInput): Blog

    "Delete a blog by ID"
    deleteBlog(id: ID!): String

    "Update blog"
    updateBlog(id: ID!, blog: BlogInput): Blog
  }
`;

module.exports = typeDefs;
