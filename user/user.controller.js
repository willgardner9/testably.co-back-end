const nodemailer = require('nodemailer');
const userService = require('./user.service');
const tokenService = require('../token/token.service');

const registerUser = async (req, res) => {
  const { email, password, role } = req.body;

  const user = await userService.createUser({ email, password, role });
  res.json(user);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { user, accessTokenObj } = await userService.loginWithEmailAndPassword(email, password);

  res.cookie('refreshToken', user.refreshToken, {
    httpOnly: true, sameSite: 'none', secure: true, path: '/',
  });
  res.cookie('hasLoggedIn', true, {
    httpOnly: false, sameSite: 'none', secure: true, path: '/',
  });
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const { _id } = await userService.findUserByEmail(email);

  if (!_id) {
    return res.sendStatus(400);
  }

  const { accessToken } = await tokenService.generateAccessToken(_id, 'user');

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailInfo = {
    from: '"testably" <will@testably.co>', // sender address
    to: email, // list of receivers
    subject: 'testably - Reset Password', // Subject line
    text: `Hi ${email}, please follow this link to reset your password. Link valid for 20 minutes. https://www.testably.co/reset-password?accessToken=${accessToken}`, // plain text body
  };

  await transporter.sendMail(emailInfo, (err, info) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log('succes', info);
      res.sendStatus(200);
    }
  });
};

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token, email } = req.query;

  const result = await userService.resetPassword(email, password, token);
  res.send(result);
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  forgotPassword,
  resetPassword,
};
