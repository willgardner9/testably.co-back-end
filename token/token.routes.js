const express = require('express');
const tokenController = require('./token.controller');

const router = express.Router();

router.get('/refresh', tokenController.handleSilentRefresh);

module.exports = router;
