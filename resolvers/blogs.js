const BlogRepository = require('../repositories/blog-repository');
const { sampleFunction } = require('../services/sample-function');

const blogs = {
  Query: {
    hello: () => sampleFunction(),
    getAllBlogs: async (_, { paginate, sort }) => {
      const blogRepository = new BlogRepository();
      const { data, offset, limit, total } = await blogRepository.findAllBlogs(
        paginate,
        sort
      );

      return { data, offset, limit, total };
    },
    showBlog: async (_, { blogId }) => {
      const blogRepository = new BlogRepository();
      return await blogRepository.find(blogId);
    },
  },

  Mutation: {
    createBlog: async (_, args) => {
      const blogRepository = new BlogRepository();
      const blog = await blogRepository.create(args.blog);
      return blog;
    },
  },
};

module.exports = blogs;
