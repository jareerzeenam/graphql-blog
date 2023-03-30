// const nodemailer = require('nodemailer');
const { registerUser, loginUser } = require('../services/auth');

const users = {
  Query: {
    // Login User
    loginUser: async (_, { loginInput }) =>
      loginUser({ ...loginInput }),

    sendEmail: async (_, { email }) => {
      // TODO ::
      return { message: email };

      // const email = 'testjareer@email.com';
      // const token = 'abc123';

      // const transporter = nodemailer.createTransport({
      //   host: process.env.MAIL_HOST,
      //   port: process.env.MAIL_PORT,
      //   auth: {
      //     user: process.env.MAIL_USERNAME,
      //     pass: process.env.MAIL_PASSWORD,
      //   },
      // });
      // const resetUrl = `https://example.com/reset-password?email=${email}&token=${token}`;
      // const mailOptions = {
      //   from: 'your-email@gmail.com',
      //   to: email,
      //   subject: 'Reset your password',
      //   html: `Click <a href="${resetUrl}">here</a> to reset your password`,
      // };
      // await transporter.sendMail(mailOptions);

      // return 'Email Sent';
    },
  },
  Mutation: {
    // Register User
    registerUser: async (_, { registerInput }) =>
      registerUser({ ...registerInput }),
  },
};

module.exports = users;
