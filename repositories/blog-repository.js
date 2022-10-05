const Blog = require('../models/Blog.model');

class BlogRepository {
  /**
   * Create a new blog in database.
   *
   * @param {Object} payload - The payload for blog.
   * @returns {Blog}
   */
  async create(payload) {
    const blog = new Blog(payload);
    await blog.save();
    return blog;
  }

  /**
   * Get All Blogs in database.
   *
   * @returns {{data: array}}
   */
  async findAllBlogs() {
    const data = await Blog.find();
    return { data };
  }

  /**
   * Find a Blog by ID
   *
   *  @returns {Blog}
   */
  async find(id) {
    return await Blog.findById(id);
  }
}

module.exports = BlogRepository;
