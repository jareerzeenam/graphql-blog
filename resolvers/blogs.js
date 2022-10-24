const { sampleFunction } = require('../services/sample-function');
const { createBlog, showBlog, getAllBlogs } = require('../services/blogs');

const blogs = {
  Query: {
    hello: async () => sampleFunction(),

    getAllBlogs: async (_, { paginate, sort }) =>
      getAllBlogs({
        paginate,
        sort,
      }),

    showBlog: async (_, { blogId }, req) => {
      if (!req.isAuth) throw new Error('Unauthenticated!');

      return showBlog(blogId);
    },

    // TODO :: Query to get user's blogs (find by author ID)
  },

  Mutation: {
    createBlog: async (_, { blog }, { isAuth, userId }) =>
      createBlog({ ...blog, isAuth, userId }),

    // TODO :: Mutation to DELETE Blog (Check if the logged user is deleting blogs owned by them)

    // TODO :: Mutation to UPDATE Blog (Check if the logged user is updating blogs owned by them)
  },
};

module.exports = blogs;

// TODO :: Unit test required for above Queries and Mutations (Out of scope)
