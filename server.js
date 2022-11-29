// ! Dataloader 2 start
const Dataloader = require('dataloader');
const { Blog } = require('./models/Blog.model');
const { User } = require('./models/User.model');
// ! Dataloader 2 end

const { makeExecutableSchema } = require('@graphql-tools/schema');
const {
  wrapSchema,
  RenameTypes,
  RenameRootFields,
} = require('@graphql-tools/wrap');
const { UserInputError } = require('apollo-server-errors');
const ValidationError = require('./errors/ValidationError');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { prefix } = require('./config/graphql');
const typeDefs = require('./typeDefs/index');
const resolvers = require('./resolvers/index');
const connectDB = require('./config/db');
const { auth } = require('./middleware/auth');
const { authDirectiveTransformer } = require('./directives/authDirective');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/database')[env];

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Custom @auth directive
schema = authDirectiveTransformer(schema, 'auth');

schema = wrapSchema({
  schema,
  transforms: [
    // Add prefix for Type, excluding Query, Mutation, and Subscription
    new RenameTypes((name) => `${prefix}${name}`),
    // Add prefix for Type, excluding Query, Mutation, and Subscription
    new RenameRootFields((_, fieldName) => `${prefix}${fieldName}`),
  ],
});

async function startServer() {
  const app = express();

  // !
  // const getBlogsByUserIds = async (userIds) => {
  //   const blogs = await Blog.where('author').in(userIds);
  //   return blogs;
  // };
  //!

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      // Authentication middleware
      const isAuth = auth(req);

      // const dataloader = new Dataloader(getBlogsByUserIds);

      // Returns {isAuth: bool, userId:Int}
      return isAuth;
    },

    formatError: (err) => {
      // Convert ValidationError to UserInputError
      if (
        err?.originalError instanceof ValidationError ||
        err?.originalError?.originalError instanceof ValidationError
      ) {
        return new UserInputError(err.message);
      }

      // Otherwise return the original error. The error can also
      // be manipulated in other ways, as long as it's returned.
      return err;
    },
  });

  await apolloServer.start();

  // graphql (/graphql)
  apolloServer.applyMiddleware({ app: app });

  //express middleware
  app.use((req, res) => {
    res.send('Hello from express apollo server');
  });

  //Connect to DB
  connectDB();

  app.listen(config.PORT, () =>
    console.log(`Server Started at http://localhost:${config.PORT}/graphql 🚀`)
  );
}

startServer();
