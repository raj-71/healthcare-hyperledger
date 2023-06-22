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

exports.register = async (req,res,next)=>{

    const args = req.body.args;
    const username = req.body.username;
    const orgName = req.body.orgName;
    const password = req.body.password;
    const transient = {};
    const fcn = req.body.fcn;

    // check admin status

    if (!username) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!orgName) {
        res.json(getErrorMessage('\'orgName\''));
        return;
    }

    // if (user1) {
    //     res.status(400).json({
    //         success: false,
    //         message: "User Already Exits"
    //     });
    //     return;
    // }

    const user1 = await User.findOne({ userName:username }).select("+password");
    if (user1) {
        res.status(400).json({
            success: false,
            message: "User Already Exits"
        });
        return;
    }

    while(true){
        var userId = Math.floor(100000 + Math.random() * 900000);
        const us = await User.findOne({ userId }).select("+password");
        if(us){
            continue
        }else{
            break
        }
    }

    
    // wallet
    let response = await helper.getRegisteredUser(username, orgName, true);

    args.unshift(userId);
    logger.debug('args: ', args);

    // ledger
    let message = await invoke.invokeTransaction("main-channel1", "chaincode1", fcn, args, username, orgName, transient);
    
    console.log("ledger message: ",message);

    logger.debug('-- returned from registering the username %s for organization %s', username, orgName);
    if (response && typeof response !== 'string') {
        logger.debug('Successfully registered the username %s for organization %s', username, orgName);
        const user = await User.create({
            userName:username,orgName,password,userId
    
        })
        req.session.uid = user.userId;
        req.session.role = user.orgName;

        var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,);

    
        response.token = token;
        response.userName = user.userName;
        response.userId = user.userId
        response.orgName = user.orgName;
        res.json(response);
    } else {
        logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
        res.json({ success: false, message: response });
    }


}

exports.registerPatient = async (req,res,next)=>{

    const args = req.body.args;
    const username = req.body.username;
    const orgName = req.body.orgName || "patient" ;
    const password = req.body.password;
    const transient = {};
    const fcn = req.body.fcn || "registerPatient";

    // check admin status

    

    

    if (!username) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!orgName) {
        res.json(getErrorMessage('\'orgName\''));
        return;
    }

    // if (user1) {
    //     res.status(400).json({
    //         success: false,
    //         message: "User Already Exits"
    //     });
    //     return;
    // }

    const user1 = await User.findOne({ userName:username }).select("+password");
    if (user1) {
        res.status(400).json({
            success: false,
            message: "User Already Exits"
        });
        return;
    }

    while(true){
        var userId = Math.floor(100000 + Math.random() * 900000);
        const us = await User.findOne({ userId }).select("+password");
        if(us){
            continue
        }else{
            break
        }
    }

    
    // wallet
    let response = await helper.getRegisteredUser(username, orgName, true);

    args.unshift(userId);
    logger.debug('args: ', args);

    // ledger
    let message = await invoke.invokeTransaction("main-channel1", "chaincode1", fcn, args, username, orgName, transient);
    
    console.log("ledger message: ",message);

    logger.debug('-- returned from registering the username %s for organization %s', username, orgName);
    if (response && typeof response !== 'string') {
        logger.debug('Successfully registered the username %s for organization %s', username, orgName);
        const user = await User.create({
            userName:username,orgName,password,userId
    
        })
        req.session.uid = user.userId;
        req.session.role = user.orgName;

        var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,);

    
        response.token = token;
        response.userName = user.userName;
        response.userId = user.userId
        response.orgName = user.orgName;
        res.json(response);
    } else {
        logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
        res.json({ success: false, message: response });
    }


}

exports.Login = async (req,res,next)=>{
    var username = req.body.username;
    var orgName = req.body.orgName;
    var password = req.body.password;
    logger.debug('End point : /users');
    logger.debug('User name : ' + username);
    logger.debug('Org name  : ' + orgName);

    if (!username) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!orgName) {
        res.json(getErrorMessage('\'orgName\''));
        return;
    }

    let user = await User.findOne({ userName:username }).select("+password");
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid username or Password "
        });
    }
    console.log(orgName,user.orgName)
    if(user.orgName != orgName){
        return res.status(400).json({
            success: false,
            message: "Username on this organization does not exits"
        });

    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return res.status(400).json({
            success: false,
            message: "Invalid username or Password"
        });

    }

    req.session.uid = user.userId;
    req.session.role = user.orgName;

    console.log(req.session.uid,req.session.role)

    var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,);

    if(orgName =="Admin"){

        return res.status(200).json({ success: true, token,userName:user.userName,orgName:user.orgName,userId:user.userId });

        
    }
    let isUserRegistered = await helper.isUserRegistered(username, orgName);

    if (isUserRegistered) {
        
        res.status(200).json({ success: true, token,userName:user.userName,orgName:user.orgName,userId:user.userId });

    } else {
        res.status(400).json({ success: false, message: `User with username ${username} is not registered with ${orgName}, Please register first.` });
    }

}

exports.getUserDetails = async (req,res,next)=>{    
    console.log("started",req.session.uid)
    const userdata = await User.findOne({userId:req.session.uid}).then(
        async (result)=>{

            console.log("result: ",result);

            var accessMemberDetails=[];

            await Promise.all(result.access.map(async (item)=>{

                console.log("item: ",item);

                const userDetails = await User.findOne({userId:item}).then(
                    async accessResult => {
                        console.log("userDetails: ", accessResult);

                        // fetch query
                        let fcn;
                        if(accessResult.orgName == "doctor"){
                            fcn="getDoctor"
        
                        }else if(accessResult.orgName == "patient"){
                            fcn="getPatient"
                            
                        }else if(accessResult.orgName == "lab"){
                            fcn="getLab"
                            
                        }else if(accessResult.orgName == "pharmacy"){
                            fcn="getPharmacy"
                            
                        }else if(accessResult.orgName == "insurance"){
                            fcn="getIncuranceCompany"
                            
                        }
        
                        const userDataFromLedger = await query.query("main-channel1", "chaincode1", [accessResult.userId], fcn, accessResult.userName, accessResult.orgName);
                        accessMemberDetails.push(userDataFromLedger);
                    }
                    
                );        
            }));

            res.status(200).json({ success: true, result, accessMemberDetails, status:"success" });

        }
    )


}