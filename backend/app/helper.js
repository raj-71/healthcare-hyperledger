'use strict';

var { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');

const util = require('util');

const getCCP = async (org) => {
    let ccpPath;
    if (org == "patient") {
        ccpPath = path.resolve(__dirname, '..', 'config', 'connection-profile-patient.json');

    } else if (org == "doctor") {
        ccpPath = path.resolve(__dirname, '..', 'config', 'connection-profile-doctor.json');
    
    } else if (org == "pharmacy") {
        ccpPath = path.resolve(__dirname, '..', 'config', 'connection-profile-pharmacy.json');

    } else if (org == "lab") {
        ccpPath = path.resolve(__dirname, '..', 'config', 'connection-profile-lab.json');
    
    } else if (org == "insurance") {
        ccpPath = path.resolve(__dirname, '..', 'config', 'connection-profile-insurance.json');
    
    } else
        return null
    console.log("CCP Path: ", ccpPath)
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
    const ccp = JSON.parse(ccpJSON);
    return ccp
}

const getCaUrl = async (org, ccp) => {
    let caURL;
    if (org == "patient") {
        caURL = ccp.certificateAuthorities['ca.patient.healthcare.com'].url;

    } else if (org == "doctor") {
        caURL = ccp.certificateAuthorities['ca.doctor.healthcare.com'].url;
    
    } else if (org == "pharmacy") {
        caURL = ccp.certificateAuthorities['ca.pharmacy.healthcare.com'].url;
    
    } else if (org == "lab") {
        caURL = ccp.certificateAuthorities['ca.lab.healthcare.com'].url;
    
    } else if (org == "insurance") {
        caURL = ccp.certificateAuthorities['ca.insurance.healthcare.com'].url;
    
    } else
        return null
    return caURL

}

const getWalletPath = async (org) => {
    let walletPath;
    if (org == "patient") {
        walletPath = path.join(process.cwd(), 'patient-wallet');

    } else if (org == "doctor") {
        walletPath = path.join(process.cwd(), 'doctor-wallet');

    } else if (org == "pharmacy") {
        walletPath = path.join(process.cwd(), 'pharmacy-wallet');

    } else if (org == "lab") {
        walletPath = path.join(process.cwd(), 'lab-wallet');

    } else if (org == "insurance") {
        walletPath = path.join(process.cwd(), 'insurance-wallet');

    } else
        return null
    console.log("Wallet Path: ", walletPath);
    return walletPath

}


const getAffiliation = async (org) => {

    if(org == "patient")
        return 'patient.department1'
    
    else if(org == "doctor")
        return 'doctor.department1'
    
    else if(org == "pharmacy")
        return 'pharmacy.department1'
    
    else if(org == "lab")
        return 'lab.department1'
    
    else if(org == "insurance")
        return 'insurance.department1'
    
    else
        return null

}

const getRegisteredUser = async (username, userOrg, isJson) => {
    let ccp = await getCCP(userOrg)

    const caURL = await getCaUrl(userOrg, ccp)
    const ca = new FabricCAServices(caURL);

    const walletPath = await getWalletPath(userOrg)
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userIdentity = await wallet.get(username);
    console.log(userIdentity)
    if (userIdentity) {
        console.log(`An identity for the user ${username} already exists in the wallet`);
        var response = {
            success: true,
            message: username + ' enrolled Successfully',
        };
        return response
    }

    // Check to see if we've already enrolled the admin user.
    let adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        console.log('An identity for the admin user "admin" does not exist in the wallet');
        await enrollAdmin(userOrg, ccp);
        adminIdentity = await wallet.get('admin');
        console.log("Admin Enrolled Successfully")
    }

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    let secret;
    try {
        // Register the user, enroll the user, and import the new identity into the wallet.
        secret = await ca.register({ affiliation: await getAffiliation(userOrg), enrollmentID: username, role: 'client' }, adminUser);
        // const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client', attrs: [{ name: 'role', value: 'approver', ecert: true }] }, adminUser);

    } catch (error) {
        return error.message
    }

    const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });
    // const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret, attr_reqs: [{ name: 'role', optional: false }] });

    let x509Identity;
    if (userOrg == "patient") {
        x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'patientMSP',
            type: 'X.509',
        };
    } else if (userOrg == "doctor") {
        x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'doctorMSP',
            type: 'X.509',
        };
    } else if (userOrg == "pharmacy") {
        x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'pharmacyMSP',
            type: 'X.509',
        };
    } else if (userOrg == "lab") {
        x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'labMSP',
            type: 'X.509',
        };
    } else if (userOrg == "insurance") {
        x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'insuranceMSP',
            type: 'X.509',
        };
    }

    await wallet.put(username, x509Identity);
    console.log(`Successfully registered and enrolled admin user ${username} and imported it into the wallet`);

    var response = {
        success: true,
        message: username + ' enrolled Successfully',
    };
    return response
}

const isUserRegistered = async (username, userOrg) => {
    const walletPath = await getWalletPath(userOrg)
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userIdentity = await wallet.get(username);
    if (userIdentity) {
        console.log(`An identity for the user ${username} exists in the wallet`);
        return true
    }
    return false
}


const getCaInfo = async (org, ccp) => {
    let caInfo
    if (org == "patient") {
        caInfo = ccp.certificateAuthorities['ca.patient.healthcare.com'];

    } else if (org == "doctor") {
        caInfo = ccp.certificateAuthorities['ca.doctor.healthcare.com'];

    } else if (org == "pharmacy") {
        caInfo = ccp.certificateAuthorities['ca.pharmacy.healthcare.com'];

    } else if (org == "lab") {
        caInfo = ccp.certificateAuthorities['ca.lab.healthcare.com'];

    } else if (org == "insurance") {
        caInfo = ccp.certificateAuthorities['ca.insurance.healthcare.com'];

    } else
        return null
    return caInfo

}

const enrollAdmin = async (org, ccp) => {

    console.log('calling enroll Admin method')

    try {
        console.log("enrollAdmin method called 1");
        const caInfo = await getCaInfo(org, ccp) //ccp.certificateAuthorities['ca.org1.healthcare.com'];
        console.log("caInfo: ", caInfo);
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        console.log("enrollAdmin method called 2");

        // Create a new file system based wallet for managing identities.
        const walletPath = await getWalletPath(org) //path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        console.log("enrollAdmin method called 3");

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        console.log("enrollAdmin method called 4");

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });

        console.log("enrollAdmin method called 5");
        let x509Identity;
        if (org == "patient") {
            x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'patientMSP',
                type: 'X.509',
            };
        } else if (org == "doctor") {
            x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'doctorMSP',
                type: 'X.509',
            };
        } else if (org == "pharmacy") {
            x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'pharmacyMSP',
                type: 'X.509',
            };
        } else if (org == "lab") {
            x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'labMSP',
                type: 'X.509',
            }
        } else if (org == "insurance") {
            x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'insuranceMSP',
                type: 'X.509',
            }
        }

        console.log("enrollAdmin method called 5");

        await wallet.put('admin', x509Identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
        return
    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
    }
}

const registerAndGerSecret = async (username, userOrg) => {
    let ccp = await getCCP(userOrg)

    const caURL = await getCaUrl(userOrg, ccp)
    const ca = new FabricCAServices(caURL);

    const walletPath = await getWalletPath(userOrg)
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userIdentity = await wallet.get(username);
    console.log(userIdentity)
    if (userIdentity) {
        console.log(`An identity for the user ${username} already exists in the wallet`);
        var response = {
            success: true,
            message: username + ' enrolled Successfully',
        };
        return response
    }

    // Check to see if we've already enrolled the admin user.
    let adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        console.log('An identity for the admin user "admin" does not exist in the wallet');
        await enrollAdmin(userOrg, ccp);
        adminIdentity = await wallet.get('admin');
        console.log("Admin Enrolled Successfully")
    }

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    let secret;
    try {
        // Register the user, enroll the user, and import the new identity into the wallet.
        secret = await ca.register({ affiliation: await getAffiliation(userOrg), enrollmentID: username, role: 'client' }, adminUser);
        // const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client', attrs: [{ name: 'role', value: 'approver', ecert: true }] }, adminUser);

    } catch (error) {
        return error.message
    }

    var response = {
        success: true,
        message: username + ' enrolled Successfully',
        secret: secret
    };
    return response

}

exports.getRegisteredUser = getRegisteredUser

module.exports = {
    getCCP: getCCP,
    getWalletPath: getWalletPath,
    getRegisteredUser: getRegisteredUser,
    isUserRegistered: isUserRegistered,
    registerAndGerSecret: registerAndGerSecret
}