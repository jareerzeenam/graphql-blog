const jwt = require('jsonwebtoken');

const auth = (req) => {
  const authHeader = req.get('Authorization'); // e.g., "Bearer user-1"

  // check if decoded token is set
  if (!authHeader) {
    return false;
  }

  // Split token by first space Bearer'_'token
  const token = authHeader.split(' ')[1];

  // Check if token exist
  if (!token || token === '') {
    return false;
  }

  // Decode and Verify token
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_HASH_TOKEN_KEY);
  } catch (error) {
    return false;
  }

  // check if decoded token is set
  if (!decodedToken) {
    return false;
  }

  // Get user ID from decoded token
  const userId = decodedToken.user_id;

  // Is Authenticated user
  const isAuth = true;

  return {
    userId,
    isAuth,
  };
};

module.exports = {
  auth,
};
