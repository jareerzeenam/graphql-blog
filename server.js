const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { resolve } = require('path');
const typeDefs = require('./typeDefs/index');
const resolvers = require('./resolvers/index');
const connectDB = require('./config/db');

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Load config
require('dotenv').config({ path: resolve(__dirname, './config/.env') });

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
