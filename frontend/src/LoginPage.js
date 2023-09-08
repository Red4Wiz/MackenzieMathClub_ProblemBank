import React, { useState } from 'react';
import './LoginPage.css';
import axios from 'axios';

const LoginPage = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setLoggedIn(true);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      {error && <p className="error-message">{error}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username" className='input-text'>Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password" className='input-text'>Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login!</button>
      </form>
    </div>
  );
};

export default LoginPage;
