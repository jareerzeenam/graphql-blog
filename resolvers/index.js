const { mergeResolvers } = require('@graphql-tools/merge');
const blogs = require('./blogs');
const auth = require('./auth');

const allResolvers = [];

const modules = [blogs, auth];
modules.forEach((module) => {
  allResolvers.push(module);
});

// stitching
const resolvers = mergeResolvers(allResolvers);

module.exports = resolvers;
