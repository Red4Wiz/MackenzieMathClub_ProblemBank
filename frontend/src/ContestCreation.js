import React, { useState, useEffect } from 'react';
import './ContestCreation.css';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import jsPDF from 'jspdf';

const ContestCreation = () => {
  const [contestTitle, setContestTitle] = useState('');
  const [availableProblems, setAvailableProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data for available problems
    const mockData = [
      { id: 1, title: 'Problem 1' },
      { id: 2, title: 'Problem 2' },
      { id: 3, title: 'Problem 3' },
      // Add more mock data as needed
    ];

    setAvailableProblems(mockData.map((el) => ({ value: el.id, label: el.title })));
  }, []);

  const handleContestCreation = (e) => {
    e.preventDefault();
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text(contestTitle, 20, 20);

    pdf.setFontSize(12);
    selectedProblems.forEach((problem, index) => {
      const yPos = 40 + index * 10; // adjusting y position
      pdf.text(problem.label, 20, yPos);
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
                          background: snapshot.isDragging ? 'lightblue' : 'white', margin: '8px',
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
