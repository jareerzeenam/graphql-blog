// registerUser
const { User } = require('../models/User.model');
const { ForbiddenError } = require('apollo-server-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Validator = require('../utils/validator');
const ValidationError = require('../errors/ValidationError');

const validateUserInput = ({ username, email, password }) => {
  const validation = new Validator(
    {
      username,
      email,
      password,
    },
    {
      username: 'required',
      email: 'required|email',
      password: 'required',
    }
  );

  validation.setAttributeNames({
    username: 'User Name',
    email: 'Email',
    password: 'Password',
  });

  if (validation.fails()) {
    // Throw the first validation error
    const errors = validation.errors.all();
    const [firstError] = Object.values(errors);
    throw new ValidationError(firstError);
  }
};

const registerUser = async (payload) => {
  // Validate Use Input
  validateUserInput(payload);

  const username = payload.username;
  const email = payload.email;
  const password = payload.password;

  //   See if an old user is exists with email attempting to register
  const oldUser = await User.findOne({ email });

  //   Throw error if that user exists
  if (oldUser) {
    throw new ForbiddenError(
      `A user is already registered with the email of ${email} please try a different email.`
    );
  }

  // Encrypt Password
  var encryptedPassword = await bcrypt.hash(password, 10);

  // Build out the mongoose model
  const newUser = new User({
    username: username,
    email: email.toLowerCase(),
    password: encryptedPassword,
  });

  // Create our JWT (attach to user model)
  const token = jwt.sign(
    {
      user_id: newUser._id,
      email,
    },
    process.env.JWT_HASH_TOKEN_KEY,
    {
      expiresIn: '2h',
    }
  );
  newUser.token = token;

  // Save user to MongoDB
  const res = await newUser.save(); // TODO :: Move save to user repository
  return {
    id: res.id,
    ...res._doc,
  };
};

const loginUser = async (payload) => {
  // TODO :: Validate payload

  const email = payload.email;
  const password = payload.password;

  // See first if the user exist with the email
  const user = await User.findOne({ email }); // TODO :: Move find to user repository

  //   Throw error if that user does not exists
  if (!user) {
    throw new ForbiddenError(
      `User does not exist with the given email of ${email}`
    );
  }

  // Check if the entered password equals the encrypted password
  if (user && (await bcrypt.compare(password, user.password))) {
    // Create a new TOKEN
    const token = jwt.sign(
      {
        user_id: user._id,
        email,
      },
      process.env.JWT_HASH_TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    );

    // Attach token to user Model that we found above
    user.token = token;

    return {
      id: user.id,
      ...user._doc,
    };
  } else {
    // If user doesn't exist, return error
    throw new ForbiddenError('Incorrect Credentials!');
  }
};

module.exports = {
  validateUserInput,
  registerUser,
  loginUser,
};
