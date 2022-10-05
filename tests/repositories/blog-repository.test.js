const BlogRepository = require('../../repositories/blog-repository');
const Blog = require('../../models/Blog.model');
const { connectDB, dropDB, dropCollections } = require('../testDbSetup');

const blogData = {
  title: 'My first blog',
  description: 'Test blog description',
  author: 'Test Author',
  categoryId: 1,
};

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await dropCollections();
});

afterAll(async () => {
  await dropDB();
});

describe('repositories/blog-repository', () => {
  describe('create()', () => {
    test('should create blog', async () => {
      const blogRepository = new BlogRepository();
      const blog = await blogRepository.create(blogData);
      const record = await Blog.findById(blog.id);
      expect(record).toMatchObject(blogData);
    });
  });
});
