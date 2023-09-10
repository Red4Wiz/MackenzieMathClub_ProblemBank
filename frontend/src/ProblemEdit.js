import React, { useState, useEffect } from 'react';
import './ProblemForm.css';
import { ROUTES } from './routes.js';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import { MarkdownEditor } from './markdown';

const ProblemEdit = () => {
  const { id } = useParams();

  const [problem, setProblem] = useState({});
  const [problemTags, setProblemTags] = useState([]);
  const [contestTags, setContestTags] = useState([]);
  const [selectedPTags, setSelectedPTags] = useState([]);
  const [selectedCTags, setSelectedCTags] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch problem details
    fetch(`${ROUTES.api}/problem/get/${id}`, {
      headers: { 'Authorization': localStorage.getItem('token') }
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 400) {
          throw new Error('Please ensure your id is a positive integer');
        } else {
          throw new Error("Couldn't find problem");
        }
      })
      .then((val) => {
        setProblem(val);
        setSelectedPTags(val.problem_tags.map((tag) => ({ value: tag.id, label: tag.name })));
        setSelectedCTags(val.contest_tags.map((tag) => ({ value: tag.id, label: tag.name })));
      })
      .catch((error) => {
        console.error(error.message);
      });

    //set problem tags
    fetch(`${ROUTES.api}/problemTags`, { method: 'get' }).then((res) => {
      if (res.status === 200) {
        res.json().then((value) => setProblemTags(value.map((el) => { return { "value": el.id, "label": el.name } })))
      } else {
        console.log("querying problem tags error")
      }
    })

    // set contest tags
    fetch(`${ROUTES.api}/contestTags`, { method: 'get' }).then((res) => {
      if (res.status === 200) {
        res.json().then((value) => setContestTags(value.map((el) => { return { "value": el.id, "label": el.name } })))
      } else {
        console.log("querying contest tags error")
      }
    })
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${ROUTES.api}/problem/alter`, {
      method: 'post',
      headers: {
        Authorization: localStorage.getItem('token'),
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        'id': problem.id,
        'author': problem.author,
        'title': problem.title,
        'statement': problem.statement,
        'solution': problem.solution,
        'problemTags': selectedPTags.map((el) => el.value),
        'contestTags': selectedCTags.map((el) => el.value)
      })
    }).then((res) => {
      if(res.status === 200){
        alert('Problem Altered');
        navigate('/')
      }
      else alert('Error');
    })
  };  

  return (
    <div className="problem-form-container">
      <form onSubmit={handleSubmit} className="problem-form">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={problem.title || ''}
          onChange={(e) => setProblem({ ...problem, title: e.target.value })}
          className="input-text"
        />
  
        <label htmlFor="statement">Statement:</label>
        <MarkdownEditor
          value={problem.statement || ''}
          onChange={(val) => setProblem({ ...problem, statement: val })}
          className="input-text"
          markdownHeading={<h3>PREVIEW</h3>}
        />
  
        <div className="line"></div>
  
        <label htmlFor="solution">Solution:</label>
        <MarkdownEditor
          value={problem.solution || ''}
          onChange={(val) => setProblem({ ...problem, solution: val })}
          className="input-text"
          markdownHeading={<h3>PREVIEW</h3>}
        />
  
        <div className="line"></div>
  
        <label htmlFor="problemTags">Problem Tags:</label>
        <Select
          isMulti
          name="problemTags"
          value={selectedPTags}
          onChange={setSelectedPTags}
          options={problemTags}
        />
  
        <label htmlFor="contestTags">Contest Tags:</label>
        <Select
          isMulti
          name="contestTags"
          value={selectedCTags}
          onChange={setSelectedCTags}
          options={contestTags}
        />
  
        <button type="submit">Save</button>
      </form>
    </div>
  );  
};

export default ProblemEdit;
