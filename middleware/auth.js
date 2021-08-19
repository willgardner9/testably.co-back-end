const CustomError = require('../utils/CustomError');
const tokenService = require('../token/token.service');

//  **  AUTH MIDDLEWARE  ** //

//  authenticates the token used belongs to role user
const authenticateRoleUser = async (req, res, next) => {
  //  checks to make sure incoming request has auth headers
  if (!req.headers.authorization) {
    throw new CustomError({ errorText: 'Authentication failed. No token provided.', errorCode: 401 });
  }

  //  extracts token from auth headers
  const token = req.headers.authorization.split(' ')[1];

  //  authenticates token and populations const user with jwt payload
  const user = await tokenService.authenticateToken(token);

  //  checks role is correct
  if (user.role !== 'user') {
    throw new CustomError({ errorText: 'Authentication failed. Insufficient permissions.', errorCode: 401 });
  }

  //  makes user id available on request obj, passes request obj to controllers
  req.user = user;
  next();
};

//  authenticates the token used belongs to role admin
const authenticateRoleAdmin = async (req, res, next) => {
  //  checks to make sure incoming request has auth headers
  if (!req.headers.authorization) {
    throw new CustomError({ errorText: 'Authentication failed. No token provided.', errorCode: 401 });
  }

  //  extracts token from auth headers
  const token = req.headers.authorization.split(' ')[1];

  //  authenticates token and populations const user with jwt payload
  const user = await tokenService.authenticateToken(token);

  //  checks role is correct
  if (user.role !== 'admin') {
    throw new CustomError({ errorText: 'Authentication failed. Insuffiicient permissions.', errorCode: 401 });
  }

  //  makes user id available on request obj, passes request obj to controllers
  req.user = user;
  next();
};

//  authenticates token used belongs to role admin or user
const authenticateRoleAdminOrUser = async (req, res, next) => {
  //  checks to make sure incoming request has auth headers
  if (!req.headers.authorization) {
    throw new CustomError({ errorText: 'Authentication failed. No token provided.', errorCode: 401 });
  }

  //  extracts token from auth headers
  const token = req.headers.authorization.split(' ')[1] || undefined;

  //  authenticates token and populations const user with jwt payload
  const user = await tokenService.authenticateToken(token);

  //  checks role is correct
  if (user.role !== 'user' && user.role !== 'admin') {
    throw new CustomError({ errorText: 'Authentication failed. No role assigned to access token.', errorCode: 401 });
  }

  //  makes user id available on request obj, passes request obj to controllers
  req.user = user;
  next();
};

module.exports = {
  authenticateRoleUser,
  authenticateRoleAdmin,
  authenticateRoleAdminOrUser,
};
