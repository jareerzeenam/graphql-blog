const ValidationError = require('../errors/ValidationError');
const BlogRepository = require('../repositories/blog-repository');
const Validator = require('../utils/validator');
const { ForbiddenError, AuthenticationError } = require('apollo-server-errors');

/**
 * Validate the payload for Blog.
 *
 * @param {Object} payload - The payload for Blog.
 * @param {string} payload.title - The Title of the Blog.
 * @param {string} payload.description - The Description of the Blog.
 * @param {string} payload.author - The Author Name of the Blog.
 * @param {string} payload.categoryId - The Category ID of the Blog.
 */
const validateBlog = ({ title, description, author, categoryId }) => {
  const validation = new Validator(
    {
      title,
      description,
      author,
      categoryId,
    },
    {
      title: 'required',
      description: 'required',
      author: 'required',
      categoryId: 'required|integer',
    }
  );

  validation.setAttributeNames({
    title: 'Title',
    description: 'Description',
    author: 'Author',
    categoryId: 'Category ID',
  });

  if (validation.fails()) {
    // Throw the first validation error
    const errors = validation.errors.all();
    const [firstError] = Object.values(errors);
    throw new ValidationError(firstError);
  }
};

/**
 * Create a Blog
 *
 * @param {Object} payload - The payload for Blog.
 * @param {string} payload.title - The Title of the Blog.
 * @param {string} payload.description - The Description of the Blog.
 * @param {string} payload.categoryId - The Category ID of the Blog.
 */
const createBlog = async (payload) => {
  if (!payload.isAuth)
    throw new AuthenticationError(
      'You are not authorized to perform this action!'
    );

  // Assign User Id as Author
  payload.author = payload.userId;

  // Remove userId from payload object
  delete payload.userId;

  // Validate User Input
  validateBlog(payload);

  const blogRepository = new BlogRepository();
  const blog = await blogRepository.create(payload);

  return blog;

  // TODO :: Error Handle when failed to create Blog
};

/**
 * Show Blog by ID.
 *
 * @param {string} payload.blogId - The ID of the blog.
 *
 */
const showBlog = async (payload) => {
  if (!payload.isAuth)
    throw new AuthenticationError(
      'You are not authorized to perform this action!'
    );

  const blogRepository = new BlogRepository();
  const blog = await blogRepository.find(payload.id);

  if (!blog) throw new ValidationError('Blog Not Found!');

  return blog;
};

const getAllBlogs = async (payload) => {
  const blogRepository = new BlogRepository();
  const { data, offset, limit, total } =
    await blogRepository.findAllBlogs(payload.paginate, payload.sort);
  return { data, offset, limit, total };

  /**
   * TODO :: Validate payload inputs
   * TODO :: Error Handle when something went wrong
   */
};

const showMyBlogs = async (payload) => {
  if (!payload.isAuth)
    throw new AuthenticationError(
      'You are not authorized to perform this action!'
    );

  const blogRepository = new BlogRepository();
  const { data, offset, limit, total } =
    await blogRepository.findByUser(
      payload.userId,
      payload.paginate,
      payload.sort
    );
  return { data, offset, limit, total };
};

/**
 * Update Blog by ID.
 *
 * @param {Object} payload - The payload for Blog.
 * @param {string} payload.id - The ID of the blog.
 * @param {string} payload.userId - The ID of the user.
 * @param {boolean} payload.isAuth - is authenticated user.
 * @param {string} payload.title - The Title of the Blog.
 * @param {string} payload.description - The Description of the Blog.
 * @param {string} payload.categoryId - The Category ID of the Blog.
 *
 */

const updateBlog = async (payload) => {
  if (!payload.isAuth)
    throw new AuthenticationError(
      'You are not authorized to perform this action!'
    );

  const blogRepository = new BlogRepository();
  const blog = await blogRepository.find(payload.id);

  if (!blog) throw new ValidationError('Blog Not Found!');

  // Check if the blog belongs to the user before deleting
  if (blog.author != payload.userId)
    throw new ForbiddenError('This blog does not belongs to you!');

  // Modify payload object before saving (not requires)
  delete payload.userId;
  delete payload.isAuth;

  const updatedBlog = await blogRepository.update(payload);
  return updatedBlog;
};

/**
 * Delete Blog by ID.
 *
 * @param {string} payload.id - The ID of the blog.
 *
 */
const deleteBlog = async (payload) => {
  if (!payload.isAuth)
    throw new AuthenticationError(
      'You are not authorized to perform this action!'
    );

  const blogRepository = new BlogRepository();
  const blog = await blogRepository.find(payload.id);

  if (!blog) throw new ValidationError('Blog Not Found!');

  // Check if the blog belongs to the user before deleting
  if (blog.author != payload.userId)
    throw new ForbiddenError('This blog does not belongs to you!');

  const response = await blogRepository.delete(payload.id);

  return response;
};

module.exports = {
  validateBlog,
  createBlog,
  showBlog,
  getAllBlogs,
  showMyBlogs,
  updateBlog,
  deleteBlog,
};
