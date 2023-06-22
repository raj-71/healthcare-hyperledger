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

exports.labReports = async (req, res, next) => {

    const patientId = req.body.patientId;
    const recordId = req.body.recordId;
    const labReport = req.body.labReport;
    const labBill = req.body.labBill;

    // while(true){
    //     var recordId = Math.floor(10000 + Math.random() * 90000);
    //     const us = await Record.findOne({ recordId }).select("+password");
    //     if(us){
    //         continue
    //     }else{
    //         break
    //     }
    // }

    // const labBill = req.body.labBill;

    // while(true){
    //     var labBill = Math.floor(10000 + Math.random() * 90000);
    //     const us = await Record.findOne({ recordId }).select("+password");
    //     if(us){
    //         continue
    //     }else{
    //         break
    //     }
    // }
    // const username = req.body.username;
    const orgName = "lab";
    const transient = {};
    const args = [recordId, labReport, labBill];

    var flag = 0;


    let username;
    const checkAccess = await User.findOne({ userId: req.session.uid }).then((result) => {
        username = result.userName;
        console.log("result: ", result, "patientId: ", patientId);
        if (!result.access.includes(patientId)) {
            flag = 1;
            return res.status(400).json({ success: false, message: `You do not have right to update the lab report for this user` });
        }
    });

    if (flag == 1) {
        return;
    }

    let message = await invoke.invokeTransaction("main-channel1", "chaincode1", "addLabTestReport", args, username, orgName, transient);

    console.log(`message result is : ${message}`)

    res.status(200).json({
        success: true,
        message: "Lab Report updated successfully"
    });
}

exports.getLabReport = async (req, res, next) => {

    const patientId = req.query.patientId;

    console.log("patientId: ", patientId);

    const checkAccess = await User.findOne({ userId: req.session.uid }).then((result) => {
        console.log("result: ", result, "patientId: ", patientId);
        if (!result.access.includes(patientId)) {
            return res.status(400).json({ success: false, message: `You do not have right to view lab reports for this user` });
        }
    })

    var username;

    const getPatient = await User.findOne({ userId: patientId }).then((result) => {
        console.log("result: ", result, "patientId: ", patientId);
        username = result.userName;
    })

    var recordsData = []

    console.log("username: ", username);

    const records = await Record.find({patientId}).then(async (result) => {

        console.log("result record: ", result);

        await Promise.all(Object.keys(result).map(async (key) => {

            console.log("result[key]: ", result[0].RecordId);
            
            let message = await query.query("main-channel1", "chaincode1", [result[0].RecordId], "getLabTestReport", username, "patient");

            console.log("message: ", message);

            message = JSON.parse(message);
            recordsData.push(message);
        }));
    });

    res.status(200).json({ success: true, recordsData });
}