const express = require('express');
const {isAuthenticatedUser,authorizeRoles} = require('../../middleware/auth')
const {Login,registerPatient,register,getUserDetails} = require('../../Controller/Admin/Admin');

const router = express.Router();

router.route('/register').post(isAuthenticatedUser,authorizeRoles("Admin"),register);
router.route('/register-patient').post(registerPatient);
router.route('/users/login').post(Login);

router.route('/get-user-detail').get(isAuthenticatedUser,getUserDetails)
module.exports = router;