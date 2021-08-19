const nodemailer = require('nodemailer');
const userService = require('./user.service');
const tokenService = require('../token/token.service');

const registerUser = async (req, res) => {
  //  extract user details from request object
  const { email, password, role } = req.body;

  //  saves user using user model to db
  const user = await userService.createUser({ email, password, role });

  //  returns user to frontend
  res.json(user);
};

const loginUser = async (req, res) => {
  //  extract email and pword from request object
  const { email, password } = req.body;

  //  logs in user if credentials are correct, returning user object and access token obj
  //  throws an error if credentials are missing or incorrect
  const { user, accessTokenObj } = await userService.loginWithEmailAndPassword(email, password);

  //  sends refresh token http cookie to client for silent refresh pattern
  res.cookie('refreshToken', user.refreshToken, {
    httpOnly: true, sameSite: 'none', secure: true, path: '/',
  });

  //  sends cookie to client to track whether client has logged in before, enabling
  //  automatic log ins upon client side refresh
  res.cookie('hasLoggedIn', true, {
    httpOnly: false, sameSite: 'none', secure: true, path: '/',
  });

  //  returns user object and access token object to client
  res.json({ user, accessTokenObj });
};

const logoutUser = async (req, res) => {
  //  replaces refresh token http only cookie with blank string to stop automatic logins on refresh
  const wipeRefreshToken = '';
  res.cookie('refreshToken', wipeRefreshToken, { httpOnly: true });
  res.json({ message: 'Logged out' });
};

const getUserById = async (req, res) => {
  //  find user by mongo db id
  const user = await userService.findUserById(req.params.id);
  //  returns user obj to client
  res.json(user);
};

const forgotPassword = async (req, res) => {
  //  extract email from request object
  const { email } = req.body;

  //  find the user by their email and extract id from user object
  const { _id } = await userService.findUserByEmail(email);

  //  return an error if the user doesnt exist - cannot reset password for accounts that dont exist
  if (!_id) {
    return res.sendStatus(400);
  }

  //  generate short life access token to authenticate password refresh
  const { accessToken } = await tokenService.generateAccessToken(_id, 'user');

  //  create reusable transporter object using the default SMTP transport
  //  if more email features are added to this app, consider making a utility function
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //  reset password email info
  const emailInfo = {
    from: '"testably" <will@testably.co>', // sender address
    to: email, // list of receivers
    subject: 'testably - Reset Password', // Subject line
    text: `Hi ${email}, please follow this link to reset your password. Link valid for 20 minutes. https://www.testably.co/reset-password?accessToken=${accessToken}&email=${email}`, // plain text body
  };

  // send email or catch errors
  await transporter.sendMail(emailInfo, (err, info) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    console.log('succes', info);
    return res.sendStatus(200);
  });
};

const resetPassword = async (req, res) => {
  //  extract new password from request body and the access token and user email from query string
  const { password } = req.body;
  const { token, email } = req.query;

  //  validates access token then saves new hashed password to user in db
  const userWithUpdatedPassword = await userService.resetPassword(email, password, token);

  //  returns user obj to client
  res.send(userWithUpdatedPassword);
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  forgotPassword,
  resetPassword,
};
