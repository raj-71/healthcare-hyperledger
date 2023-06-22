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

exports.medicineRecord = async (req,res,next)=>{

    const patientId = req.body.patientId;
    const recordId = req.body.recordId;
    const medicineBill = req.body.medicineBill;
    const medicines = req.body.medicines;
    // const username = req.body.username;
    const orgName = "pharmacy";
    const transient = {};
    const args = [ recordId, medicineBill, medicines];

    // MongoDB access code to check if pharmacy has access to this recordId
    var flag = 0;
    let username;
    const checkAccess = await User.findOne({userId:req.session.uid}).then((result)=>{
        console.log("medicalRecord 2");
        console.log("result: ", result);
        username = result.userName;
        if(!result.access.includes(patientId)){
            console.log("medicalRecord 3");
            flag = 1;
            return res.status(400).json({ success: false, message: `You do not have right to read the prescription for this user` });
        }
    });

    if(flag == 1){
        return;
    }
    

    // invoke code to update the medicalRecord with recordId

    let message = await invoke.invokeTransaction("main-channel1", "chaincode1", "medicineDispensed", args, username, orgName, transient);
    console.log("medicalRecord 6");
    console.log(`message result is : ${message}`)

    res.status(200).json({
        success: true,
        message: "Medicine Data updated successfully"
    })
}



exports.getMedicineRecord = async (req,res,next)=>{

    const {patientId} = req.query;

    const checkAccess = await User.findOne({userId:req.session.uid}).then((result)=>{

        if(!result.access.includes(patientId)){
            return res.status(400).json({ success: false, message: `You do not have right to read the prescription for this user` });
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
        
            let message = await query.query("main-channel1", "chaincode1", [result[0].RecordId], "getMedicineData", username, "patient");

            message.medicines = JSON.parse(JSON.parse(message.medicines));
            recordsData.push(message);
        }));
    });

    res.status(200).json({ success: true, recordsData });

}