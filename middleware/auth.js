const CustomError = require('../utils/CustomError');
const tokenService = require('../token/token.service');

//  **  AUTH MIDDLEWARE  ** //

const authenticateRoleUser = async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new CustomError({ errorText: 'Authentication failed. No token provided.', errorCode: 401 });
  }

  const token = req.headers.authorization.split(' ')[1];

  const user = await tokenService.authenticateToken(token);

  if (user.role !== 'user') {
    throw new CustomError({ errorText: 'Authentication failed. Insufficient permissions.', errorCode: 401 });
  }

  req.user = user;
  next();
};

const authenticateRoleAdmin = async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new CustomError({ errorText: 'Authentication failed. No token provided.', errorCode: 401 });
  }

  const token = req.headers.authorization.split(' ')[1];

  const user = await tokenService.authenticateToken(token);

  if (user.role !== 'admin') {
    throw new CustomError({ errorText: 'Authentication failed. Insuffiicient permissions.', errorCode: 401 });
  }

  req.user = user;
  next();
};

const authenticateRoleAdminOrUser = async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new CustomError({ errorText: 'Authentication failed. No token provided.', errorCode: 401 });
  }

  const token = req.headers.authorization.split(' ')[1] || undefined;

  const user = await tokenService.authenticateToken(token);

  if (user.role !== 'user' && user.role !== 'admin') {
    throw new CustomError({ errorText: 'Authentication failed. No role assigned to access token.', errorCode: 401 });
  }

  req.user = user;
  next();
};

module.exports = {
  authenticateRoleUser,
  authenticateRoleAdmin,
  authenticateRoleAdminOrUser,
};
