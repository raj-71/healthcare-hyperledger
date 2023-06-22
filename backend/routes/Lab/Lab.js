const express = require('express');
const {isAuthenticatedUser,authorizeRoles} = require('../../middleware/auth')
const {labReports,getLabReport} = require('../../Controller/Lab/Lab');

const router = express.Router();

router.route('/lab-reports').post(isAuthenticatedUser,labReports);
router.route('/get-lab-report').get(isAuthenticatedUser,getLabReport);

module.exports = router;