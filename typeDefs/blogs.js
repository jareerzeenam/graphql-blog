const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # // ! Dataloader 2 start
  #  // * Case 1
  type OwnerBlogs {
    id: ID!
    username: String!
    blogs: [Blog]
  }

  # // * Case 2
  type Owner {
    id: ID
    username: String
  }

  # // * Case 2
  type Blogs {
    id: ID
    title: String
    description: String
    author: String
    categoryId: Int
    owner: Owner!
  }
  # // ! Dataloader 2 end

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
    # //! Dataloader 2 start
    # // * Case 1
    showOwnerBlogs(userIds: [String!]): [OwnerBlogs]
    # // * Case 2
    showBlogsOwner(blogIds: [String!]): [Blogs]
    # // * Case 3
    blogs(ids: [String!]): [Blog]
    # //! Dataloader 2 end

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
