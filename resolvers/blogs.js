const DataLoader = require('dataloader');
const { User } = require('../models/User.model');
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

// ! Data Loader Test
const getBlogOwnerByIds = async (ids) => {
  // ids.forEach((id) => {
  //   if (!mongoose?.Types.ObjectId.isValid(id))
  //     throw new ValidationError('Invalid Blog ID!');
  // });

  console.log('DATALOADER NEW called', ids);

  const owner = await User.where('_id').in(ids);

  return owner;
};

// ! Data Loader Test
const dataLoader = new DataLoader(getBlogOwnerByIds);

const blogs = {
  //! DATALOADER TEST
  Blogs: {
    owner: async (parent, _) => owner({ parent }),
  },
  Query: {
    //! DATALOADER TEST
    blogs: async () => dataloaderBlogs(),

    //! DATALOADER TEST
    showOwner: async (_, { ids }) => {
      // console.log(`IDS :: ${ids}`);

      const owners = [];
      await Promise.all(
        ids.map(async (id) => {
          console.log('MAP :: ', id);
          const owner = await dataLoader.load(id);
          owners.push(owner);
        })
      );

      return owners;
    },

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
