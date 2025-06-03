import React, { useState } from "react";

const facultyList = ["Dr. Smith", "Dr. Johnson", "Dr. Brown"];

const HeadDashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [assignmentId, setAssignmentId] = useState(1);

  const handleAssignFaculty = () => {
    if (selectedCourse && selectedFaculty) {
      setAssignments([
        ...assignments,
        {
          id: assignmentId,
          course: selectedCourse,
          faculty: selectedFaculty,
        },
      ]);
      setAssignmentId(assignmentId + 1);
      setSelectedCourse("");
      setSelectedFaculty("");
    }
  };

  const handleFacultyAssignmentChange = (index, faculty) => {
    const updatedAssignments = [...assignments];
    updatedAssignments[index].faculty = faculty;
    setAssignments(updatedAssignments);
  };

  const handleRemoveAssignment = (id) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">HOD Dashboard</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Assign Faculty to Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Enter course name"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border rounded p-2"
          />
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Select Faculty</option>
            {facultyList.map((faculty, index) => (
              <option key={index} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssignFaculty}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Assign
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Current Assignments</h2>
        {assignments.length === 0 ? (
          <p className="text-gray-500">No assignments yet.</p>
        ) : (
          <ul className="space-y-4">
            {assignments.map((assignment, index) => (
              <li
                key={assignment.id}
                className="border rounded p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">Course: {assignment.course}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <label className="text-sm text-gray-600">Faculty:</label>
                    <select
                      value={assignment.faculty}
                      onChange={(e) =>
                        handleFacultyAssignmentChange(index, e.target.value)
                      }
                      className="border rounded p-1"
                    >
                      {facultyList.map((faculty, i) => (
                        <option key={i} value={faculty}>
                          {faculty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveAssignment(assignment.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HeadDashboard;
