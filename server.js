const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { resolve } = require('path');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

// Load config
require('dotenv').config({ path: resolve(__dirname, './config/.env') });

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  // graphql (/graphql)
  apolloServer.applyMiddleware({ app: app });

  //express middleware
  app.use((req, res) => {
    res.send('Hello from express apollo server');
  });

  //Connect to DB
  // connectDB();

  app.listen(process.env.PORT, () =>
    console.log(`Server Started at ${process.env.PORT}`)
  );
}

startServer();
