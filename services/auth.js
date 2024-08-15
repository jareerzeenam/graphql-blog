// registerUser
const { User } = require('../models/User.model');
const { ForbiddenError } = require('apollo-server-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Validator = require('../utils/validator');
const ValidationError = require('../errors/ValidationError');
const UserRepository = require('../repositories/user-repository');
const { sendEmail } = require('./email');

const validateUserInput = (
  { username, email, password },
  context = 'register'
) => {
  const rules = {
    username: 'required|string',
    email: 'required|email',
    password: 'required',
  };

  // Modify rules for login
  if (context === 'login') {
    delete rules.username;
  }

  const validation = new Validator(
    {
      username,
      email,
      password,
    },
    rules
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

  //   See if an old user is exists with email attempting to register
  const userRepo = new UserRepository();
  const userExists = await userRepo.findByEmail(payload.email);

  //   Throw error if that user exists
  if (userExists) {
    throw new ForbiddenError(
      `A user is already registered with the email of ${payload.email} please try a different email.`
    );
  }

  const newUser = await userRepo.create(payload);

  return newUser;
};

const loginUser = async (payload) => {
  // Validate Use Input
  validateUserInput(payload, 'login');

  const email = payload.email;
  const password = payload.password;

  // See first if the user exist with the email
  const userRepo = new UserRepository();
  const user = await userRepo.findByEmail(payload.email);

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

const sendResetPasswordEmail = async (email) => {
  const token = await generateResetToken(email);

  const subject = 'Reset your password';
  const resetUrl = `https://example.com/reset-password?email=${email}&token=${token}`;
  const content = `
  <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
  <br><hr>
  <p>Email: ${email}</p>
  <p>Token: ${token}</p>
  <br><hr>
`;

  await sendEmail(email, subject, content);

  return {
    message: 'Email Sent',
  };
};

const resetPassword = async (payload) => {
  // TODO :: Validate payload inputs and add password and confirm password fields
  const email = payload.email;
  const token = payload.token;
  const newPassword = payload.newPassword;

  const user = await User.findOne({ email, resetToken: token });

  if (
    !user ||
    moment(user.resetTokenExpires) < moment().subtract(1, 'hour')
  ) {
    throw new Error('Invalid or expired token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpires = null;
  await user.save();

  // generate a new JWT token for the user
  const { id } = user;
  const tokenPayload = { id };
  const tokenOptions = { expiresIn: '1h' };
  const jwtToken = jwt.sign(
    tokenPayload,
    process.env.JWT_HASH_TOKEN_KEY,
    tokenOptions
  );

  return user;
};

// Function to generate Reset Token JWT
async function generateResetToken(email) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.resetTokenExpires) {
    const resetTokenExpires = moment(tokenExpires);
    const tokenHasExpired = resetTokenExpires.isBefore(
      moment().subtract(1, 'hour')
    );

    if (!tokenHasExpired) {
      throw new Error(
        'An email has already been sent. Please check your email.'
      );
    }
  }

  const tokenPayload = { id: user.id };
  const tokenOptions = { expiresIn: '1h' };

  const jwtToken = jwt.sign(
    tokenPayload,
    process.env.JWT_HASH_TOKEN_KEY,
    tokenOptions
  );

  // Update user reset token fields
  user.resetToken = jwtToken;
  user.resetTokenExpires = moment().add(1, 'hour'); // 1 hour
  await user.save();

  return jwtToken;
}

module.exports = {
  validateUserInput,
  registerUser,
  loginUser,
  sendResetPasswordEmail,
  resetPassword,
};
