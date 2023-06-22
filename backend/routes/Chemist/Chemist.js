const express = require('express');
const {isAuthenticatedUser,authorizeRoles} = require('../../middleware/auth')
const {medicineRecord,getMedicineRecord} = require('../../Controller/Chemist/Chemist');

const router = express.Router();

router.route('/medicine-record').post(isAuthenticatedUser,medicineRecord);
router.route('/get-medicine-record').get(isAuthenticatedUser,getMedicineRecord);

module.exports = router;