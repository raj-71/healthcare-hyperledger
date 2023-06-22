const express = require('express');
const {isAuthenticatedUser,authorizeRoles} = require('../../middleware/auth')
const {giveAccess, removeAccess,UserList,HealthRecords,LabRecords,PharmacyRecords,InsuranceRecords} = require('../../Controller/Patient/Patient');

const router = express.Router();

router.route('/give-access').post(isAuthenticatedUser,authorizeRoles("patient"), giveAccess);
router.route('/remove-access').post(isAuthenticatedUser,authorizeRoles("patient"), removeAccess);
router.route('/user-list/:orgName').get(isAuthenticatedUser,authorizeRoles("patient"), UserList);
router.route('/patient-health-records').get(isAuthenticatedUser,authorizeRoles("patient"),HealthRecords);
router.route('/patient-lab-records').get(isAuthenticatedUser,authorizeRoles("patient"),LabRecords);
router.route('/patient-pharmacy-records').get(isAuthenticatedUser,authorizeRoles("patient"),PharmacyRecords);
router.route('/patient-insurance-records').get(isAuthenticatedUser,authorizeRoles("patient"),InsuranceRecords);
// router.route('/health-records').get(isAuthenticatedUser, authorizeRoles("patient"), );



module.exports = router;