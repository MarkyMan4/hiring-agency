import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './components/login';
import Home from './components/home';
import NavMenu from './components/navMenu';
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
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
