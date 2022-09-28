const Blog = require('../models/Blog.model');

const blogs = {
  Query: {
    hello: () => {
      return 'Hello World';
    },
    getAllBlogs: async () => {
      return await Blog.find();
    },
  },

  Mutation: {
    createBlog: async (_, args) => {
      const { title, description, author, categoryId } = args.blog;
      const blog = new Blog({ title, description, author, categoryId });
      await blog.save();
      return blog;
    },
  },
};

module.exports = blogs;
