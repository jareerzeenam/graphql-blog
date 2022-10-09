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
    test('should create a blog', async () => {
      const blogRepository = new BlogRepository();
      const blog = await blogRepository.create(blogData);
      const record = await Blog.findById(blog.id);
      expect(record).toMatchObject(blogData);
    });
  });
  describe('findAllBlogs()', () => {
    test('should show all blogs', async () => {
      const blogRepository = new BlogRepository();

      const blog1 = await blogRepository.create({
        title: 'My first blog',
        description: 'First Test blog description',
        author: 'Test Author 1',
        categoryId: 1,
      });

      const blog2 = await blogRepository.create({
        title: 'My second blog',
        description: 'Second Test blog description',
        author: 'Test Author 2',
        categoryId: 2,
      });

      const blog3 = await blogRepository.create({
        title: 'My third blog',
        description: 'Third Test blog description',
        author: 'Test Author 3',
        categoryId: 3,
      });

      const { data } = await blogRepository.findAllBlogs();

      // Result total should match 3
      expect(data.length).toBe(3);

      // Result contain the above seeded data.
      expect(data).toEqual(
        expect.arrayContaining([expect.objectContaining(blog1._doc)]),
        expect.arrayContaining([expect.objectContaining(blog2._doc)]),
        expect.arrayContaining([expect.objectContaining(blog3._doc)])
      );
    });
  });

  describe('find()', () => {
    test('should find a blog by ID', async () => {
      const blogRepository = new BlogRepository();
      const blog = await blogRepository.create(blogData);
      const record = await blogRepository.find(blog.id);
      expect(record).toMatchObject(blogData);
    });
  });
});
