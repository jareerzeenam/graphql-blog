const { sampleFunction } = require('../services/sample-function');
const { createBlog, showBlog, getAllBlogs } = require('../services/blogs');

const blogs = {
  Query: {
    hello: () => sampleFunction(),

    getAllBlogs: async (_, { paginate, sort }) =>
      getAllBlogs({
        paginate,
        sort,
      }),

    showBlog: async (_, { blogId }) => showBlog(blogId),
  },

  Mutation: {
    createBlog: async (_, { blog }) => createBlog({ ...blog }),
  },
};

module.exports = blogs;
