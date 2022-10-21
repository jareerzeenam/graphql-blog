const ValidationError = require('../errors/ValidationError');
const BlogRepository = require('../repositories/blog-repository');
const Validator = require('../utils/validator');

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
 * @param {string} payload.author - The Author Name of the Blog.
 * @param {string} payload.categoryId - The Category ID of the Blog.
 */
const createBlog = async (payload) => {
  // Validate Use Input
  validateBlog(payload);

  const blogRepository = new BlogRepository();
  const blog = await blogRepository.create(payload);
  return blog;
  // TODO :: Error Handle when failed to create Blog
};

const showBlog = async (payload) => {
  const blogRepository = new BlogRepository();
  const blog = await blogRepository.find(payload);

  if (!blog) throw new ValidationError('Schedule Not Found!');

  return blog;
};

const getAllBlogs = async (payload) => {
  const blogRepository = new BlogRepository();
  const { data, offset, limit, total } = await blogRepository.findAllBlogs(
    payload.paginate,
    payload.sort
  );
  return { data, offset, limit, total };

  /**
   * TODO :: Validate payload inputs
   * TODO :: Error Handle when something went wrong
   */
};

module.exports = {
  validateBlog,
  createBlog,
  showBlog,
  getAllBlogs,
};
