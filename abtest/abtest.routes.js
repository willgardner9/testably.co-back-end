/* eslint-disable no-unused-vars */
const express = require('express');
const abtestController = require('./abtest.controller');
const { authenticateRoleUser, authenticateRoleAdmin, authenticateRoleAdminOrUser } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateRoleAdminOrUser, abtestController.postAbtest);
router.get('/', authenticateRoleAdminOrUser, abtestController.getAllAbtests);
router.patch('/:id', authenticateRoleAdminOrUser, abtestController.updateAbtest);
router.get('/:id', authenticateRoleAdminOrUser, abtestController.getAbtest);
router.delete('/:id', authenticateRoleAdminOrUser, abtestController.deleteAbtest);

module.exports = router;
