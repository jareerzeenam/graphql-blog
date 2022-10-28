const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { ForbiddenError } = require('apollo-server-errors');
const { defaultFieldResolver } = require('graphql');
const { User } = require('../models/User.model');

// Get user roles from DB
const getUserRoles = async ({ userId }) => {
  try {
    const user = await User.findById(userId); // TODO:: move this to a service
    return user.roles;
  } catch (error) {
    console.log(error.message);
  }
};

const authDirectiveTransformer = (schema, directiveName) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];

      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async function (source, args, context, info) {
          // throw when there Authorization header is not set
          if (Object.keys(context).length == 0)
            throw new ForbiddenError('Authorization Required!');

          // Get user roles from DB
          const roles = await getUserRoles(context);

          // Directive Roles from the TypeDefs
          const directiveRoles = new Set(authDirective.roles);

          // Check if the user has matching roles to the directive roles
          const hasAccess = roles.some((role) => directiveRoles.has(role));

          // Throw error if the user is not authorized
          if (!hasAccess && authDirective.roles.length > 0)
            throw new ForbiddenError(
              'Not Authorized! Only Admins and registered Users are allowed to create Blogs!'
            );

          const result = await resolve.call(this, source, args, context, info);
          return result;
        };

        return fieldConfig;
      }
    },
  });
};

module.exports = { authDirectiveTransformer, getUserRoles };
