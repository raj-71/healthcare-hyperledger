import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./container/home";
import Navbar from "./container/navbar";  
import Page404 from "./container/page404";
import Login from "./components/login/login";
import Register from "./components/login/register";
import RegisterByAdmin from "./components/login/registerByAdmin";
import Dashboard from "./container/dashboard";
import RoleAccess from "./common/roleAccess";
import SelectDoctor from "./components/patient/selectDoctor";
import HealthRecords from "./components/patient/HealthRecords";
// import ChemistRecords from "./components/patient/selectChemist";
import InsuranceRecords from "./components/patient/InsuranceRecords";
import LabRecords from "./components/patient/LabRecords";
import PaitentsRecords from "./components/doctor/PaitirntRecords";
import ClaimRequests from "./components/Insurance/ClaimRequest";
import Paitents from "./components/lab/Paitient";
import AddRecords from "./components/lab/AddReports";
import GenerateBills from "./components/chemist/GenerateBill";
import CustomerList from "./components/chemist/CustomerList";
import DoctorData from "./components/patient/DoctorData";
import SelectChemist from "./components/patient/selectChemist";
import SelectLab from "./components/patient/SelectLab";
import PharmacyRecords from "./components/patient/PharmacyRecords";
import SelectInsuranceCompany from "./components/patient/SelectInsuranceCompany";
import AddPatientRecords from "./components/doctor/AddPatientRecord";
import LabData from "./components/patient/LabData";
import Logout from "./container/logout";
function App() {

  // console.log = function(){};

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/select-doctor" element={<SelectDoctor/>} />

                          {/* Admin */}
                          
        <Route element={<RoleAccess roles={["Admin"]} />}>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/add-user" element={<RegisterByAdmin/>} />
        </Route>

                          {/* Patient */}

        <Route element={<RoleAccess roles={["patient"]} />} >
        {/* <Route > */}
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/select-doctor" element={<SelectDoctor/>} />
          <Route path="/select-lab" element={<SelectLab/>} />
          <Route path="/select-insurance-company" element={<SelectInsuranceCompany/>} />

          <Route path='/select-doctor/doctor-data' element={<DoctorData/>} />
          <Route path="/health-records" element={<HealthRecords/>} />
          <Route path="/select-pharmacy" element={<SelectChemist/>} />
          <Route path="/select-pharmacy/lab-data" element={<LabData/>} />
          <Route path="/lab-records" element={<LabRecords />} />
          <Route path="/pharmacy-records" element={<PharmacyRecords />} />

          <Route path="/insurance-records" element={<InsuranceRecords />} />
        </Route>

                          {/* Doctor */}
                          
        {/* <Route element={<RoleAccess roles={["doctor"]} />}> */}
        {/* <Route> */}
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/patient-records" element={<PaitentsRecords/>} />
          <Route path="/add-patient-records" element={<AddPatientRecords/>} />

        {/* </Route> */}

                          {/* Pharmacy */}
                          
        <Route element={<RoleAccess roles={["pharmacy"]} />}>
        {/* <Route> */}
          <Route path="/dashboard" element={<Dashboard/>} />
          {/* <Route path="/update-medicine-stock" element={<Dashboard/>} /> */}
          <Route path="/customer-list" element={<CustomerList/>} />
          <Route path="/generate-bill" element={<GenerateBills/>} />
        </Route>

                          {/* Lab */}
                          
        <Route element={<RoleAccess roles={["lab"]} />}>
        {/* <Route> */}
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/add-reports" element={<AddRecords/>} />
          <Route path="/paitient-records" element={<Paitents/>} />
        </Route>

                          {/* Insurance */}
                          
        <Route element={<RoleAccess roles={["insurance"]} />}>
        {/* <Route>   */}
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/latest-requests" element={<ClaimRequests/>} />
        </Route>

        <Route path="/logout" element={<Logout/>} />

        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App;


// patient
//      /health-records
//      /select-doctor
//      /select-doctor/doctor-data
//      /select-chemist
//      /select-chemist/chemist-data
//      /select-labs
//      /select-labs/lab-data
//      /insurance-records

// doctor
//      /select-patient
//      /patient-history
//      /prescription

// chemist
//      /select-patient
//      /update-dispensary
//      /update-medicine-stock

// lab
//      /select-patient
//      /add-reports
	
// insurance
//      /latest-requests
//      /patient-record
//      /patient-claim
	
// admin
//      /add-user