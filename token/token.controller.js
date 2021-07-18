const tokenService = require('./token.service');
const CustomError = require('../utils/CustomError');

const handleSilentRefresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  const { id, role } = await tokenService.authenticateToken(refreshToken);

  const refreshTokenIsVerified = await tokenService.verifyRefreshToken(id, refreshToken);

  if (!refreshTokenIsVerified) {
    throw new CustomError({ errorText: 'Invalid token.', errorCode: 401 });
  }

  const newAccessTokenObj = await tokenService.generateAccessToken(id, role);
  const newRefreshToken = await tokenService.generateRefreshToken(id, role);

  await tokenService.saveRefreshTokenToUser(id, newRefreshToken);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true, sameSite: 'none', secure: true, path: '/',
  });
  res.json({ newAccessTokenObj, id });
};

module.exports = {
  handleSilentRefresh,
};
