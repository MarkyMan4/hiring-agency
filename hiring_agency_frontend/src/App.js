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
import PendingCareTakerRequests from './components/pendingCareTakerRequests';
import CareTakerAccountRequestDetail from './components/careTakerAccountRequestDetail';
import CareTakerAccountRequestApproved from './components/careTakerAccountRequestApproved';
import CareTakerAccountRequestRejected from './components/careTakerAccountRequestRejected';
import StaffRoute from './routes/staffRoute';
import AdminRoute from './routes/adminRoute';


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
          <Route path="/add_new_staff" element={ <AdminRoute roles={ roles }><AddStaff/></AdminRoute> } />
          <Route path="/create_job" element={ <StaffRoute roles={ roles }><CreateAdvertisement/></StaffRoute> } />
          <Route path="/view_job" element={<ViewAdvertisement/>} />
          <Route path="/caretaker_acct_request" element={<CareTakerAccountRequest />} />
          <Route path="/caretaker_acct_request_success" element={ <StaffRoute roles={ roles }><CareTakerAccountRequestSuccess /></StaffRoute> } />
          <Route path="/pending_caretaker_requests" element={ <StaffRoute roles={ roles }><PendingCareTakerRequests /></StaffRoute> } />
          <Route path="/pending_caretaker_requests/:id" element={<StaffRoute roles={ roles }><CareTakerAccountRequestDetail /></StaffRoute> } />
          <Route path="/pending_caretaker_requests/:id/approve" element={ <StaffRoute roles={ roles }><CareTakerAccountRequestApproved /></StaffRoute> } />
          <Route path="/pending_caretaker_requests/:id/reject" element={ <StaffRoute roles={ roles }><CareTakerAccountRequestRejected /></StaffRoute> } />
        </Routes>
      );
    }
  }

  return (
    <div>
      <NavMenu />
      <div className="app">
        <Router>
          { getRoutes() }
        </Router>
      </div>
    </div>
  );
}

export default App;
