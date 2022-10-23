const { mergeResolvers } = require('@graphql-tools/merge');
const blogs = require('./blogs');
const users = require('./users');

const allResolvers = [];

const modules = [blogs, users];
modules.forEach((module) => {
  allResolvers.push(module);
});

// stitching
const resolvers = mergeResolvers(allResolvers);

module.exports = resolvers;
