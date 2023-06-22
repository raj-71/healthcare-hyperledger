const express = require('express');
const {isAuthenticatedUser,authorizeRoles} = require('../../middleware/auth')
const {invoke,query} = require('../../Controller/Chaincode/Chaincode');

const router = express.Router();

router.route('/channels/:channelName/chaincodes/:chaincodeName').post(isAuthenticatedUser,invoke);
router.route('/channels/:channelName/chaincodes/:chaincodeName').get(isAuthenticatedUser,query)

module.exports = router;