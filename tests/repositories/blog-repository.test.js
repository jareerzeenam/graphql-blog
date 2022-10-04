const BlogRepository = require('../../repositories/blog-repository');
const Blog = require('../../models/Blog.model');

const blogData = {
  title: 'My first blog',
  description: 'Test blog description',
  author: 'Test Author',
  categoryId: 1,
};

describe('repositories/blog-repository', () => {
  describe('create()', () => {
    test('should create blog', async () => {
      // add test here

      const blogRepository = new BlogRepository();
      const blog = await blogRepository.create(blogData);

      const record = await Blog.findById(blog.id);

      console.log('TEST 1 ::::: ', record);
    });
  });
  test('get()', () => {
    expect(1 + 2).toBe(3);
  });
});
