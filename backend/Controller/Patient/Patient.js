const User = require('../../Model/Users');
const Record = require('../../Model/PaitientRecords');
const constants = require('../../config/constants.json')
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const helper = require('../../app/helper')
const invoke = require('../../app/invoke')
const qscc = require('../../app/qscc')
const query = require('../../app/query')
const jwt = require('jsonwebtoken');
logger.level = 'debug';
function getErrorMessage(field) {
    var response = {
        success: false,
        message: field + ' field is missing or Invalid in the request'
    };
    return response;
}

exports.giveAccess = async (req, res, next) => {

    const { accessId } = req.body;
    console.log(accessId)
    console.log('uid: ' + req.session.uid);
    console.log('role: ' + req.session.role);
    if (req.session.role != "patient") {
        return res.status(200).json({ success: false, message: "You dont have right to give access " });

    }
    var flag = 0;
    await User.findOne({ userId: req.session.uid }).then((result) => {
        if (result?.access?.includes(accessId)) {
            flag = 1;
            return res.status(200).json({ success: false, message: "Already has access to your ID. " });


        }
    })

    if (flag == 1) {
        return
    }
    await User.findOneAndUpdate(
        {
            userId: req.session.uid
        },
        {
            $push: {
                access: accessId
            }
        }, {
        new: true
    }
    )

    logger.debug('/give-access 1');

    await User.findOneAndUpdate(
        {
            userId: accessId
        },
        {
            $push: {
                access: req.session.uid
            }
        }, {
        new: true
    }
    )




        .then((result) => {

            logger.debug('/give-access 2');
            if (result) {
                res.status(200).json({ success: true, message: "access given successfully" });


            }


        }).catch((err) => {
            console.log("Error: " + err)
        })






}

exports.removeAccess = async (req, res, next) => {

    const { accessId } = req.body;
    console.log(accessId)
    console.log('uid: ' + req.session.uid);
    console.log('role: ' + req.session.role);

    var flag = 0;
    await User.findOne({ userId: req.session.uid }).then((result) => {
        if (!result?.access?.includes(accessId)) {
            flag = 1;
            return res.status(200).json({ success: false, message: "Access not given already " });


        }
    })

    if (flag == 1) {
        return
    }
    await User.findOneAndUpdate(
        {
            userId: req.session.uid
        },
        {
            $pull: {
                access: accessId
            }
        }, {
        new: true
    }
    )

    logger.debug('/give-access 1');

    await User.findOneAndUpdate(
        {
            userId: accessId
        },
        {
            $pull: {
                access: req.session.uid
            }
        }, {
        new: true
    }
    )




        .then((result) => {

            logger.debug('/give-access 2');
            if (result) {
                res.status(200).json({ success: true, message: "access removed successfully" });


            }


        }).catch((err) => {
            console.log("Error: " + err)
        })





}


exports.UserList = async (req, res, next) => {
    var username;
    const userData = await User.findOne({ userId: req.session.uid });
    // console.log(userData);
    username = userData.userName;
    access = userData.access

    console.log("username: ", username);

    let fcn;
    let records = [];

    if (req.params.orgName == "doctor" || req.params.orgName == "patient" || req.params.orgName == "lab" || req.params.orgName == "insurance" || req.params.orgName == "pharmacy") {

        if (req.params.orgName == "doctor") {
            fcn = "getDoctor";
        } else if (req.params.orgName == "patient") {
            fcn = "getPatient";
        } else if (req.params.orgName == "lab") {
            fcn = "getLab";
        } else if (req.params.orgName == "insurance") {
            fcn = "getInsurance";
        } else if (req.params.orgName == "pharmacy") {
            fcn = "getPharmacy";
        }
        console.log("1");
        await User.find({ orgName: req.params.orgName }).then((async usersList => {
            console.log("2")
            await Promise.all(Object.keys(usersList).map(async (user, index) => {
                console.log("user ", index);
                console.log(usersList[index].userName, " : ", usersList[index].userId);
                console.log("3");
                let message = await query.query("main-channel1", "chaincode1", [usersList[index].userId], fcn, username, "patient");
                records.push(message);
            }));
            console.log("4");
        }));
        console.log("5");
        return res.status(200).json({ success: true, records, access });
    } else {
        res.status(400).json({ success: false, message: "Invalid Organization name" });
    }
}

exports.HealthRecords = async (req, res, next) => {

    var username;

    console.log("1")
    var patientId = req.session.uid;
    const getPatient = await User.findOne({ userId: patientId }).then((result) => {
        console.log("result: ", result, "patientId: ", patientId);
        username = result.userName;

    })
    console.log("2")
    var recordsData = []

    const records = await Record.find({ patientId }).then(async (result) => {

        await Promise.all(Object.keys(result).map(async (item) => {

            let message = await query.query("main-channel1", "chaincode1", [result[item].RecordId], "getPrescriptionRecord", username, "patient");
            message.medicines = JSON.parse(JSON.parse(message.medicines));
            message.labTests = JSON.parse(JSON.parse(message.labTests));
            console.log(message.labTests)
            recordsData.push(message);
        }));
        console.log("4")
    });
    console.log("3")
    res.status(200).json({ success: true, recordsData });

}

exports.LabRecords = async (req, res, next) => {
    var username;
    const patientId = req.session.uid
    const getPatient = await User.findOne({ userId: patientId }).then((result) => {
        console.log("result: ", result, "patientId: ", patientId);
        username = result.userName;

    })

    var recordsData = []

    const records = await Record.find({ patientId }).then(async (result) => {

        await Promise.all(Object.keys(result).map(async (item) => {

            let message = await query.query("main-channel1", "chaincode1", [result[item].RecordId], "getLabTestReport", username, "patient");
            message = JSON.parse(message);
            console.log("message: ",message)
            recordsData.push(message);
        }));
    });

    res.status(200).json({ success: true, recordsData });

}

exports.PharmacyRecords = async (req, res, next) => {

    var username;

    const patientId = req.session.uid;

    const getPatient = await User.findOne({ userId: patientId }).then((result) => {
        console.log("result: ", result, "patientId: ", patientId);
        username = result.userName;

    })

    var recordsData = []

    const records = await Record.find({ patientId }).then(async (result) => {

        await Promise.all(Object.keys(result).map(async (item) => {
            console.log("result: ", result[item]);    
            let message = await query.query("main-channel1", "chaincode1", [result[item].RecordId], "getMedicineData", username, "patient");
            console.log("message record data: ", message);
            message.medicines = JSON.parse(JSON.parse(message.medicines));
            message.recordId = result[item].RecordId;
            message.doctorId = result[item].doctorId;
            recordsData.push(message);
        }));
    });

    res.status(200).json({ success: true, recordsData });

}

exports.InsuranceRecords = async (req, res, next) => {

    var username;
    const patientId = req.session.uid

    const getPatient = await User.findOne({ userId: patientId }).then((result) => {
        console.log("result: ", result, "patientId: ", patientId);
        username = result.userName;

    })

    var recordsData = []

    const records = await Record.find({ patientId }).then(async (result) => {

        await Promise.all(Object.keys(result).map(async (item) => {

            let message = await query.query("main-channel1", "chaincode1", [result[item].RecordId], "getClaimRequests", username, "patient");
            //message.medicines = JSON.parse(JSON.parse(message.medicines));
            message.recordId = result[item].RecordId;
            recordsData.push(message);
        }));
    });

    res.status(200).json({ success: true, recordsData });

}