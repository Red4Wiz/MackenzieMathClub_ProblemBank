import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [oneTimeCode, setOneTimeCode] = useState('');
  const [codes, setCodes] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/codes')
      .then((response) => {
        setCodes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching codes: ', error.message);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!codes.includes(oneTimeCode)) {
      alert('Invalid one-time code. Please try again.');
      return;
    }

    const userData = {
      firstName,
      lastName,
      username,
      password,
      oneTimeCode,
    };

    axios.post('http://localhost:8080/signup', userData)
      .then((response) => {
        console.log(response.data.message);
        console.log("signed up!")
        navigate('/login');
      })
      .catch((error) => {
        setError('Error signing up. Please try again.');
      });
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="One Time Code"
          value={oneTimeCode}
          onChange={(e) => setOneTimeCode(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;