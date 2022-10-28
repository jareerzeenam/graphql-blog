const BlogRepository = require('../../repositories/blog-repository');
const { Blog } = require('../../models/Blog.model');
const { connectDB, dropDB, dropCollections } = require('../testDbSetup');
const ValidationError = require('../../errors/ValidationError');

const userId = '635baf1de6b7a26ca4fe2a94';
const fakeMongoId = '635c271be38a8cbc3e16c484';
const invalidMongoId = '635c271be38a8cbc3e16c4841234';

const blogData = {
  title: 'My first blog',
  description: 'Test blog description',
  author: userId,
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

    test('should throw error if invalid blog ID', async () => {
      expect.assertions(1);
      try {
        const blogRepository = new BlogRepository();
        const blog = await blogRepository.find(invalidMongoId);
        expect(blog).toThrow(ValidationError);
      } catch (error) {
        expect(error.message).toBe('Invalid Blog ID!');
      }
    });

    test('should return null if blog does not exist', async () => {
      const blogRepository = new BlogRepository();
      const record = await blogRepository.find(fakeMongoId);
      expect(record).toBe(null);
    });
  });

  describe('findByUser()', () => {
    test('should find blogs by user ID', async () => {
      const blogRepository = new BlogRepository();

      const blog1 = await blogRepository.create({
        title: 'My first blog',
        description: 'First Test blog description',
        author: userId,
        categoryId: 1,
      });

      const blog2 = await blogRepository.create({
        title: 'My second blog',
        description: 'Second Test blog description',
        author: fakeMongoId,
        categoryId: 2,
      });

      const blog3 = await blogRepository.create({
        title: 'My third blog',
        description: 'Third Test blog description',
        author: userId,
        categoryId: 3,
      });

      const blog4 = await blogRepository.create({
        title: 'My fourth blog',
        description: 'Third Test blog description',
        author: fakeMongoId,
        categoryId: 5,
      });

      const { data } = await blogRepository.findByUser(userId);

      // Result should contain the given userID
      expect(data).toEqual(
        expect.arrayContaining([expect.objectContaining({ author: userId })])
      );

      // Result length should match 2
      expect(data.length).toBe(2);

      // Results should contain blogs that match the blog ID
      const shouldAppear = [blog1, blog3];
      shouldAppear.forEach((blog) => {
        expect(data.map((item) => item)).toEqual(
          expect.arrayContaining([expect.objectContaining(blog._doc)])
        );
      });

      // Results should not contain other blogs
      const shouldNotAppear = [blog2, blog4];
      shouldNotAppear.forEach((blog) => {
        expect(data.map((item) => item)).not.toEqual(
          expect.arrayContaining([expect.objectContaining(blog._doc)])
        );
      });
    });
  });

  describe('update()', () => {
    test('should update a blog', async () => {
      const blogRepository = new BlogRepository();
      const blog = await blogRepository.create(blogData);
      const record = {
        id: blog.id,
        title: 'Updated Blog Title',
        description: 'Updated Blog Description',
        categoryId: 1,
      };
      const updatedBlog = await blogRepository.update(record);
      expect(updatedBlog).toMatchObject(record);
    });

    test('should be a valid blog ID', async () => {
      const record = {
        id: invalidMongoId,
        title: 'Updated Blog Title',
        description: 'Updated Blog Description',
        categoryId: 1,
      };

      expect.assertions(1);
      try {
        const blogRepository = new BlogRepository();
        const updatedBlog = await blogRepository.update(record);
        expect(updatedBlog).toThrow(ValidationError);
      } catch (error) {
        expect(error.message).toBe('Invalid Blog ID!');
      }
    });

    test('should return null if blog does not exist', async () => {
      const blogRepository = new BlogRepository();
      const record = await blogRepository.update({
        id: fakeMongoId,
      });
      expect(record).toBe(null);
    });
  });

  describe('delete()', () => {
    test('should delete a blog', async () => {
      const blogRepository = new BlogRepository();
      const blog = await blogRepository.create(blogData);
      const response = await blogRepository.delete(blog.id);
      expect(response).toBe('Blog Deleted Successfully!');
    });

    test('should throw error if invalid blog ID', async () => {
      expect.assertions(1);
      try {
        const blogRepository = new BlogRepository();
        const blog = await blogRepository.delete(invalidMongoId);
        expect(blog).toThrow(ValidationError);
      } catch (error) {
        expect(error.message).toBe('Invalid Blog ID!');
      }
    });
  });
});
