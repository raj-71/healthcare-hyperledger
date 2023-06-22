const User = require('../../Model/Users');
const constants = require('../../config/constants.json')
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const helper = require('../../app/helper')
const invoke = require('../../app/invoke')
const qscc = require('../../app/qscc')
const query = require('../../app/query')
const jwt = require('jsonwebtoken');
const Record = require('../../Model/PaitientRecords');
logger.level = 'debug';
function getErrorMessage(field) {
    var response = {
        success: false,
        message: field + ' field is missing or Invalid in the request'
    };
    return response;
}

exports.requestClaimRecord = async (req,res,next)=>{
    const {patientId, recordId} = req.body;
    const transient = {};
    
    // var flag = 0;

    // const checkAccess = await User.findOne({userId:req.session.uid}).then((result)=>{
    //     console.log("result: ", result, "patientId: ", patientId);
    //     if(!result.access.includes(patientId)){
    //         flag = 1;
    //         return res.status(400).json({ success: false, message: `You do not have right to read the prescription for this user` });
    //     }
    // });

    // if(flag == 1){
    //     return;
    // }

    var username;

    const getPatient = await User.findOne({userId: patientId}).then((result)=>{
        console.log("result: ", result, "patientId: ", patientId);
        username = result.userName;
    })

    console.log("username: ", username);
    console.log("recordId: ", recordId);

    let requestDate = new Date();

    let message = await invoke.invokeTransaction("main-channel1", "chaincode1", "addClaimRequest", [recordId, requestDate], username, "patient", transient);
    console.log(`message result is : ${message}`)
    res.status(200).json({
        success: true,
        message
    });
}

exports.claimResponse = async (req,res,next)=>{

    const {recordId, status} = req.body;
    const transient = {};
    let responseDate = (new Date()).toISOString();
    const args = [ recordId, status, responseDate];
    var username;

    // patientId = Number(patientId);
    let patientId = 419468;

    console.log("patientId: ",  typeof patientId, "recordId: ", recordId, "status: ", status, "responseDate: ", responseDate);
    
    const checkAccess = await User.findOne({userId:req.session.uid}).then((result)=>{
        username = result.userName;
        console.log("result: ", result, "patientId: ", patientId, "username: ", username);
        if(!result.access.includes(patientId)){
            return res.status(200).json({ success: false, message: `You do not have right to read the prescription for this user` });
        }
    })


    // const getPatient = await User.findOne({userId: patientId}).then((result)=>{
    //     console.log("result: ", result, "patientId: ", patientId);
    // })

    let message = await invoke.invokeTransaction("main-channel1", "chaincode1", "addClaimResponse", args, username, "patient", transient);
    console.log(`message result is : ${message}`)
    return res.status(200).json({
        success: true,
        message
    });
}



exports.getInsuranceRecord = async (req,res,next)=>{

    const patientId = req.session.uid;

    const checkAccess = await User.findOne({userId:req.session.uid}).then((result)=>{
         console.log(result)
        if(!result.access.includes(patientId)){
            return res.status(200).json({ success: false, message: `You do not have right to read the prescription for this user` });
        }

    })

    var username;

    const getPatient = await User.findOne({userId: patientId}).then((result)=>{
        console.log("result: ", result, "patientId: ", patientId);
        username = result.userName;
    })

    var recordsData=[]

    const records = await Record.find({patientId}).then(async (result)=>{

        await Promise.all(Object.keys(result).map(async (item)=>{
        
            let message = await query.query("main-channel1", "chaincode1", [result[0].RecordId], "getClaimRequests", username, "patient");

            console.log("message: ", message);

            // message.medicines = JSON.parse(JSON.parse(message.medicines));
            recordsData.push(message);
        }));
    });

    res.status(200).json({ success: true, recordsData });

}