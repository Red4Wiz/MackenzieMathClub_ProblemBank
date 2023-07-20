import React from 'react';
import './ProblemForm.css';

const ProblemForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
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
          <input type="text" name="problemTags" />
        </label>
        <label>
          Contest Tags:
          <input type="text" name="contestTags" />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProblemForm;
