const { makeExecutableSchema } = require('@graphql-tools/schema');
const {
  wrapSchema,
  RenameTypes,
  RenameRootFields,
} = require('@graphql-tools/wrap');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { resolve } = require('path');
const { prefix } = require('./config/graphql');
const typeDefs = require('./typeDefs/index');
const resolvers = require('./resolvers/index');
const connectDB = require('./config/db');

// Load config
require('dotenv').config({ path: resolve(__dirname, './config/.env') });

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

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
  const apolloServer = new ApolloServer({
    schema,
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

  app.listen(process.env.PORT, () =>
    console.log(`Server Started at ${process.env.PORT}`)
  );
}

startServer();
