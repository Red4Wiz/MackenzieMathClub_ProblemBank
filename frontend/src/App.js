import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import LoginPage from './LoginPage';

const App = () => {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="header-left">
            <h1>Mackenzie Math Problem Bank</h1>
          </div>
          <div className="header-right">
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>
          </div>
        </header>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
