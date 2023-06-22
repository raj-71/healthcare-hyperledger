const express = require('express');
const {isAuthenticatedUser,authorizeRoles} = require('../../middleware/auth')
const {getPrescription,prescription} = require('../../Controller/Doctor/Doctor');

const router = express.Router();

router.route('/prescription').post(isAuthenticatedUser,prescription);
router.route('/get-prescription').get(isAuthenticatedUser,getPrescription);

module.exports = router;