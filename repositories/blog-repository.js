const ValidationError = require('../errors/ValidationError');
const { mongoose, Blog } = require('../models/Blog.model');

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
  async findAllBlogs(paginate = [], sort = []) {
    const params = {};

    const offset = paginate?.offset ?? 0;
    const limit = paginate?.limit ?? 0;

    if (offset > 0) params.offset = offset;
    if (limit > 0) params.limit = limit;

    const sortOrder = sort.order;

    const data = await Blog.find()
      .limit(paginate.limit)
      .sort({ [sort.fieldName]: sortOrder == 'ASC' ? -1 : 1 });

    const total = await Blog.find(params).count();

    return { data, offset, limit, total };
  }

  /**
   * Get All Blogs by logged user.
   *
   * @returns {{data: array}}
   */
  async findByUser(paginate = [], sort = [], userId) {
    const params = {};

    const offset = paginate?.offset ?? 0;
    const limit = paginate?.limit ?? 0;

    if (offset > 0) params.offset = offset;
    if (limit > 0) params.limit = limit;

    const sortOrder = sort.order;

    const data = await Blog.find()
      .where('author')
      .equals(userId)
      .limit(paginate.limit)
      .sort({ [sort.fieldName]: sortOrder == 'ASC' ? -1 : 1 });

    const total = await Blog.find(params)
      .where('author')
      .equals(userId)
      .count();

    return { data, offset, limit, total };
  }

  /**
   * Find a Blog by ID
   *
   *  @returns {Blog}
   */
  async find(id) {
    if (!mongoose?.Types.ObjectId.isValid(id))
      throw new ValidationError('Invalid Blog ID!');

    return await Blog.findById(id).exec();
  }

  /**
   * Update Blog
   *
   *  @returns {Blog}
   */
  async update(payload) {
    if (!mongoose?.Types.ObjectId.isValid(payload.id))
      throw new ValidationError('Invalid Blog ID!');

    const blog = await Blog.findByIdAndUpdate(
      payload.id,
      {
        title: payload.title,
        description: payload.description,
        categoryId: payload.categoryId,
      },
      {
        new: true,
      }
    );

    return blog;
  }

  /**
   * Delete Blog
   *
   *  @returns {String}
   */
  async delete(id) {
    if (!mongoose?.Types.ObjectId.isValid(id))
      throw new ValidationError('Invalid Blog ID!');

    await Blog.findByIdAndDelete(id);
  }
}

module.exports = BlogRepository;
