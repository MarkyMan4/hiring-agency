import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './components/login';
import Home from './components/home';
import NavMenu from './components/navMenu';
import ChangePassword from './components/changePassword';
import SetSecurityQuestions from './components/setSecurityQuestions';
import AddStaff from './components/addStaff';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AccountLocked from './components/accountLocked';
import { useEffect, useState } from 'react';
import { getAuthToken, isUserLoggedIn } from './utils/storage';
import { getUser } from './api/authRequests';
import CreateAdvertisement from './components/createAdvertisement';

import ViewAdvertisement from './components/viewAdvertisement';
import CareTakerAccountRequest from './components/careTakerAccountRequest';
import CareTakerAccountRequestSuccess from './components/careTakerAccountRequestSuccess';
import CreateApplication from './components/createApplication.jsx';
import CreateApplicationSuccess from './components/createApplicationSuccess';
import PendingCareTakerRequests from './components/pendingCareTakerRequests';
import CareTakerAccountRequestDetail from './components/careTakerAccountRequestDetail';
import CareTakerAccountRequestApproved from './components/careTakerAccountRequestApproved';
import CareTakerAccountRequestRejected from './components/careTakerAccountRequestRejected';
import StaffRoute from './routes/staffRoute';
import AdminRoute from './routes/adminRoute';
import UnauthenticatedRoute from './routes/unauthenticatedRoute';
import CareTakerRoute from './routes/careTakerRoute';
import CreateServiceRequest from './components/createServiceRequest';
import CreateServiceRequestSuccess from './components/createServiceRequestSuccess';
import ServiceRequests from './components/serviceRequests';
import AddStaffSuccess from './components/createAdvertisementSuccess';


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
          <Route path="/create_job_success" element={ <StaffRoute roles={ roles }><AddStaffSuccess /></StaffRoute> } />
          <Route path="/view_job" element={ <UnauthenticatedRoute roles={ roles }><ViewAdvertisement/></UnauthenticatedRoute> } />
          <Route path="/caretaker_acct_request" element={ <UnauthenticatedRoute roles={ roles }><CareTakerAccountRequest /></UnauthenticatedRoute> } />
          <Route path="/caretaker_acct_request_success" element={ <CareTakerAccountRequestSuccess /> } />
          <Route path="/pending_caretaker_requests" element={ <StaffRoute roles={ roles }><PendingCareTakerRequests /></StaffRoute> } />
          <Route path="/pending_caretaker_requests/:id" element={<StaffRoute roles={ roles }><CareTakerAccountRequestDetail /></StaffRoute> } />
          <Route path="/pending_caretaker_requests/:id/approve" element={ <StaffRoute roles={ roles }><CareTakerAccountRequestApproved /></StaffRoute> } />
          <Route path="/pending_caretaker_requests/:id/reject" element={ <StaffRoute roles={ roles }><CareTakerAccountRequestRejected /></StaffRoute> } />
          <Route path="/create_service_request" element={ <CareTakerRoute roles={ roles }><CreateServiceRequest roles={ roles } /></CareTakerRoute> } />
          <Route path="/create_service_request_success" element={ <CareTakerRoute roles={ roles }><CreateServiceRequestSuccess /></CareTakerRoute> } />
          <Route path="/service_requests" element={ <StaffRoute roles={ roles }><ServiceRequests /></StaffRoute> } />
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
