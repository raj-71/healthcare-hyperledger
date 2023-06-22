const express = require('express');
const {isAuthenticatedUser,authorizeRoles} = require('../../middleware/auth')
const {requestClaimRecord, claimResponse, getInsuranceRecord} = require('../../Controller/Insurance/Insurance');

const router = express.Router();

router.route('/claim-request').post(isAuthenticatedUser,requestClaimRecord);
router.route('/response-claim').post(isAuthenticatedUser,claimResponse);
router.route('/get-insurance-record').get(isAuthenticatedUser,getInsuranceRecord);

module.exports = router;