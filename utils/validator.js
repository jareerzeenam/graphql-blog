const Validator = require('validatorjs');

// Register Custom Validation Rules
// Example
Validator.register(
  'telephone',
  function (value, requirement, attribute) {
    // requirement parameter defaults to null
    return value.match(/^\d{3}-\d{3}-\d{4}$/);
  },
  'The :attribute phone number is not in the format XXX-XXX-XXXX.'
);

module.exports = Validator;
