import React, {useState, useEffect} from 'react';
import './ProblemForm.css';
import {ROUTES} from './routes.js';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';


const ProblemForm = () => {
  // a total list of tags
  const [problemTags, setProblemTags] = useState([])
  const [contestTags, setContestTags] = useState([])
  // selected tags
  const [selectedPTags, setSelectedPTags] = useState([])
  const [selectedCTags, setSelectedCTags] = useState([])

  const navigate = useNavigate();


  // get a list of possible tags
  useEffect(() => {
    // set problem tags
    fetch(`${ROUTES.api}/problemTags`, {method: 'get'}).then((res) => {
      if(res.status === 200){
        res.json().then((value) => setProblemTags(value.map((el) => {return {"value": el.id, "label": el.name}})))
      } else {
        console.log("querying problem tags error")
      }
    })

    // set contest tags
    fetch(`${ROUTES.api}/contestTags`, {method: 'get'}).then((res) => {
      if(res.status === 200){
        res.json().then((value) => setContestTags(value.map((el) => {return {"value": el.id, "label": el.name}})))
      } else {
        console.log("querying contest tags error")
      }
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    // send a request
    let url = ROUTES.api + "/problem/create/";
    let data = new FormData(e.target);

    fetch(url, {
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
          'author': 1,
          'title': data.get('title'),
          'statement': data.get('statement'),
          'solution': data.get('solution'),
          'problemTags': selectedPTags.map((e) => e.value),
          'contestTags': selectedCTags.map((e) => e.value)
        })
    }).then((res) => {
      // if successful, then redirect
      if(res.status === 200){
        res.json().then((value) => {
          console.log(value)
        })
        navigate('/');
      } else {
        alert("Server Error!");
      }
    })
  };

  return (
    <div className="problem-form-container">
      <form onSubmit={handleSubmit} className="problem-form">
        <h2>Create a Problem</h2>
        <label>
          Title:
          <input type="text" name="title" />
        </label>
        <label>
          Statement:
          <textarea name="statement" />
        </label>
        <label>
          Solution:
          <textarea name="solution" />
        </label>
        <label>
          Problem Tags:
          <Select isMulti name="problemTags" value={selectedPTags} onChange={setSelectedPTags} options={problemTags}></Select>
        </label>
        <label>
          Contest Tags:
          <Select isMulti name="problemTags" value={selectedCTags} onChange={setSelectedCTags} options={contestTags}></Select>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProblemForm;
