import React, { useState, useEffect } from 'react';
import './ProblemForm.css';
import { ROUTES } from './routes.js';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { MarkdownEditor } from './markdown';

const ProblemForm = () => {
  const [problemTags, setProblemTags] = useState([]);
  const [contestTags, setContestTags] = useState([]);
  const [selectedPTags, setSelectedPTags] = useState([]);
  const [selectedCTags, setSelectedCTags] = useState([]);
  const [statement, setStatement] = useState('');
  const [solution, setSolution] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${ROUTES.api}/problemTags`, { method: 'get' })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((value) =>
            setProblemTags(value.map((el) => ({ value: el.id, label: el.name })))
          );
        } else {
          console.log('querying problem tags error');
        }
      });

    fetch(`${ROUTES.api}/contestTags`, { method: 'get' })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((value) =>
            setContestTags(value.map((el) => ({ value: el.id, label: el.name })))
          );
        } else {
          console.log('querying contest tags error');
        }
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let url = ROUTES.api + '/problem/create/';
    let data = new FormData(e.target);

    fetch(url, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        author: 1,
        title: data.get('title'),
        statement: statement,
        solution: solution,
        problemTags: selectedPTags.map((e) => e.value),
        contestTags: selectedCTags.map((e) => e.value),
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((value) => {
            console.log(value);
          });
          navigate('/');
        } else {
          alert('Server Error!');
        }
      });
  };

  return (
    <div className="problem-form-container">
      <form onSubmit={handleSubmit} className="problem-form">
        <label htmlFor="title" >Problem Title</label>
        <input type="text" id="title" name="title" />

        <label htmlFor="statement" >Problem Statement</label>
        <MarkdownEditor
          value={statement}
          onChange={setStatement}
          className="input-text"
          markdownHeading={<h3>PREVIEW</h3>}
        />

        <div div className="line"></div>

        <label htmlFor="solution" >Solution</label>
        <MarkdownEditor
          value={solution}
          onChange={setSolution}
          className="input-text"
          markdownHeading={<h3>PREVIEW</h3>}
        />

        <div div className="line"></div>

        <label htmlFor="problemTags" >Problem Tags</label>
        <Select
          isMulti
          name="problemTags"
          value={selectedPTags}
          onChange={setSelectedPTags}
          options={problemTags}
        ></Select>

        <label htmlFor="contestTags" >Contest Tags</label>
        <Select
          isMulti
          name="contestTags"
          value={selectedCTags}
          onChange={setSelectedCTags}
          options={contestTags}
        ></Select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProblemForm;
