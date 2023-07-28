import React, { useState, useEffect } from 'react';
import './ProblemForm.css';
import { ROUTES } from './routes.js';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';

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
      if(res.status === 200) alert('Problem Altered');
      else alert('Error');
    })
  };  

  return (
    <div className="problem-form-container">
      <form onSubmit={handleSubmit} className="problem-form">
        <h2>Edit Problem</h2>
        <label>
          Title:
          <input type="text" name="title" value={problem.title || ''} onChange={(e) => setProblem({ ...problem, title: e.target.value })} />
        </label>
        <label>
          Statement:
          <textarea name="statement" value={problem.statement || ''} onChange={(e) => setProblem({ ...problem, statement: e.target.value })} />
        </label>
        <label>
          Solution:
          <textarea name="solution" value={problem.solution || ''} onChange={(e) => setProblem({ ...problem, solution: e.target.value })} />
        </label>
        <label>
          Problem Tags:
          <Select isMulti name="problemTags" value={selectedPTags} onChange={setSelectedPTags} options={problemTags} />
        </label>
        <label>
          Contest Tags:
          <Select isMulti name="contestTags" value={selectedCTags} onChange={setSelectedCTags} options={contestTags} />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default ProblemEdit;
