const User = require('../../Model/Users');
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

exports.invoke = async (req,res,next)=>{
        try {
        logger.debug('==================== INVOKE ON CHAINCODE ==================');
        // var peers = req.body.peers;
        var chaincodeName = req.params.chaincodeName;
        var channelName = req.params.channelName;
        var fcn = req.query.fcn;
        var args = req.query.args;
        var transient = {};
        console.log(`Transient data is ;${transient}`)
        logger.debug('channelName  : ' + channelName);
        logger.debug('chaincodeName : ' + chaincodeName);
        logger.debug('fcn  : ' + fcn);
        logger.debug('args  : ' + args);
        logger.debug('username  : ' + req.body.username);
        logger.debug('orgname  : ' + req.body.orgName);
        if (!chaincodeName) {
            res.json(getErrorMessage('\'chaincodeName\''));
            return;
        }
        if (!channelName) {
            res.json(getErrorMessage('\'channelName\''));
            return;
        }
        if (!fcn) {
            res.json(getErrorMessage('\'fcn\''));
            return;
        }
        if (!args) {
            res.json(getErrorMessage('\'args\''));
            return;
        }

        let message = await invoke.invokeTransaction(channelName, chaincodeName, fcn, args, req.body.username, req.body.orgName, transient);
        console.log(`message result is : ${message}`)

        const response_payload = {
            success: true,
            result: message,
            error: null,
            errorData: null
        }
        res.send(response_payload);

    } catch (error) {
        const response_payload = {
            success: false,
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }

 
}

exports.query = async (req,res,next)=>{
        try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');

        var channelName = req.params.channelName;
        var chaincodeName = req.params.chaincodeName;
        console.log(`chaincode name is :${chaincodeName}`)
        let args = `${req.session.uid}`;
        let username;
        let OrgName;
        let fcn
        const user = await User.findOne({userId:req.session.uid}).then((result)=>{
          username = result.userName
          OrgName = result.orgName
        })

        if(OrgName === "patient"){
            fcn = "getPatient";
        } else if(OrgName === "doctor"){
            fcn = "getDoctor";
        }
     
        // let peer = req.query.peer;

        logger.debug('Username: '+ username);
        logger.debug('Orgname: '+ OrgName);
        logger.debug('channelName : ' + channelName);
        logger.debug('chaincodeName : ' + chaincodeName);
        logger.debug('fcn : ' + fcn);
        logger.debug('args : ' + args);

        if (!chaincodeName) {
            res.json(getErrorMessage('\'chaincodeName\''));
            return;
        }
        if (!channelName) {
            res.json(getErrorMessage('\'channelName\''));
            return;
        }
        if (!fcn) {
            res.json(getErrorMessage('\'fcn\''));
            return;
        }
        if (!args) {
            res.json(getErrorMessage('\'args\''));
            return;
        }

        
        

        console.log('args==========', args);
        args = args.replace(/'/g, '"');
        args = JSON.parse(args);
        logger.debug(args);

        console.log("uid: ", req.session.uid);

        // Access security
        // const user = await User.findOne({ userId:req.session.userId }).select("+password");

        // console.log("user: " + user);
        
        // if(!user?.access?.includes(args[0])){
        //     return res.status(400).json({ success: false, message: `User does not have access of this patient.` });

        // }

        console.log("before ledger query");

        let message = await query.query(channelName, chaincodeName, [args], fcn,username,OrgName);

        logger.debug('message : ' + message);

        const response_payload = {
            success: true,
            message,
            error: null,
            errorData: null
        }

        res.send(response_payload);
    } catch (error) {
        const response_payload = {
            success: false,
            result: null,
            error: error.name,
            errorData: error.message,
            status: "failed"
        }
        res.send(response_payload)
    }


}