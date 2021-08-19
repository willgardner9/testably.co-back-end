const tokenService = require('./token.service');
const CustomError = require('../utils/CustomError');

//  this function authenticates and verifies user's refresh token
//  it then issues a new access token and refresh token
//  returns access token to client as json
//  returns refresh token to client as http only cookie and saves to user in db
const handleSilentRefresh = async (req, res) => {
  //  extract refresh token from http only cookie
  const { refreshToken } = req.cookies;

  //  authenticate refresh token and extract id and role from the refresh token
  //  authenticated tokens mean the token was signed by this application
  const { id, role } = await tokenService.authenticateToken(refreshToken);

  //  verified tokens ensure that the supplied refresh token matches
  //  the refresh token for that user in the db
  const refreshTokenIsVerified = await tokenService.verifyRefreshToken(id, refreshToken);

  //  if the token is not verified, ie it does not belong to the user making the request
  //  returns an error
  if (!refreshTokenIsVerified) {
    throw new CustomError({ errorText: 'Invalid token.', errorCode: 401 });
  }

  //  generate new access token and refresh token
  const newAccessTokenObj = await tokenService.generateAccessToken(id, role);
  const newRefreshToken = await tokenService.generateRefreshToken(id, role);

  //  save new refresh token to the user
  await tokenService.saveRefreshTokenToUser(id, newRefreshToken);

  //  send new refresh token as http only cookied to client
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true, sameSite: 'none', secure: true, path: '/',
  });
  //  send access token as json to client
  res.json({ newAccessTokenObj, id });
};

module.exports = {
  handleSilentRefresh,
};
