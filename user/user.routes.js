/* eslint-disable no-unused-vars */
const express = require('express');
const userController = require('./user.controller');
const { authenticateRoleUser, authenticateRoleAdmin, authenticateRoleAdminOrUser } = require('../middleware/auth');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.get('/:id', userController.getUserById);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;
