const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # //! DATALOADER TEST
  type Owner {
    id: ID
    username: String
  }
  # //! DATALOADER TEST
  type Blogs {
    id: ID
    title: String
    description: String
    author: String
    categoryId: Int
    owner: Owner!
  }
  # //! DATALOADER TEST End

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
    # //! DATALOADER TEST
    "Test Data loader"
    blogs: [Blogs]

    showOwner(ids: [String]): [Owner]

    "Test Hello World"
    hello: String

    "Gets all the Blogs"
    getAllBlogs(paginate: PaginationInput, sort: SortInput): BlogList

    "Get single blog by ID - Authorization Token Required"
    showBlog(id: String!): Blog

    "Show blogs belongs to the logged user"
    showMyBlogs(paginate: PaginationInput, sort: SortInput): BlogList
  }

  "Blog Input Fields"
  input BlogInput {
    title: String!
    description: String
    categoryId: Int
  }

  "Create Blog Mutation"
  type Mutation {
    "Create a new blog - Authorization Token & Specific Role Required"
    createBlog(blog: BlogInput): Blog @auth(roles: ["User", "Admin"])

    "Delete a blog by ID - Authorization Token & Specific Role Required"
    deleteBlog(id: ID!): String @auth(roles: ["Admin", "User"])

    "Update blog - Authorization Token & Specific Role Required"
    updateBlog(id: ID!, blog: BlogInput): Blog @auth(roles: ["User", "Admin"])
  }
`;

module.exports = typeDefs;
