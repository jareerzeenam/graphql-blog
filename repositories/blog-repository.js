const Blog = require('../models/Blog.model');

class BlogRepository {
  /**
   * Create a new schedule in database.
   *
   * @param {Object} payload - The payload for control schedule.
   * @returns {Blog}
   */
  async create(payload) {
    const blog = new Blog(payload);
    await blog.save();
    return blog;
  }

  /**
   * Get All Blogs
   *
   * @returns {{data: array}}
   */
  async findAllBlogs() {
    const data = await Blog.find();
    return { data };
  }

  /**
   * Find Blog
   *
   *
   */
  async find(id) {
    return await Blog.findById(id);
  }
}

module.exports = BlogRepository;
