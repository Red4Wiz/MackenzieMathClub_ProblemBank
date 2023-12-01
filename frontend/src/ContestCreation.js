import React, { useState, useEffect } from 'react';
import './ContestCreation.css';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import jsPDF from 'jspdf';
import axios from 'axios';

const ContestCreation = () => {
  const [contestTitle, setContestTitle] = useState('');
  const [availableProblems, setAvailableProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [problemDetails, setProblemDetails] = useState([]); // New state to store problem details
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/problems', {'headers':{'Authorization': localStorage.getItem('token')}})
      .then((response) => {
        if(response.status === 200){
          setAvailableProblems(response.data.map((el) => {
            return {
              label: el.title,
              value: el.id
            };
          }));
        }
      })
      .catch((error) => {
        console.error('Error fetching problems: ', error.message);
      });
  }, []);

  useEffect(() => {
    // Fetch problem details when selectedProblems change
    const fetchProblemDetails = async () => {
      const promises = selectedProblems.map((problem) =>
        axios.get(`http://localhost:8080/api/problem/get/${problem.value}`, {'headers': {'Authorization': localStorage.getItem('token')}})
      );

      try {
        const responses = await Promise.all(promises);
        const problemDetailsData = responses.map((response) => response.data);
        setProblemDetails(problemDetailsData);
      } catch (error) {
        console.error('Error fetching problem details: ', error.message);
        // Handle error fetching problem details
      }
    };

    fetchProblemDetails();
  }, [selectedProblems]);

  const handleContestCreation = (e) => {
    e.preventDefault();
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text(contestTitle, 20, 20);

    pdf.setFontSize(12);
    selectedProblems.forEach((problem, index) => {
      const yPos = 40 + index * 30; // Adjust the y position as needed
      pdf.text(`Problem Title: ${problem.label}`, 20, yPos);
      pdf.text(`Problem Statement: ${problemDetails[index]?.statement || 'N/A'}`, 20, yPos + 10);
      pdf.text(`Answer: ${problemDetails[index]?.solution || 'N/A'}`, 20, yPos + 20);
    });

    pdf.save('contest.pdf');
    console.log('Contest creation logic will be added here');
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(selectedProblems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedProblems(items);
  };

  return (
    <div className="contest-form-container">
      <form onSubmit={handleContestCreation} className="contest-form">
        <label htmlFor="contestTitle">Contest Title</label>
        <input
          type="text"
          id="contestTitle"
          name="contestTitle"
          value={contestTitle}
          onChange={(e) => setContestTitle(e.target.value)}
        />

        <div className="line"></div>

        {/* Display selected problem titles */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="selectedProblems">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="selected-problems-container"
              >
                {selectedProblems.map((problem, index) => (
                  <Draggable
                    key={problem.value}
                    draggableId={problem.value.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="selected-problem"
                        style={{
                          ...provided.draggableProps.style,
                          background: snapshot.isDragging ? 'lightblue' : 'white',
                          margin: '8px',
                          padding: '8px',
                          border: '1px solid lightgray',
                          borderRadius: '4px',
                        }}
                      >
                        {problem.label}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="line"></div>

        <label htmlFor="availableProblems">Available Problems</label>
        <Select
          isMulti
          name="availableProblems"
          value={selectedProblems}
          onChange={(selectedOptions) =>
            setSelectedProblems(selectedOptions || []) // Handle null selectedOptions
          }
          options={availableProblems}
        />

        <button type="submit">Create Contest</button>
      </form>
    </div>
  );
};

export default ContestCreation;
