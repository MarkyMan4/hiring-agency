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
import CreateAdvertisementSuccess from './components/createAdvertisementSuccess';
import ViewAdvertisement from './components/viewAdvertisement';
import CareTakerAccountRequest from './components/careTakerAccountRequest';
import CareTakerAccountRequestSuccess from './components/careTakerAccountRequestSuccess';
import CreateApplication from './components/createApplication.jsx';
import CreateApplicationSuccess from './components/createApplication.jsx';


function App() {
  const [accountLocked, setAccountLocked] = useState(false);

  useEffect(() => {
    if(isUserLoggedIn()) {
      getUser(getAuthToken())
        .then(res => setAccountLocked(res.is_locked));
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
          <Route path="/create_job_success" element={<CreateAdvertisementSuccess/>} />
          <Route path="/view_job" element={<ViewAdvertisement/>} />
          <Route path="/caretaker_acct_request" element={<CareTakerAccountRequest />} />
          <Route path="/caretaker_acct_request_success" element={<CareTakerAccountRequestSuccess />} />
          <Route path="/create_application" element={<CreateApplication/>} />
          <Route path="/create_application_success" element={<CreateApplicationSuccess/>} />
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
