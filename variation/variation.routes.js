/* eslint-disable no-unused-vars */
const express = require('express');
const variationController = require('./variation.controller');
const { authenticateRoleUser, authenticateRoleAdmin, authenticateRoleAdminOrUser } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateRoleAdminOrUser, variationController.postVariation);
router.patch('/:id', authenticateRoleAdminOrUser, variationController.patchVariation);
router.get('/:id', authenticateRoleAdminOrUser, variationController.getSingleVariation);
router.delete('/:id', authenticateRoleAdminOrUser, variationController.deleteVariation);

module.exports = router;
