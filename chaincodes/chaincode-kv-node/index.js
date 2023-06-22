const { Contract } = require("fabric-contract-api");
const crypto = require("crypto");

class KVContract extends Contract {
  constructor() {
    super("KVContract");
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// PATIENT RELATED CHAINCODE /////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////
  // Register Patient
  /////////////////////////////
  async registerPatient(
    ctx,
    patientId,
    name,
    dob,
    gender,
    aadharNumber,
    contact,
    bloodGroup,
    address
  ) {
    const newPatient = {
      patientId,
      name,
      dob,
      gender,
      aadharNumber,
      contact,
      bloodGroup,
      address,
      orgName: "patient",
      medicalRecords: [],
      insuranceRecord: [],
    };

    const buffer = Buffer.from(JSON.stringify(newPatient));
    await ctx.stub.putState(patientId, buffer);

    console.log("Patient is registered successfully!!!");

    return { success: "OK" };
  }

  /////////////////////////////
  // Get Patient
  /////////////////////////////
  async getPatient(ctx, patientId) {
    const buffer = await ctx.stub.getState(patientId);

    if (!buffer || buffer.length === 0) {
      throw new Error(`The patient with ID ${patientId} does not exist`);
    }

    const patient = JSON.parse(buffer.toString());

    return patient;
  }

  /////////////////////////////
  // Check if patient exists
  /////////////////////////////
  async patientExists(ctx, patientId) {
    const isPatient = await ctx.stub.getState(patientId);

    return isPatient && isPatient.length > 0;
  }

  /////////////////////////////
  // Get All Patients
  /////////////////////////////
  async getAllPatients(ctx) {
    const allResults = [];

    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }

    return JSON.stringify(allResults);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// DOCTOR RELATED CHAINCODE //////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////
  // Register Doctor
  /////////////////////////////
  async registerDoctor(
    ctx,
    doctorId,
    name,
    dob,
    gender,
    aadharNumber,
    contact,
    department,
    degree
  ) {
    const newDoctor = {
      doctorId,
      name,
      dob,
      gender,
      aadharNumber,
      contact,
      department,
      orgName: "doctor",
      degree,
      prescriptions: [],
    };

    const buffer = Buffer.from(JSON.stringify(newDoctor));
    await ctx.stub.putState(doctorId, buffer);

    return { success: "OK" };
  }

  /////////////////////////////
  // Get Doctor
  /////////////////////////////
  async getDoctor(ctx, doctorId) {
    const buffer = await ctx.stub.getState(doctorId);

    if (!buffer || buffer.length === 0) {
      throw new Error(`The doctor with ID ${doctorId} does not exist`);
    }

    const doctor = JSON.parse(buffer.toString());

    return doctor;
  }

  /////////////////////////////
  // Check if doctor exists
  /////////////////////////////
  async doctorExists(ctx, doctorId) {
    const isDoctor = await ctx.stub.getState(doctorId);

    return isDoctor && isDoctor.length > 0;
  }

  /////////////////////////////
  // Get All Doctors
  /////////////////////////////
  async getAllDoctors(ctx) {
    const allResults = [];

    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }

    return JSON.stringify(allResults);
  }

  /////////////////////////////
  // Prescribe Medicine
  /////////////////////////////

  async createPrescriptionRecord(
    ctx,
    recordId,
    patientId,
    doctorId,
    diagnosis,
    medicines,
    labTests,
    createdAt
  ) {
    const newPrescriptionRecord = {
      recordId,
      patientId,
      doctorId,
      diagnosis,
      medicines: JSON.stringify(medicines),
      labTests: JSON.stringify(labTests),
      createdAt,
    };

    console.log("newPrescriptionRecord: ", newPrescriptionRecord);

    const buffer = Buffer.from(JSON.stringify(newPrescriptionRecord));
    await ctx.stub.putState(recordId, buffer);

    // update patient's medical records
    const patient = await this.getPatient(ctx, patientId);
    patient.medicalRecords.push(newPrescriptionRecord);
    const patientBuffer = Buffer.from(JSON.stringify(patient));
    await ctx.stub.putState(patientId, patientBuffer);

    // update doctor's prescriptions
    const doctor = await this.getDoctor(ctx, doctorId);
    doctor.prescriptions.push(newPrescriptionRecord);
    const doctorBuffer = Buffer.from(JSON.stringify(doctor));
    await ctx.stub.putState(doctorId, doctorBuffer);

    return { success: "OK", newPrescriptionRecord };
  }

  async getPrescriptionRecord(ctx, recordId) {
    const buffer = await ctx.stub.getState(recordId);

    if (!buffer || buffer.length === 0) {
      throw new Error(
        `The prescription record with ID ${recordId} does not exist`
      );
    }

    const prescriptionRecord = JSON.parse(buffer.toString());

    return prescriptionRecord;
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// PHARMACY RELATED CHAINCODE ////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////
  // Register Pharmacy
  /////////////////////////////
  async registerPharmacy(ctx, pharmacyId, name, contact, address, createdAt) {
    const newPharmacy = {
      pharmacyId,
      name,
      contact,
      address,
      createdAt,
    };

    const buffer = Buffer.from(JSON.stringify(newPharmacy));
    await ctx.stub.putState(pharmacyId, buffer);

    return { success: "OK" };
  }

  /////////////////////////////
  // Get Pharmacy
  /////////////////////////////
  async getPharmacy(ctx, pharmacyId) {
    const buffer = await ctx.stub.getState(pharmacyId);

    if (!buffer || buffer.length === 0) {
      throw new Error(`The pharmacy with ID ${pharmacyId} does not exist`);
    }

    const pharmacy = JSON.parse(buffer.toString());

    return pharmacy;
  }

  /////////////////////////////
  // Get all pharmacies
  /////////////////////////////
  async getAllPharmacies(ctx) {
    const allResults = [];

    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }

    return JSON.stringify(allResults);
  }

  /////////////////////////////
  // Get Medicine Data
  /////////////////////////////
  async getMedicineData(ctx, recordId) {
    const buffer = await ctx.stub.getState(recordId);

    if (!buffer || buffer.length === 0) {
      throw new Error(`The medicine with ID ${recordId} does not exist`);
    }

    const record = JSON.parse(buffer.toString());

    let data = {
      medicineBill: record.medicineBill,
      medicines: record.medicines,
    };

    return data;
  }

  /////////////////////////////
  // Mark Medicine as Dispensed
  /////////////////////////////
  async medicineDispensed(ctx, recordId, medicineBill, medicineData) {
    let record = await this.getPrescriptionRecord(ctx, recordId);

    record.medicineBill = medicineBill;

    record.medicines = JSON.stringify(medicineData);

    const recordBuffer = Buffer.from(JSON.stringify(record));
    await ctx.stub.putState(recordId, recordBuffer);

    return { success: "OK" };
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// LAB RELATED CHAINCODE /////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////
  // Register Lab
  /////////////////////////////
  async registerLab(ctx, labId, name, contact, address, createdAt) {
    const newLab = {
      labId,
      name,
      contact,
      address,
      createdAt
    };

    const buffer = Buffer.from(JSON.stringify(newLab));
    await ctx.stub.putState(labId, buffer);

    return { success: "OK" };
  }

  /////////////////////////////
  // Get Lab
  /////////////////////////////
  async getLab(ctx, labId) {
    const buffer = await ctx.stub.getState(labId);

    if (!buffer || buffer.length === 0) {
      throw new Error(`The lab with ID ${labId} does not exist`);
    }

    const lab = JSON.parse(buffer.toString());

    return lab;
  }

  /////////////////////////////
  // Get all labs
  /////////////////////////////
  async getAllLabs(ctx) {
    let allResults = [];

    let iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      let strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }

    return JSON.stringify(allResults);
  }

  /////////////////////////////
  // Add Lab Test Report
  /////////////////////////////
  async addLabTestReport(ctx, recordId, labTestReport, labBill) {
    let record = await this.getPrescriptionRecord(ctx, recordId); 

    record.labTests = JSON.stringify(labTestReport);
    record.labBill = labBill;

    const recordBuffer = Buffer.from(JSON.stringify(record));
    await ctx.stub.putState(recordId, recordBuffer);

    return { success: "OK" };
  }

  /////////////////////////////
  // Get Lab Test Report
  /////////////////////////////
  async getLabTestReport(ctx, recordId) {
    const buffer = await ctx.stub.getState(recordId);

    if (!buffer || buffer.length === 0) {
      throw new Error(`The medical record with ID ${recordId} does not exist`);
    }

    const medicalRecord = JSON.parse(buffer.toString());
    const labRecord = medicalRecord.labTests;

    return labRecord;
  }



  /////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// INSURANCE RELATED CHAINCODE ///////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////
  // Register Insurance
  /////////////////////////////
  async registerInsurance(ctx, insuranceId, name, contact, address, createdAt) {
    const newInsurance = {
      insuranceId,
      name,
      contact,
      address,
      createdAt
    };

    const buffer = Buffer.from(JSON.stringify(newInsurance));
    await ctx.stub.putState(insuranceId, buffer);

    return { success: "OK" };
  }

  /////////////////////////////
  // Get Insurance
  /////////////////////////////
  async getInsurance(ctx, insuranceId) {
    const buffer = await ctx.stub.getState(insuranceId);

    if (!buffer || buffer.length === 0) {
      throw new Error(`The insurance with ID ${insuranceId} does not exist`);
    }

    const insurance = JSON.parse(buffer.toString());

    return insurance;
  }

  /////////////////////////////
  // Get all Insurances
  /////////////////////////////
  async getAllInsurances(ctx) {
    let allResults = [];

    let iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      let strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }

    return JSON.stringify(allResults);
  }

  /////////////////////////////
  // Get Claim Requests
  /////////////////////////////
  async getClaimRequests(ctx, recordId) {
    let buffer = await ctx.stub.getState(recordId);

    if (!buffer || buffer.length === 0) {
      throw new Error(`The medical record with ID ${recordId} does not exist`);
    }

    let record = JSON.parse(buffer.toString());

    let insuranceRecord;
    if(!record.insuranceRecord){
      return false;
    }
    else {
      let claimRequests = record.insuranceRecord.insuranceClaim;
      
      if(claimRequests){
        insuranceRecord = record.insuranceRecord;
      } else{
        return false;
      }
    }

    return insuranceRecord;
  }

  /////////////////////////////
  // Add Claim Request
  /////////////////////////////
  async addClaimRequest(ctx, recordId, requestDate) {
    let buffer = await ctx.stub.getState(recordId);

    if (!buffer || buffer.length === 0) {
      throw new Error(`The medical record with ID ${recordId} does not exist`);
    }

    let record = JSON.parse(buffer.toString());

    let insuranceRecord = {
      insuranceClaim: true,
      status: "in process",
      claimRequestDate: requestDate,
    }

    record.insuranceRecord = insuranceRecord;

    const recordBuffer = Buffer.from(JSON.stringify(record));
    await ctx.stub.putState(recordId, recordBuffer);

    return { success: "OK" };

  }

  /////////////////////////////
  // claim Response by Insurance Company
  /////////////////////////////
  async addClaimResponse(ctx, recordId, status, responseDate) {
    let buffer = await ctx.stub.getState(recordId);

    if (!buffer || buffer.length === 0) {
      throw new Error(`The medical record with ID ${recordId} does not exist`);
    }

    let record = JSON.parse(buffer.toString());

    let insuranceRecord = record.insuranceRecord;
    insuranceRecord.status = status;
    insuranceRecord.claimResponseDate = responseDate;

    record.insuranceRecord = insuranceRecord;

    const recordBuffer = Buffer.from(JSON.stringify(record));
    await ctx.stub.putState(recordId, recordBuffer);

    return { success: "OK" };
  }

}

exports.contracts = [KVContract];
