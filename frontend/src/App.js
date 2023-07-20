import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import LoginPage from './LoginPage';
import Hero from './Hero';
import ProblemForm from './ProblemForm';

const App = () => {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="header-left">
            <Link to="/">
              <h1>Mackenzie Math Problem Bank</h1>
            </Link>
          </div>
          <div className="header-right">
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>
          </div>
        </header>
        <div className="content">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/problem-form" element={<ProblemForm />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
