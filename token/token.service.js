const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const CustomError = require('../utils/CustomError');

const { JWT_SECRET } = process.env;

//  ** GENERATE TOKENS ** //

//  short lived tokens to authenticate requests
const generateAccessToken = (id, role) => {
  const accessToken = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '20m' });
  const accessTokenExpiresIn = Date.now() + (19 * 60 * 1000);
  return { accessToken, accessTokenExpiresIn };
};

//  long lived tokens used to generate new access tokens
const generateRefreshToken = (id, role) => {
  const refreshToken = jwt.sign({ id, role }, JWT_SECRET);
  return refreshToken;
};

// ** SAVE TOKENS ** //

const saveRefreshTokenToUser = async (id, refreshToken) => {
  const user = await User.findById(id, (err, doc) => {
    const userInDb = doc;
    userInDb.refreshToken = refreshToken;
    userInDb.save();
  });

  return user;
};

// ** AUTHENTICATE TOKENS AND VERIFY TOKENS ** //

//  verifies token was signed by this application
const authenticateToken = async (token) => jwt.verify(token, JWT_SECRET, (err, payload) => {
  if (err) {
    throw new CustomError({ errorText: 'Invalid token.', errorCode: 401 });
  }
  return payload;
});

//  verifies token belongs to user making the request using id signed into the token
const verifyRefreshToken = async (id, token) => {
  const isVerified = await User.findById(id, (err, doc) => {
    if (err) {
      throw new CustomError({ errorText: 'Database error', errorCode: 500 });
    }
    if (doc.refreshToken !== token) {
      return false;
    }
    return true;
  });
  return isVerified;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshTokenToUser,
  authenticateToken,
  verifyRefreshToken,
};
