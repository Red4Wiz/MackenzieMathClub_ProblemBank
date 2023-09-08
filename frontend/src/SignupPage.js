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
      {error && <p className="error-message">{error}</p>}
      <form className="signup-form" onSubmit={handleSubmit}>
        <label htmlFor="username" className='input-text'>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="username" className='input-text'>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label htmlFor="username" className='input-text'>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="username" className='input-text'>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="username" className='input-text'>One Time Code</label>
        <input
          type="text"
          value={oneTimeCode}
          onChange={(e) => setOneTimeCode(e.target.value)}
        />
        <button type="submit">Sign Up!</button>
      </form>
    </div>
  );
};

export default SignupPage;