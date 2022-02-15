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
          <Route path="/add_new_staff" element={<AddStaff/>} />
          <Route path="/create_job" element={<CreateAdvertisement/>} />
          <Route path="/view_job" element={<ViewAdvertisement/>} />
          <Route path="/caretaker_acct_request" element={<CareTakerAccountRequest />} />
          <Route path="/caretaker_acct_request_success" element={<CareTakerAccountRequestSuccess />} />
          { roles.includes('admin') || roles.includes('staff') ? <Route path="/pending_caretaker_requests" element={<PendingCareTakerRequests />} /> : null }
          { roles.includes('admin') || roles.includes('staff') ? <Route path="/pending_caretaker_requests/:id" element={<CareTakerAccountRequestDetail />} /> : null }
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
