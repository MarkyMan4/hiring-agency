import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './components/login';
import Home from './components/home';
import NavMenu from './components/navMenu';
import ChangePassword from './components/changePassword';
import SetSecurityQuestions from './components/setSecurityQuestions';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <NavMenu />
      <div className="app">
        <Router>
          <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="/login" element={ <Login /> } />
            <Route path="/change_password" element={ <ChangePassword /> } />
            <Route path="/set_security_questions" element={ <SetSecurityQuestions /> } />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
