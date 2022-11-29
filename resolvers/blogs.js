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
// ! Dataloader 2 end

const blogs = {
  // ! Dataloader 2 start
  // * Case 1 Child
  OwnerBlogs: {
    blogs: async (owner, _, { dataloader }) => {
      // const blogs = await Blog.where('author').in(owner.id);
      console.log('Child Blogs Called :: Case 1 (Chile)');
      const blogs = await dataloader.loaders.ownerBlogsLoader.load(owner.id); // Promise length issue https://github.com/graphql/dataloader#:~:text=There%20are%20a,York%27%20%7D%0A%5D
      return blogs;
    },
  },

  // * Case 2 Child
  Blogs: {
    owner: async (blog, _, { dataloader }) => {
      // const owner = await User.where('_id').in(ids);
      console.log('Child Owner Called :: Case 2 (Chile)');
      const owner = await dataloader.loaders.blogsOwnerLoader.load(blog.author);
      return owner;
    },
  },
  // ! Dataloader 2 end
  Query: {
    // ! Dataloader 2 start
    // * Case 1
    showOwnerBlogs: async (_, { userIds }) => {
      console.log('Parent showOwnerBlogs Called :: Case 1 (Parent)');
      const owners = await User.where('_id').in(userIds);
      return owners;
    },

    // * Case 2
    showBlogsOwner: async (_, { blogIds }) => {
      console.log('Parent showBlogsOwner Called :: Case 2 (Parent)');
      const blogs = await Blog.where('_id').in(blogIds);
      return blogs;
    },

    // * Case 3
    blogs: async (_, { ids }, { dataloader }) => {
      // const blogs = await Blog.where('_id').in(ids);
      console.log('Parent blogs Called :: Case 3');
      const blogs = [];
      await Promise.all(
        ids.map((id) => {
          const blog = dataloader.loaders.blogsLoader.load(id);
          blogs.push(blog);
        })
      );
      return blogs;
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
