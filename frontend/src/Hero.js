import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Hero.css';
import {ROUTES} from './routes';

const Hero = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/problems', {'headers':{'Authorization': localStorage.getItem('token')}})
      .then((response) => {
        setProblems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching problems: ', error.message);
      });
  }, []);

  const removeProblem = (id) => {
    fetch(`${ROUTES.api}/problem/delete/${id}`, {
      method: 'post', 
      headers:{Authorization: localStorage.getItem('token')}
    }).then((res) => {
      if(res.status !== 200){
        alert("error deleting");
      } else {
        window.location.reload(false);
      }
    })
  }

  return (
    <div className="hero-container">
      <Link to="/problem-form">
        <button className="hero-button">Create a Problem</button>
      </Link>
      <div className="problems-list">
        {problems.map((problem) => (
          //links to the problem
          
            <div key={problem.id} className="problem-item">
              <Link to={`/problem-view/${problem.id}`}>
                <h3>{problem.title}</h3>
              </Link>
              <Link to={`/problem-edit/${problem.id}`}>
                <p>edit</p>
              </Link>
              <Link onClick={() => removeProblem(problem.id)}>
                <p>remove</p>
              </Link>
            </div>
          
        ))}
      </div>
    </div>
  );
};

export default Hero;
