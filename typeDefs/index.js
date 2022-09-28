const { mergeTypeDefs } = require('@graphql-tools/merge');
const blogs = require('./blogs');

const allTypeDefs = [];

const modules = [blogs];
modules.forEach((module) => {
  allTypeDefs.push(module);
});

const typeDefs = mergeTypeDefs(allTypeDefs);

module.exports = typeDefs;
