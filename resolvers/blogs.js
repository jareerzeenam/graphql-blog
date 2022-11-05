const { sampleFunction } = require('../services/sample-function');
const {
  createBlog,
  showBlog,
  getAllBlogs,
  deleteBlog,
  updateBlog,
  showMyBlogs,
  dataloaderBlogs,
  owner,
} = require('../services/blogs');

const blogs = {
  //! DATALOADER TEST
  Blogs: {
    owner: async (parent, _) => owner({ parent }),
  },
  Query: {
    //! DATALOADER TEST
    blogs: async () => dataloaderBlogs(),

    hello: () => sampleFunction(),

    getAllBlogs: async (_, { paginate, sort }) =>
      getAllBlogs({
        paginate,
        sort,
      }),

    showBlog: async (_, id, { isAuth, userId }) =>
      showBlog({ ...id, isAuth, userId }),

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
