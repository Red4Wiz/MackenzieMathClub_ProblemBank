import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Hero.css';
import {ROUTES} from './routes';
import Markdown from './markdown';
import { ProblemTop, ProblemTags } from './ProblemView';

const Hero = () => {
  const [problemIds, setProblemIds] = useState([]);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    // get the problem idds
    axios.get('http://localhost:8080/problems', {'headers':{'Authorization': localStorage.getItem('token')}})
      .then((response) => {
        setProblemIds(response.data);
        setProblems(new Array(response.data.length))

        // for each id, try filling in the current problem
        response.data.forEach((problem, ind) => {
          axios.get(`${ROUTES.api}/problem/get/${problem.id}`, {'headers': {'Authorization': localStorage.getItem('token')}})
          .then((res) => {
            if(res.status === 200){
              const newProblems = [...problems]
              newProblems[ind] = res.data
              console.log(ind)
              setProblems(newProblems)
            }
          })
        })

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

  const hFlex = {
    display: 'flex',
    flexDirection: 'row'
  }

  return (
    <div className="hero-container">
      
      <div className="problems-list">
        {problems.map((problem) => (
            //links to the problem
            <div key={problem.id} className="problem-item problem-selectable" onClick={() => window.location = `/problem-view/${problem.id}`} style={{padding: '10px 20px'}}>
              {!problem ? "Loading..." : 
                <>
                  <ProblemTop problem={problem}></ProblemTop>
                  <div className='statement-desc' style={{height: '5em', overflow: 'hidden'}}>
                    <Markdown>{problem.statement}</Markdown>
                  </div>
                  <ProblemTags problem={problem}></ProblemTags>
                </>
              }
            </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
