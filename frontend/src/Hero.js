import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Hero.css';

const Hero = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/problems')
      .then((response) => {
        setProblems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching problems: ', error.message);
      });
  }, []);

  return (
    <div className="hero-container">
      <Link to="/problem-form">
        <button className="hero-button">Create a Problem</button>
      </Link>
      <div className="problems-list">
        {problems.map((problem) => (
          //links to the problem
          
            <div className="problem-item">
              <Link key={problem.id} to={`/problem-view/${problem.id}`}>
                <h3>{problem.title}</h3>
              </Link>
            </div>
          
        ))}
      </div>
    </div>
  );
};

export default Hero;
