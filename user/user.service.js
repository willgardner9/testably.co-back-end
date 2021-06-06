const bcrypt = require('bcryptjs');
const User = require('./user.model');
const tokenService = require('../token/token.service');
const CustomError = require('../utils/CustomError');

//  **  HELPER SERVICES  **  //

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user || false;
};

const findUserById = async (id) => {
  const user = await User.findOne({ id });
  return user || false;
};

//  ** CONTROLLER SERVICES  **  //

const createUser = async ({ email, password, role }) => {
  const found = await findUserByEmail(email);
  if (found) {
    throw new CustomError({ errorText: 'Email address already registered.', errorCode: 409 });
  }
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const user = await User.create({ email, hashedPassword, role });
  return user;
};

const loginWithEmailAndPassword = async (email, password) => {
  let user = await findUserByEmail(email);
  if (!user) {
    throw new CustomError({ errorText: 'No account registered with that email address.', errorCode: 409 });
  }
  const passwordsMatch = await bcrypt.compareSync(password, user.hashedPassword);
  if (!passwordsMatch) {
    throw new CustomError({ errorText: 'Email address or password incorrect', errorCode: 409 });
  }
  //  generate + return access token and access token expiry in unix time milliseconds
  const accessTokenObj = tokenService.generateAccessToken(user.id, user.role);
  //  generate + return refresh token AND save refresh token to db
  const refreshToken = tokenService.generateRefreshToken(user.id, user.role);
  //  save refresh token to user in db
  await tokenService.saveRefreshTokenToUser(user.id, refreshToken);
  //  refresh user object to ensure refresh token persistence
  user = await findUserByEmail(email);
  // return user obj and access token obj
  return { user, accessTokenObj };
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  loginWithEmailAndPassword,
};
