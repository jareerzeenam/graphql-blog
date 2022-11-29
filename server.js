// ! Dataloader 2 start
const DataLoader = require('dataloader');
const { Blog } = require('./models/Blog.model');
const { User } = require('./models/User.model');
const { groupBy, map } = require('ramda');
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

  // ! Dataloader 2 start (these functions need to be in services and imported/require here )
  // * Case 1
  const getBlogsByUserIds = async (userIds) => {
    console.log('DATALOADER Blogs called', userIds);
    const blogs = await Blog.where('author').in(userIds);

    // ! GroupBy and map fixed the Promise length issue (Important)
    const groupedById = groupBy((blog) => blog.author, blogs);
    return map((userId) => groupedById[userId], userIds);

    // return mapped;
  };

  // * Case 2
  const getBlogOwnerByIds = async (ids) => {
    console.log('DATALOADER Owner called', ids);
    const owner = await User.where('_id').in(ids);
    return owner;
  };

  // * Case 3
  const getBlogByIds = async (ids) => {
    console.log('DATALOADER Blogs called', ids);
    const blogs = await Blog.where('_id').in(ids);
    return blogs;
  };
  // ! Dataloader 2 end

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      // Authentication middleware
      const isAuth = auth(req);

      // ! Dataloader 2 start
      const dataloader = {
        loaders: {
          ownerBlogsLoader: new DataLoader(getBlogsByUserIds), // * Case 1
          blogsOwnerLoader: new DataLoader(getBlogOwnerByIds), // * Case 2
          blogsLoader: new DataLoader(getBlogByIds), // * Case 3
        },
      };
      // ! Dataloader 2 end

      // Returns {isAuth: bool, userId:Int}
      return { isAuth, dataloader };
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
