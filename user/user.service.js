const bcrypt = require('bcryptjs');
const User = require('./user.model');
const stripeController = require('../stripe/stripe.controller');
const tokenService = require('../token/token.service');
const CustomError = require('../utils/CustomError');

//  **  HELPER SERVICES  **  //

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user || false;
};

const findUserById = async (id) => {
  const user = await User.findOne({ _id: id });
  return user || false;
};

const hashPassword = async (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

//  ** CONTROLLER SERVICES  **  //

const createUser = async ({ email, password, role }) => {
  //  check if user with that email already exists, throws error if so
  const found = await findUserByEmail(email);
  if (found) {
    throw new CustomError({ errorText: 'Email address already registered.', errorCode: 409 });
  }
  //  hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  //  create stripe customer object for the user, save to db
  const stripeCustomerObject = await stripeController.createCustomerId(email);
  const stripeCustomerID = stripeCustomerObject.id;
  //  create user with email, hashed password, role, and stripe customer id
  const user = await User.create({
    email, hashedPassword, role, stripeCustomerID,
  });
  //  return created user
  return user;
};

const loginWithEmailAndPassword = async (email, password) => {
  //  check if user exists, throw error if not
  let user = await findUserByEmail(email);
  if (!user) {
    throw new CustomError({ errorText: 'No account registered with that email address.', errorCode: 409 });
  }
  //  check supplied password matches hashed password in db
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
  //  refresh user object to send user obj with refresh token
  user = await findUserByEmail(email);
  // return user obj and access token obj
  return { user, accessTokenObj };
};

//  updates stripe current plan on user in db
const updateCurrentPlan = async (stripeCustomerID, currentPlan) => {
  const updatedUser = await User.findOneAndUpdate({ stripeCustomerID }, { currentPlan });
  return updatedUser;
};

const resetPassword = async (email, password, token) => {
  //  hash new password
  const hashedPassword = await hashPassword(password);
  //  authenticate supplied access token, throw error if not
  const isTokenValid = await tokenService.authenticateToken(token);
  if (!isTokenValid) {
    return false;
  }
  //  save new hashed password to user in db
  const updatedUser = await User.findOneAndUpdate({ email }, { hashedPassword });
  return updatedUser;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  loginWithEmailAndPassword,
  updateCurrentPlan,
  resetPassword,
};
