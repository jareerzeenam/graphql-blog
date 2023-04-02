// registerUser
const { User } = require('../models/User.model');
const { ForbiddenError } = require('apollo-server-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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

const sendResetPasswordEmail = async (email) => {
  const token = await generateResetToken(email);

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const resetUrl = `https://example.com/reset-password?email=${email}&token=${token}`;
  const mailOptions = {
    from: process.env.MAIL_FROM_ADDRESS,
    to: email,
    subject: 'Reset your password',
    html: `Click <a href="${resetUrl}">here</a> to reset your password 
    <br><hr>
    Email : ${email}
    <br>
    Token : ${token}
    <br><hr>
    `,
  };
  await transporter.sendMail(mailOptions);

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

  if (!user || user.resetTokenExpires < Date.now()) {
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

  // TODO :: Check when is the last reset email was sent and send the second one (valid time within 1hr)
  if (!user) {
    throw new Error('User not found');
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
  user.resetTokenExpires = Date.now() + 3600000; // 1 hour
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
