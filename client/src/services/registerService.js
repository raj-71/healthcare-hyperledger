import httpService from "./httpService";

const tokenKey = "token";
const roleKey = "role";
const userid = "userId";
const username = "userName";
const org = "orgName";

const apiEndpoint = "/register";
const apiEndpointLedger = "/channels/main-channel1/chaincodes/chaincode1";

export async function register(user) {
  const res = await httpService.post(apiEndpoint, user);

  console.log(res.data);

  return res;

}
export async function registerPatient(user) {
  const res = await httpService.post("/register-patient", user);

  console.log(res.data);

  return res;

}

async function registerLedger(user) {
  
  let data = {
    fcn: "registerPatient",
    peers: ["peer0.patient.healthcare.com", "peer0.doctor.healthcare.com", "peer0.pharmacy.healthcare.com", "peer0.lab.healthcare.com", "peer0.insurance.healthcare.com"],
    args: [user.id, user.name, user.dob, user.gender, user.aadharNumber, user.contact, user.bloodGroup, user.address],
    transient: {}
  }

  const res = await httpService.post(apiEndpointLedger, data);

  return res;

}

const registerService = { register, registerLedger,registerPatient};

export default registerService;
