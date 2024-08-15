const { User } = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserRepository {
  async create(payload) {
    const username = payload.username;
    const email = payload.email;
    const password = payload.password;
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
    const res = await newUser.save();

    return {
      id: res.id,
      ...res._doc,
    };
  }

  /**
   * Find a user by email.
   *
   * @param {String} email - The email of the user.
   * @returns {User}
   */

  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }
}

module.exports = UserRepository;
