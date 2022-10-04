const { mergeResolvers } = require('@graphql-tools/merge');
const blogs = require('./blogs');

const allResolvers = [];

const modules = [blogs];
modules.forEach((module) => {
  allResolvers.push(module);
});

// stitching
const resolvers = mergeResolvers(allResolvers);

module.exports = resolvers;
