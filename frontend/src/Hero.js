import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Hero.css';
import {ROUTES} from './routes';
import Markdown from './markdown';

const Hero = () => {
  const [problemIds, setProblemIds] = useState([]);
  const [problems, setProblems] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8080/problems', {'headers':{'Authorization': localStorage.getItem('token')}})
      .then((response) => {
        setProblemIds(response.data);
        setProblems(new Array(response.data.length))

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

  console.log(problems)

  const hFlex = {
    display: 'flex',
    flexDirection: 'row'
  }

  return (
    <div className="hero-container">
      
      <div className="problems-list">
        {problems.map((problem) => (
            //links to the problem
            <div key={problem.id} className="problem-item" onClick={() => window.location = `/problem-view/${problem.id}`} style={{padding: '10px 20px'}}>
              {!problem ? "Loading..." : 
                <>
                  <div style={{...hFlex, justifyContent: 'space-between'}}>
                  <Link className='header-link' to={`/problem-edit/${problem.id}`} onClick={(e) => e.stopPropagation()}>
                    <p>{problem.title}</p>
                  </Link>
                  <p style={{marginRight: '0', color: 'lightgrey'}}>By {problem.author.firstname} {problem.author.lastname} ({problem.author.username})</p>
                  </div>
                  <div className='statement-desc' style={{height: '5em', overflow: 'hidden'}}>
                    <Markdown>{problem.statement}</Markdown>
                  </div>
                  <div style={{...hFlex, justifyContent: 'space-between', marginTop: '10px'}}>
                    <div style={{...hFlex, gap: '10px'}}>
                      {problem.problem_tags.map((tag) => <div className='topic-tag' key={tag.id}>{tag.name}</div>)}
                    </div>

                    <div style={{...hFlex, gap: '10px'}}>
                      {problem.contest_tags.map((tag) => <div className='contest-tag' key={tag.id}>{tag.name}</div>)}
                    </div>
                  </div>
                </>
              }
            </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
