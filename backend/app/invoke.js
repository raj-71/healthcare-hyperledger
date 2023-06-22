const { Gateway, Wallets, TxEventHandler, GatewayOptions, DefaultEventHandlerStrategies, TxEventHandlerFactory } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util')

const helper = require('./helper')

const invokeTransaction = async (channelName, chaincodeName, fcn, args, username, org_name, transientData) => {
    try {
        logger.debug(util.format('\n============ invoke transaction on channel %s ============\n', channelName));

        console.log("args: ",args);
        console.log("typeof args: ",typeof args);

        const ccp = await helper.getCCP(org_name);
        const walletPath = await helper.getWalletPath(org_name);
        console.log(`Wallet path: ${walletPath}`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        console.log("invoke 1");

        const connectOptions = {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true },
            eventHandlerOptions: {
                commitTimeout: 100,
                strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX
            }
        }

        console.log("invoke 2");

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, connectOptions);

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        const contract = network.getContract(chaincodeName);

        let result
        let message;

        console.log("invoke args: ",args);

        // Chaincode functions to be invoked, number of arguments and their values

        if (fcn === "registerPatient") {

            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
            message = `Successfully added the patient to the ledger with id ${args[0]}`

        } else if (fcn === "registerDoctor") {

            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
            message = `Successfully added the doctor to the ledger with id ${args[0]}`

        } else if (fcn === "registerPharmacy") {
            console.log('fcn: ', fcn, 'args: ', args, 'org: ', org_name, username);
            let createdAt = new Date();
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], createdAt);
            message = `Successfully added the pharmacy to the ledger with id ${args[0]}`

        } else if (fcn === "registerInsurance") {
            let createdAt = new Date();
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], createdAt);
            message = `Successfully added the insurance to the ledger with id ${args[0]}`

        } else if (fcn === "registerLab") {
            let createdAt = new Date();
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], createdAt);
            message = `Successfully added the lab to the ledger with id ${args[0]}`

        } else if (fcn === "createPrescriptionRecord") {
            console.log("invoke 3")
            console.log("args[4]: ",args[4], "args[5]: ",args[5]);
            console.log("args[4] stringified: ",JSON.stringify(args[4]), "args[5] stringified: ",JSON.stringify(args[5]));

            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], JSON.stringify(args[4]), JSON.stringify(args[5]), args[6]);
            message = `Successfully added the prescription record to the ledger with id ${args[0]}`
        
        } else if (fcn === "medicineDispensed") {

            console.log("inside medicineDispensed, args: ", args, JSON.stringify(args[2]));
            result = await contract.submitTransaction(fcn, args[0], args[1], JSON.stringify(args[2]));
            message = `Successfully added the medicine dispensed record to the ledger with id ${args[0]}`
        
        } else if (fcn === "addLabTestReport") {

            console.log("inside createLabReport, args: ", args, JSON.stringify(args[1]));
            result = await contract.submitTransaction(fcn, args[0], JSON.stringify(args[1]), args[2]);
            message = `Successfully added the lab report to the ledger with id ${args[0]}`

        } else if (fcn === "addClaimRequest") {

            console.log("inside addClaimRequest, args: ", args);
            result = await contract.submitTransaction(fcn, args[0], args[1]);
            message = `Successfully added the claim request to the ledger with id ${args[0]}`
            
        } else if (fcn === "addClaimResponse") {

            console.log("inside claimResponse, args: ", args);
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2]);
            message = `Successfully added the claim response to the ledger with id ${args[0]}`
        }
        else {
            return `Invocation require either createCar or changeCarOwner as function but got ${fcn}`
        }

        await gateway.disconnect();

        console.log("result is ", result);

        result = JSON.parse(result.toString());

        let response = {
            message: message,
            result
        }

        return response;


    } catch (error) {

        console.log(`Getting error: ${error}`)
        return error.message

    }
}

exports.invokeTransaction = invokeTransaction;