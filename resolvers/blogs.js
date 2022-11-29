const { sampleFunction } = require('../services/sample-function');
const {
  createBlog,
  showBlog,
  getAllBlogs,
  deleteBlog,
  updateBlog,
  showMyBlogs,
} = require('../services/blogs');

// ! Dataloader 2 start
const { Blog } = require('../models/Blog.model');
const { User } = require('../models/User.model');
const DataLoader = require('dataloader');
// ! Dataloader 2 end

// ! Dataloader 2 start
const getOwnerBlogsByIds = async (userIds) => {
  console.log('DATALOADER NEW called', userIds);

  const blogs = await Blog.where('author').in(userIds);

  return blogs;
};
// ! Dataloader 2 end

// ! Dataloader 2 start
const dataLoader = new DataLoader(getOwnerBlogsByIds);
// ! Dataloader 2 end

const blogs = {
  // ! Dataloader 2 start
  OwnerBlogs: {
    blogs: async (parent, _) => {
      console.log('Child Called', parent.id);

      const blog = await dataLoader.load(parent.id);

      return blog;

      // const blogs = await Blog.where('author').in(parent.id);
      // return blogs;
    },
  },
  // ! Dataloader 2 end
  Query: {
    // ! Dataloader 2 start
    showOwnerBlogs: async (_, { ids }) => {
      // console.log('D', dataloader);
      // console.log('Parent Called', ids);
      // const owner = await User.where('_id').in(ids);
      // return owner;

      const data = await User.find().limit(1).sort({ createdAt: -1 });
      return data;
    },
    // ! Dataloader 2 end

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
