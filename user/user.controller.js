const userService = require('./user.service');

const registerUser = async (req, res) => {
  const { email, password, role } = req.body;

  const user = await userService.createUser({ email, password, role });
  res.json(user);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { user, accessTokenObj } = await userService.loginWithEmailAndPassword(email, password);

  res.cookie('refreshToken', user.refreshToken, { httpOnly: true, sameSite: 'none', secure: true });
  res.cookie('hasLoggedIn', true, { httpOnly: false, sameSite: 'none', secure: true });
  res.json({ user, accessTokenObj });
};

const logoutUser = async (req, res) => {
  const wipeRefreshToken = '';
  res.cookie('refreshToken', wipeRefreshToken, { httpOnly: true });
  res.json({ message: 'Logged out' });
};

const getUserById = async (req, res) => {
  const user = await userService.findUserById(req.params.id);
  res.json(user);
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
};
