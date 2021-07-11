/* eslint-disable no-unused-vars */
const express = require('express');
const stripeController = require('./stripe.controller');
const { authenticateRoleUser, authenticateRoleAdmin, authenticateRoleAdminOrUser } = require('../middleware/auth');

const router = express.Router();

router.post('/create-checkout-session', authenticateRoleAdminOrUser, stripeController.createCheckoutSession);
router.post('/customer-portal', authenticateRoleAdminOrUser, stripeController.customerPortal);
router.post('/webhook', authenticateRoleAdminOrUser, stripeController.webhook);

module.exports = router;
