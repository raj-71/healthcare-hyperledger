const { Gateway, Wallets, } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util')


const helper = require('./helper')
const query = async (channelName, chaincodeName, args, fcn, username, org_name) => {

    try {

        const ccp = await helper.getCCP(org_name) //JSON.parse(ccpJSON);

        console.log("query 0", org_name);

        const walletPath = await helper.getWalletPath(org_name) //.join(process.cwd(), 'wallet');
        console.log("walletPath: ", walletPath);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        console.log("query 1");

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true }
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);
        let result;

        console.log("args: ", args);
        console.log("fcn: ", fcn);
    
        if (fcn == "getAllPatients") {
            result = await contract.evaluateTransaction(fcn, args);
        
        } else if (fcn == "getAllDoctors") {
            result = await contract.evaluateTransaction(fcn, args);

            result = JSON.parse(result.toString());

            console.log("result: ", result);

            // result.forEach(result => {
            //     result.labTests = JSON.parse(JSON.parse(result.labTests));
            //     result.medicines = JSON.parse(JSON.parse(result.medicines));
            // });

            return result;
        
        } else if (fcn == "getAllPharmacies") {
            result = await contract.evaluateTransaction(fcn, args);
        
        } else if (fcn == "getAllLabs") {
            result = await contract.evaluateTransaction(fcn, args);
        
        } else if (fcn == "getAllInsurance") {
            result = await contract.evaluateTransaction(fcn, args);
        
        } else if (fcn == "getPatient") {
            result = await contract.evaluateTransaction(fcn, args[0]);
            result = JSON.parse(result.toString());
            
            console.log("result:", result);

            result.medicalRecords.forEach(medicalRecords => {
                medicalRecords.labTests = JSON.parse(JSON.parse(medicalRecords.labTests));
                medicalRecords.medicines = JSON.parse(JSON.parse(medicalRecords.medicines));
            });

            return result

        } else if (fcn == "getDoctor") {
            console.log("inside getDoctor")
            result = await contract.evaluateTransaction(fcn, args[0]);

            result = JSON.parse(result.toString());
            result.prescriptions.forEach(prescriptions => {
                prescriptions.labTests = JSON.parse(JSON.parse(prescriptions.labTests));
                prescriptions.medicines = JSON.parse(JSON.parse(prescriptions.medicines));
                
            });
            return result

        } else if (fcn == "getPharmacy") {
            result = await contract.evaluateTransaction(fcn, args[0]);

        } else if (fcn == "getLab") {
            result = await contract.evaluateTransaction(fcn, args[0]);

        } else if (fcn == "getInsurance") {
            result = await contract.evaluateTransaction(fcn, args[0]);

        } else if (fcn == "doctorExists") {
            result = await contract.evaluateTransaction(fcn, args[0]);

        } else if (fcn == "getPrescriptionRecord") { 
            result = await contract.evaluateTransaction(fcn, args[0]);

        } else if (fcn == "getMedicineData") {
            result = await contract.evaluateTransaction(fcn, args[0]);

        } else if (fcn == "getLabTestReport") {
            console.log("inside args[0]: ", args[0]);
            result = await contract.evaluateTransaction(fcn, args[0]);

        } else if (fcn == "getClaimRequests") {
            console.log("inside getClaimRequests: ", args);
            result = await contract.evaluateTransaction(fcn, args[0]);
        }
        else {
            console.error(`No such function: ${fcn}`);
            result = `No such function: ${fcn}`;
        }
        console.log(result)
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        result = JSON.parse(result.toString());
        return result
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return error.message

    }
}

exports.query = query