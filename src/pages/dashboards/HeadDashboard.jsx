import React, { useEffect, useState } from "react";
import { FaUpload, FaUser, FaUserPlus } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { useStudents } from "../../hooks/useStudents";
import Navbar from "../../components/Navbar";
import RankingTable from "../../components/Ranking";
import { TbUserShare } from "react-icons/tb";
import ViewProfile from "../../components/ViewProfile";
import axios from "axios";
import CodingProfileRequests from "../../components/ui/CodingProfileRequests";

function HeadDashboard() {
  const { currentUser } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  // Add filter states
  const [filterYear, setFilterYear] = useState("");
  const [filterSection, setFilterSection] = useState("");
  // Add search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch students when the component mounts or filters change
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/hod/students", {
          params: {
            dept: currentUser.dept,
            year: filterYear || "",
            section: filterSection || "",
          },
        });
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [filterYear, filterSection]);
  const [selectedTab, setSelectedTab] = useState("StudentRanking");

  // Filter students based on year, section, and search term
  const filteredStudents = students?.filter(
    (student) =>
      (filterYear === "" || student.year === filterYear) &&
      (filterSection === "" || student.section === filterSection) &&
      (student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      {/* Show ViewProfile only if a student is selected */}
      {selectedStudent && (
        <ViewProfile
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="px-40 space-y-4 mx-auto p-6">
          <h1 className="text-2xl font-semibold">HOD Dashboard</h1>

          {/* Faculty Info */}
          <div className="bg-blue-600 rounded-md p-6 text-white flex items-center w-full shadow-md">
            {/* Avatar Circle */}
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mr-4">
              <FaUser className="text-white text-2xl" />
            </div>

            {/* Text Info */}
            <div className="flex flex-col">
              <div className="text-xl font-semibold">{currentUser.name}</div>
              <div className="text-base">{currentUser.email}</div>
              <div className="mt-1">
                <span className="text-base bg-blue-400 font-semibold text-white px-2 py-1 rounded-full">
                  {currentUser.dept}
                </span>
              </div>
            </div>
          </div>
          {/* Section Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-gray-500 text-sm">Total Students</h2>
              <p className="text-2xl font-bold">{currentUser.total_students}</p>
              <p className="text-sm text-gray-400">380 active this month</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-gray-500 text-sm">Faculty Members</h2>
              <p className="text-2xl font-bold">{currentUser.total_faculty}</p>
              <p className="text-sm text-gray-400">Across all platforms</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-gray-500 text-sm">Sections</h2>
              <p className="text-2xl font-bold">{currentUser.total_sections}</p>
              <p className="text-sm text-gray-400">Department wide</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex justify-around rounded bg-gray-100 border-gray-200 border gap-4 p-1 mb-4 text-base">
            <button
              onClick={() => setSelectedTab("StudentRanking")}
              className={`flex-1/4 py-1 rounded ${
                selectedTab === "StudentRanking" ? "bg-white text-black" : ""
              }`}
            >
              Student Ranking
            </button>
            <button
              onClick={() => setSelectedTab("StudentManagment")}
              className={`flex-1/4 py-1 rounded ${
                selectedTab === "StudentManagment" ? "bg-white text-black" : ""
              }`}
            >
              Student Managment
            </button>
            <button
              onClick={() => setSelectedTab("FacultyManagment")}
              className={`flex-1/4 py-1 rounded ${
                selectedTab === "FacultyManagment" ? "bg-white text-black" : ""
              }`}
            >
              Faculty Managment
            </button>
            <button
              onClick={() => setSelectedTab("AddStudent")}
              className={`flex-1/4 py-1 rounded ${
                selectedTab === "AddStudent"
                  ? "bg-white text-black"
                  : "bg-gray-100"
              }`}
            >
              Add Student
            </button>
          </div>
          {/* StudentRanking*/}
          {selectedTab === "StudentRanking" && <RankingTable />}
          {/* Student Management */}
          {selectedTab === "StudentManagment" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Student Management</h2>
              <p className="text-gray-500 mb-4">
                Manage student records, update details, and more.
              </p>

              {/* Filters and Search */}
              <div className="flex gap-4 mb-4 items-end">
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <select
                    className="border rounded px-2 py-1"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Section
                  </label>
                  <select
                    className="border rounded px-2 py-1"
                    value={filterSection}
                    onChange={(e) => setFilterSection(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name or roll number"
                    className="border rounded px-2 py-1 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Add management features here */}
              <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow">
                <thead className="bg-gray-100 text-center">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4 text-left">Student</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Branch</th>
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4">Section</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                {/* {isLoading && <p>Loading...</p>}
                {error && <p>Error fetching data</p>} */}
                <tbody>
                  {filteredStudents?.length > 0 ? (
                    filteredStudents.map((student, i) => (
                      <tr
                        key={student.student_id}
                        className="hover:bg-gray-50 text-center"
                      >
                        <td className="py-3 px-4 ">{i + 1}</td>
                        <td className="py-3 px-4 text-left flex items-center gap-2">
                          <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center text-sm justify-center font-bold">
                            {student.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          {student.name}
                        </td>
                        <td className="py-3 px-4">{student.student_id}</td>
                        <td className="py-3 px-4">{student.dept}</td>
                        <td className="py-3 px-4">{student.year}</td>
                        <td className="py-3 px-4">{student.section}</td>

                        <td className="py-3 px-4 ">
                          <div
                            onClick={() => setSelectedStudent(student)}
                            className="text-gray-700 px-2 py-1 justify-center rounded  hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                          >
                            <TbUserShare /> Profile
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-3 px-4 text-center">
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {/* Faculty Management */}
          {selectedTab === "FacultyManagment" && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Faculty Overview */}
              <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-1">Faculty Overview</h2>
                <p className="text-gray-500 mb-4">
                  Current faculty and their assignments
                </p>
                {/* Example faculty list, replace with your data */}
                <div className="space-y-4">
                  {[
                    {
                      name: "Dr. Jane Smith",
                      sections: "A, B",
                      students: 60,
                      status: "Active",
                    },
                    {
                      name: "Prof. Mike Johnson",
                      sections: "C",
                      students: 30,
                      status: "Active",
                    },
                    {
                      name: "Dr. Sarah Wilson",
                      sections: "D",
                      students: 28,
                      status: "Active",
                    },
                  ].map((faculty, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border border-gray-200 rounded px-4 py-3 bg-gray-50"
                    >
                      <div>
                        <div className="font-semibold text-lg">
                          {faculty.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Sections: {faculty.sections} | {faculty.students}{" "}
                          students
                        </div>
                      </div>
                      <span className="px-2 text-xs rounded-2xl border border-gray-400 text-gray-700 bg-white font-semibold">
                        {faculty.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Add New Faculty */}
              <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-1">Add New Faculty</h2>
                <p className="text-gray-500 mb-4">
                  Add faculty member to the department
                </p>
                <form className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Faculty Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter faculty name"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter employee ID"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Specialization
                    </label>
                    <input
                      type="text"
                      placeholder="Enter specialization"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-4 flex justify-center items-center gap-2 bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition"
                  >
                    <FaUserPlus className="w-4 h-4" />
                    Add Faculty
                  </button>
                </form>
              </div>
            </div>
          )}
          {/* Add Student */}
          {selectedTab === "AddStudent" && (
            <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
              {/* Add Individual Student Form */}
              <div className="w-full lg:w-1/2 bg-white p-6 rounded shadow">
                <h2 className="text-xl px-4 font-bold text-gray-900 mb-1">
                  Add Individual Student
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Add a single student to your section
                </p>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter student name"
                      className="w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter roll number"
                      className="w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Branch *
                    </label>
                    <select className="w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Select branch</option>
                      <option>CSE</option>
                      <option>ECE</option>
                      <option>EEE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Year *
                    </label>
                    <select className="w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Select year</option>
                      <option>1st</option>
                      <option>2nd</option>
                      <option>3rd</option>
                      <option>4th</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Section *
                    </label>
                    <select className="w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Select section</option>
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 flex justify-center items-center gap-2 bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition"
                  >
                    <FaUserPlus className="w-4 h-4" />
                    Add Student
                  </button>
                </form>
              </div>

              {/* Bulk Import Students Form */}
              <div className="w-full lg:w-1/2 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Bulk Import Students
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Import multiple students from CSV file
                </p>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Branch *
                    </label>
                    <select className="w-full border-blue-50 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Select branch</option>
                      <option>CSE</option>
                      <option>ECE</option>
                      <option>EEE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Year *
                    </label>
                    <select className="w-full border-blue-50 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Select year</option>
                      <option>1st</option>
                      <option>2nd</option>
                      <option>3rd</option>
                      <option>4th</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Section *
                    </label>
                    <select className="w-full border-blue-50 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Select section</option>
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Choose CSV File *
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      className="w-full border-blue-50 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 flex justify-center items-center gap-2 bg-green-600 text-white font-medium py-2 rounded hover:bg-green-700 transition"
                  >
                    <FaUpload className="w-4 h-4" />
                    Import Students
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HeadDashboard;
