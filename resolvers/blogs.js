const { sampleFunction } = require('../services/sample-function');
const {
  createBlog,
  showBlog,
  getAllBlogs,
  deleteBlog,
  updateBlog,
  showMyBlogs,
} = require('../services/blogs');

const blogs = {
  Query: {
    hello: () => sampleFunction(),

    getAllBlogs: async (_, { paginate, sort }) =>
      getAllBlogs({
        paginate,
        sort,
      }),

    showBlog: async (_, { blogId }, req) => {
      if (!req.isAuth) throw new Error('Unauthenticated!');

      return showBlog(blogId);
    },

    showMyBlogs: (_, { paginate, sort }, { isAuth, userId }) =>
      showMyBlogs({ paginate, sort, isAuth, userId }),
  },

  Mutation: {
    createBlog: async (_, { blog }, { isAuth, userId }) =>
      createBlog({ ...blog, isAuth, userId }),

    updateBlog: async (_, { id, blog }, { isAuth, userId }) =>
      updateBlog({ id, ...blog, isAuth, userId }),

    deleteBlog: async (_, blogId, { isAuth, userId }) =>
      deleteBlog({ ...blogId, isAuth, userId }),
  },
};

module.exports = blogs;

// TODO :: Unit test required for above Queries and Mutations (Out of scope)
