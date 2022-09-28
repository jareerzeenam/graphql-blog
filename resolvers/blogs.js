const BlogRepository = require('../repositories/blog-repository');

const blogs = {
  Query: {
    hello: () => {
      return 'Hello World';
    },
    getAllBlogs: async () => {
      const blogRepository = new BlogRepository();
      const { data } = await blogRepository.findAllBlogs();
      return data;
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
