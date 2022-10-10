const { gql } = require('apollo-server-express');

const typeDefs = gql`
  input PaginationInput {
    offset: Int!
    limit: Int!
  }

  enum SortOrder {
    ASC
    DESC
  }

  input SortInput {
    fieldName: String!
    order: SortOrder!
  }

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

  type BlogList {
    data: [Blog]
    total: Int
    offset: Int
    limit: Int
  }

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
