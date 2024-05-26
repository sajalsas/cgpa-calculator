import React, { useState } from 'react';
import './App.css';

const gradeMapping = {
  'AA': 10,
  'AB': 9,
  'BB': 8,
  'BC': 7,
  'CC': 6,
  'CD': 5,
  'DD': 4,
  'FF': 0,
};

function App() {
  const [semesters, setSemesters] = useState([{ subjects: [{ grade: '', credits: '' }], inputCGPA: false, cgpa: '' }]);
  const [netCgpa, setNetCgpa] = useState(null);

  const handleSubjectChange = (semesterIndex, subjectIndex, event) => {
    const values = [...semesters];
    values[semesterIndex].subjects[subjectIndex][event.target.name] = event.target.value;
    setSemesters(values);
  };

  const handleAddSubject = (semesterIndex) => {
    const values = [...semesters];
    values[semesterIndex].subjects.push({ grade: '', credits: '' });
    setSemesters(values);
  };

  const handleRemoveSubject = (semesterIndex, subjectIndex) => {
    const values = [...semesters];
    values[semesterIndex].subjects.splice(subjectIndex, 1);
    setSemesters(values);
  };

  const handleAddSemester = () => {
    setSemesters([...semesters, { subjects: [{ grade: '', credits: '' }], inputCGPA: false, cgpa: '' }]);
  };

  const handleToggleInputMode = (semesterIndex) => {
    const values = [...semesters];
    values[semesterIndex].inputCGPA = !values[semesterIndex].inputCGPA;
    setSemesters(values);
  };

  const handleCgpaChange = (semesterIndex, event) => {
    const values = [...semesters];
    values[semesterIndex].cgpa = event.target.value;
    setSemesters(values);
  };

  const calculateNetCGPA = () => {
    let sgpaSum = 0;
    let semesterCount = 0;

    semesters.forEach((semester) => {
      if (semester.inputCGPA) {
        const semesterCgpa = parseFloat(semester.cgpa);
        if (!isNaN(semesterCgpa)) {
          sgpaSum += semesterCgpa;
          semesterCount += 1;
        }
      } else {
        let semesterCredits = 0;
        let semesterGradePoints = 0;

        semester.subjects.forEach((subject) => {
          const gradeValue = gradeMapping[subject.grade];
          const credits = parseFloat(subject.credits);
          if (gradeValue !== undefined && !isNaN(credits)) {
            semesterCredits += credits;
            semesterGradePoints += gradeValue * credits;
          }
        });

        if (semesterCredits > 0) {
          const sgpa = semesterGradePoints / semesterCredits;
          sgpaSum += sgpa;
          semesterCount += 1;
        }
      }
    });

    const cgpa = sgpaSum / semesterCount;
    setNetCgpa(cgpa.toFixed(2));
  };

  return (
    <div className="App">
      <div>
        <h1>CGPA Calculator</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          {semesters.map((semester, semesterIndex) => (
            <div key={semesterIndex} className="semester">
              <h2>Semester {semesterIndex + 1}</h2>
              <button
                type="button"
                className="toggle-input"
                onClick={() => handleToggleInputMode(semesterIndex)}
              >
                {semester.inputCGPA ? 'Enter Grades' : 'Enter SGPA'}
              </button>
              {semester.inputCGPA ? (
                <div className="cgpa-input">
                  <input
                    type="number"
                    name="cgpa"
                    value={semester.cgpa}
                    placeholder="SGPA"
                    onChange={(event) => handleCgpaChange(semesterIndex, event)}
                    step="0.01"
                    required
                  />
                </div>
              ) : (
                <>
                  {semester.subjects.map((subject, subjectIndex) => (
                    <div key={subjectIndex} className="subject">
                      <select
                        name="grade"
                        value={subject.grade}
                        onChange={(event) => handleSubjectChange(semesterIndex, subjectIndex, event)}
                        required
                      >
                        <option value="">Select Grade</option>
                        {Object.keys(gradeMapping).map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        name="credits"
                        value={subject.credits}
                        placeholder="Credits"
                        onChange={(event) => handleSubjectChange(semesterIndex, subjectIndex, event)}
                        required
                      />
                      <button
                        type="button"
                        className="remove"
                        onClick={() => handleRemoveSubject(semesterIndex, subjectIndex)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add"
                    onClick={() => handleAddSubject(semesterIndex)}
                  >
                    Add Subject
                  </button>
                </>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add"
            onClick={handleAddSemester}
          >
            Add Semester
          </button>
          <button
            type="button"
            className="calculate"
            onClick={calculateNetCGPA}
          >
            Calculate CGPA
          </button>
        </form>
      </div>
      {netCgpa !== null && (
        <div className="result">
          <h2>Your CGPA is: <div className="x">{netCgpa}</div></h2>
        </div>
        
      )}
      
    </div>
  );
}

export default App;
