import './App.css';
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './pages/login';
import Home from './pages/home';
import NavMenu from './components/navMenu';
import ChangePassword from './pages/changePassword';
import SetSecurityQuestions from './pages/setSecurityQuestions';
import AddStaff from './pages/addStaff';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AccountLocked from './pages/accountLocked';
import { useEffect, useState } from 'react';
import { getAuthToken, isUserLoggedIn } from './utils/storage';
import { getUser } from './api/authRequests';
import CreateAdvertisement from './pages/createAdvertisement';

import ViewAdvertisement from './pages/viewAdvertisement';
import CareTakerAccountRequest from './pages/careTakerAccountRequest';
import CareTakerAccountRequestSuccess from './pages/careTakerAccountRequestSuccess';
import CreateApplication from './pages/createApplication.jsx';
import CreateApplicationSuccess from './pages/createApplicationSuccess';
import PendingCareTakerRequests from './pages/pendingCareTakerRequests';
import CareTakerAccountRequestDetail from './pages/careTakerAccountRequestDetail';
import CareTakerAccountRequestApproved from './pages/careTakerAccountRequestApproved';
import CareTakerAccountRequestRejected from './pages/careTakerAccountRequestRejected';
import StaffRoute from './routes/staffRoute';
import AdminRoute from './routes/adminRoute';
import UnauthenticatedRoute from './routes/unauthenticatedRoute';
import CareTakerRoute from './routes/careTakerRoute';
import CreateServiceRequest from './pages/createServiceRequest';
import CreateServiceRequestSuccess from './pages/createServiceRequestSuccess';
import ServiceRequests from './pages/serviceRequests';
import CreateJobSuccess from './pages/createAdvertisementSuccess';
import ServiceRequestDetail from './pages/serviceRequestDetail';
import JobRequestList from './pages/jobRequestList';
import JobRequesDetail from './pages/jobRequestDetail';
import JobRequesReject from './components/jobRequestRejected';
import JobRequesApproved from './pages/jobRequestApproved';
import StaffList from './pages/staffList';
import StaffDetail from './pages/staffDetail';
import StaffStatusChanged from './pages/staffStatusChanged';
import CareTakerList from './pages/careTakerList';
import CareTakerDetail from './pages/careTakerDetail';
import CareTakerStatusChanged from './pages/careTakerStatusChanged';
import MyMenu from './pages/myMenu';
import BillingAccounts from './pages/billingAccounts';
import BillingAccountDetail from './pages/billingAccountDetail';
import CTServiceRequests from './pages/careTakerViewServiceRequests.jsx';
import CTServiceRequestDetail from './pages/cTServiceRequestDetail';
import HealthcareProfessionals from './pages/healthcareProfessionals';
import HealthcareProDetail from './pages/healthcareProfessionalDetail';


function App() {
  const [accountLocked, setAccountLocked] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if(isUserLoggedIn()) {
      getUser(getAuthToken())
        .then(res => {
          setAccountLocked(res.is_locked);
          setRoles(res.groups);
        });
    }
  }, []);

  const getRoutes = () => {
    if(accountLocked) {
      return (
        <Routes>
          <Route path="*" element={ <AccountLocked /> } />
        </Routes>
      );
    }
    else {
      return (
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/login" element={ <Login /> } />
          <Route path="/change_password" element={ <ChangePassword /> } />
          <Route path="/set_security_questions" element={ <SetSecurityQuestions /> } />
          <Route path="/account_locked" element={ <AccountLocked /> } />
          <Route path="/create_application/:jobid" element={ <UnauthenticatedRoute roles={ roles }><CreateApplication/></UnauthenticatedRoute> } />
          <Route path="/create_application_success" element={ <UnauthenticatedRoute roles={ roles }><CreateApplicationSuccess/></UnauthenticatedRoute> } />
          <Route path="/add_new_staff" element={ <AdminRoute roles={ roles }><AddStaff/></AdminRoute> } />
          <Route path="/create_job" element={ <StaffRoute roles={ roles }><CreateAdvertisement/></StaffRoute> } />
          <Route path="/create_job_success" element={ <StaffRoute roles={ roles }><CreateJobSuccess /></StaffRoute> } />
          <Route path="/view_job" element={ <UnauthenticatedRoute roles={ roles }><ViewAdvertisement/></UnauthenticatedRoute> } />
          <Route path="/caretaker_acct_request" element={ <UnauthenticatedRoute roles={ roles }><CareTakerAccountRequest /></UnauthenticatedRoute> } />
          <Route path="/caretaker_acct_request_success" element={ <CareTakerAccountRequestSuccess /> } />
          <Route path="/pending_caretaker_requests" element={ <StaffRoute roles={ roles }><PendingCareTakerRequests /></StaffRoute> } />
          <Route path="/pending_caretaker_requests/:id" element={<StaffRoute roles={ roles }><CareTakerAccountRequestDetail /></StaffRoute> } />
          <Route path="/pending_caretaker_requests/:id/approve" element={ <StaffRoute roles={ roles }><CareTakerAccountRequestApproved /></StaffRoute> } />
          <Route path="/pending_caretaker_requests/:id/reject" element={ <StaffRoute roles={ roles }><CareTakerAccountRequestRejected /></StaffRoute> } />
          <Route path="/create_service_request" element={ <CareTakerRoute roles={ roles }><CreateServiceRequest roles={ roles } /></CareTakerRoute> } />
          <Route path="/create_service_request_success" element={ <CareTakerRoute roles={ roles }><CreateServiceRequestSuccess /></CareTakerRoute> } />
          <Route path="/caretaker_view_service_request" element={ <CareTakerRoute roles={ roles }><CTServiceRequests roles={ roles } /></CareTakerRoute> } />
          <Route path="/service_requests" element={ <StaffRoute roles={ roles }><ServiceRequests /></StaffRoute> } />
          <Route path="/service_requests/:id" element={ <StaffRoute roles={ roles }><ServiceRequestDetail /></StaffRoute> } />
          <Route path="/ct_service_requests/:id" element={ <CareTakerRoute roles={ roles }><CTServiceRequestDetail /></CareTakerRoute> } /> 
          <Route path="/hp_job_application" element={<StaffRoute roles={ roles }><JobRequestList /> </StaffRoute>} /> 
          <Route path="/hp_job_application/:id" element={<StaffRoute roles={ roles }><JobRequesDetail /></StaffRoute>} /> 
          <Route path="/hp_job_application/:id/approve" element={<StaffRoute roles={ roles }><JobRequesApproved /></StaffRoute>} /> 
          <Route path="/hp_job_application/:id/reject" element={<StaffRoute roles={ roles }> <JobRequesReject /></StaffRoute>} /> 
          <Route path="/view_staff_list" element={ <AdminRoute roles={ roles }><StaffList/></AdminRoute> } />
          <Route path="/view_staff_list/:id" element={ <AdminRoute roles={ roles }><StaffDetail/></AdminRoute> } />
          <Route path="/view_staff_list/:id/status" element={ <AdminRoute roles={ roles }><StaffStatusChanged/></AdminRoute> } />
          <Route path="/view_caretaker_list" element={ <StaffRoute roles={ roles }><CareTakerList/></StaffRoute> } />
          <Route path="/view_caretaker_list/:id" element={ <StaffRoute roles={ roles }><CareTakerDetail/></StaffRoute> } />
          <Route path="/view_caretaker_list/:id/status" element={ <StaffRoute roles={ roles }><CareTakerStatusChanged/></StaffRoute> } />
          <Route path="/user_menu" element={ <MyMenu /> } />
          <Route path="/billing_accounts" element={<StaffRoute roles={ roles }> <BillingAccounts /></StaffRoute>} /> 
          <Route path="/billing_accounts/:id" element={<StaffRoute roles={ roles }> <BillingAccountDetail /></StaffRoute>} /> 
          <Route path="/healthcare_professionals" element={<StaffRoute roles={ roles }> <HealthcareProfessionals /></StaffRoute>} /> 
          <Route path="/healthcare_professionals/:id" element={<StaffRoute roles={ roles }> <HealthcareProDetail /></StaffRoute>} />
        </Routes>
      );
    }
  }

  return (
    <div>
      <NavMenu roles={ roles } />
      <div className="app">
        <Router>
          { getRoutes() }
        </Router>
      </div>
    </div>
  );
}

export default App;
