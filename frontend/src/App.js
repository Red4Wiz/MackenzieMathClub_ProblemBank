import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import Hero from './Hero';
import ProblemForm from './ProblemForm';
import { useNavigate } from 'react-router-dom';
import ProblemView from './ProblemView';
import ProblemEdit from './ProblemEdit';


const App = () => {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') ? true : false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/login');
  };

  return (
      <div className="app">
        <header className="header">
          <div className="header-left">
            <Link to="/">
              {/* <img src="logo.png" alt="Logo" /> */}
              <h1>Mackenzie Math Club</h1>
            </Link>
          </div>
          
        </header>
        <div className="content">

          <div className="header-text">
            <div className="header-text-line1">WHERE ALL YOUR PROBLEMS CAN BE FOUND</div>
            <div className="header-text-line2">Mackenzie Math Problem Bank</div>
          </div>

          <div div className="line1"></div>
          <div className="logging">
            {loggedIn ? (
              <>
                <Link to="/problem-form">
                  <button className="login-button">Create Problem</button>
                </Link>
                <Link to="/">
                  <button className="signup-button">View Problems</button>
                </Link>
                <button className="signup-button" onClick={handleLogout}>Logout</button>
                
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="login-button">Login</button>
                </Link>
                <Link to="/signup">
                  <button className="signup-button">Sign Up</button>
                </Link>
              </>
            )}
          </div>
          <div div className="line2"></div>

          <Routes>
            <Route path="/" element={loggedIn ? <Hero /> : <Navigate to="/login" />} />
            <Route path="/problem-form" element={loggedIn ? <ProblemForm /> : <Navigate to="/login" />} />
            <Route path="/problem-view/:id" element={loggedIn ? <ProblemView /> : <Navigate to="/login" />} />
            <Route path="/problem-edit/:id" element={loggedIn ? <ProblemEdit /> : <Navigate to="/login" />} />
            {!loggedIn ? (
              <>
                <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} />} />
                <Route path="/signup" element={<SignupPage />} />
              </>
            ) : (
              <Route path="/login" element={<Navigate to="/" />} />
            )}
          </Routes>
        </div>
      </div>
  );
};

export default App;
