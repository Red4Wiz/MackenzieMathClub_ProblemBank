import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      <Link to="/problem-form">
        <button className="hero-button">Create a Problem</button>
      </Link>
    </div>
  );
};

export default Hero;
