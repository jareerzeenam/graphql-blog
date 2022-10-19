const { mergeTypeDefs } = require('@graphql-tools/merge');
const blogs = require('./blogs');
const core = require('./core');

const allTypeDefs = [];

const modules = [core, blogs];
modules.forEach((module) => {
  allTypeDefs.push(module);
});

const typeDefs = mergeTypeDefs(allTypeDefs);

module.exports = typeDefs;
