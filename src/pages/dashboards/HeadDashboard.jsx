import React, { useState } from "react";
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

  // Add filter states
  const [filterYear, setFilterYear] = useState("");
  const [filterSection, setFilterSection] = useState("");

  const {
    data: students,
    isLoading,
    error,
  } = useStudents({
    dept: currentUser.dept,
    year: currentUser.year,
    section: currentUser.section,
  });
  const [selectedTab, setSelectedTab] = useState("StudentRanking");

  // Filter students based on year and section
  const filteredStudents = students?.filter(
    (student) =>
      (filterYear === "" || student.year === filterYear) &&
      (filterSection === "" || student.section === filterSection)
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
          <h1 className="text-2xl font-semibold">Faculty Dashboard</h1>

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
                  {currentUser.dept} - {currentUser.year} -{" "}
                  {currentUser.section}
                </span>
              </div>
            </div>
          </div>
          {/* Section Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-gray-500 text-sm">Total Students</h2>
              <p className="text-2xl font-bold">450</p>
              <p className="text-sm text-gray-400">380 active this month</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-gray-500 text-sm">Problems Solved</h2>
              <p className="text-2xl font-bold">12,500</p>
              <p className="text-sm text-gray-400">Across all platforms</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-gray-500 text-sm">Average Accuracy</h2>
              <p className="text-2xl font-bold">78%</p>
              <p className="text-sm text-gray-400">Department wide</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-gray-500 text-sm">Top Performer</h2>
              <p className="text-lg font-semibold">B Satya Ganesh</p>
              <p className="text-sm text-gray-400">Score: 2340</p>
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
              onClick={() => setSelectedTab("StudentRequests")}
              className={`flex-1/4 py-1 rounded ${
                selectedTab === "StudentRequests" ? "bg-white text-black" : ""
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

              {/* Filters */}
              <div className="flex gap-4 mb-4">
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
                {isLoading && <p>Loading...</p>}
                {error && <p>Error fetching data</p>}
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
          {/* Student Requests */}
          {selectedTab === "StudentRequests" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Student Requests</h2>
              <p className="text-gray-500 mb-4">
                Review and manage student coding profile requests.
              </p>

              <CodingProfileRequests
                dept={currentUser.dept}
                year={currentUser.year}
                section={currentUser.section}
                facultyId={currentUser.faculty_id}
              />
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
