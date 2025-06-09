import React, { useEffect, useState, lazy, Suspense } from "react";
import { FaUpload, FaUser, FaUserPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import axios from "axios";
import LoadingSpinner from "../../common/LoadingSpinner";

// Lazy-loaded components
const RankingTable = lazy(() => import("../../components/Ranking"));
const ViewProfile = lazy(() => import("../../components/ViewProfile"));
const StudentTable = lazy(() => import("../../components/ui/StudentTable"));

function HeadDashboard() {
  const { currentUser } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [filterYear, setFilterYear] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("StudentRanking");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/hod/students", {
          params: {
            dept: currentUser.dept_code,
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
  }, [filterYear, filterSection, currentUser.dept_code]);

  const filteredStudents = students?.filter(
    (student) =>
      (filterYear === "" || student.year === filterYear) &&
      (filterSection === "" || student.section === filterSection) &&
      (student.name?.toLowerCase().includes(search.toLowerCase()) ||
        student.student_id?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {selectedStudent && (
        <Suspense
          fallback={
            <div className=" fixed inset-0 z-50 flex items-center justify-center h-screen bg-black/30">
              <LoadingSpinner />
            </div>
          }
        >
          <ViewProfile
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        </Suspense>
      )}

      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 space-y-4 p-2 md:p-6">
          <h1 className="text-2xl font-semibold">HOD Dashboard</h1>

          {/* Faculty Info */}
          <div className="bg-blue-600 rounded-md p-4 md:p-6 text-white flex flex-col md:flex-row items-center w-full shadow-md gap-4">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-2 md:mb-0 md:mr-4">
              <FaUser className="text-white text-2xl" />
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="text-xl font-semibold">{currentUser.name}</div>
              <div className="text-base">{currentUser.email}</div>
              <div className="mt-1">
                <span className="text-base bg-blue-400 font-semibold text-white px-2 py-1 rounded-full">
                  {currentUser.dept_name}
                </span>
              </div>
            </div>
          </div>

          {/* Section Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-2 md:grid-cols-4 justify-around rounded bg-gray-100 border-gray-200 border gap-2 md:gap-4 p-1 mb-4 text-base">
            <button
              onClick={() => setSelectedTab("StudentRanking")}
              className={`flex-1 min-w-[120px] py-1 rounded ${
                selectedTab === "StudentRanking" ? "bg-white text-black" : ""
              }`}
            >
              Student Ranking
            </button>
            <button
              onClick={() => setSelectedTab("StudentManagment")}
              className={`flex-1 min-w-[120px] py-1 rounded ${
                selectedTab === "StudentManagment" ? "bg-white text-black" : ""
              }`}
            >
              Student Management
            </button>
            <button
              onClick={() => setSelectedTab("FacultyManagment")}
              className={`flex-1 min-w-[120px] py-1 rounded ${
                selectedTab === "FacultyManagment" ? "bg-white text-black" : ""
              }`}
            >
              Faculty Management
            </button>
            <button
              onClick={() => setSelectedTab("AddStudent")}
              className={`flex-1 min-w-[120px] py-1 rounded ${
                selectedTab === "AddStudent" ? "bg-white text-black" : ""
              }`}
            >
              Add Student
            </button>
          </div>

          {/* Content Sections with Suspense */}

          {selectedTab === "StudentRanking" && (
            <Suspense fallback={<LoadingSpinner />}>
              <RankingTable filter={true} />
            </Suspense>
          )}

          {selectedTab === "StudentManagment" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Student Management</h2>
              <p className="text-gray-500 mb-4">
                Manage student records, update details, and more.
              </p>

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
                <div className="relative max-w-xs mt-5">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 opacity-85 text-blue-800" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg hover:bg-blue-50 focus:ring-1 focus:border-blue-100 transition focus:outline-none"
                  />
                </div>
              </div>

              <StudentTable
                students={filteredStudents}
                showBranch={true}
                showYear={true}
                showSection={true}
                rankLabel="Rank"
                onProfileClick={setSelectedStudent}
              />
            </div>
          )}

          {selectedTab === "FacultyManagment" && (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-1">Faculty Overview</h2>
                <p className="text-gray-500 mb-4">
                  Current faculty and their assignments
                </p>
                <div className="space-y-4">
                  {[
                    {
                      name: "Dr. Jane Smith",
                      sections: "A",
                      students: 60,
                      status: "Active",
                    },
                    {
                      name: "Prof. Mike Johnson",
                      sections: "B",
                      students: 30,
                      status: "Active",
                    },
                    {
                      name: "Dr. Sarah Wilson",
                      sections: "C",
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
                      <span className="px-2 text-xs rounded-2xl border border-green-600 text-green-600 bg-white font-semibold">
                        {faculty.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
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

          {selectedTab === "AddStudent" && (
            <div className="flex flex-col lg:flex-row gap-6 p-0 md:p-6 bg-gray-50 min-h-screen">
              <div className="w-full lg:w-1/2 bg-white p-4 md:p-6 rounded shadow">
                <h2 className="text-xl px-4 font-bold text-gray-900 mb-1">
                  Add Individual Student
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Add a single student to your section
                </p>
                <form className="space-y-4">
                  {/* Form fields remain the same */}
                  <button
                    type="submit"
                    className="w-full mt-4 flex justify-center items-center gap-2 bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition"
                  >
                    <FaUserPlus className="w-4 h-4" />
                    Add Student
                  </button>
                </form>
              </div>
              <div className="w-full lg:w-1/2 bg-white p-4 md:p-6 rounded shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Bulk Import Students
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Import multiple students from CSV file
                </p>
                <form className="space-y-4">
                  {/* Form fields remain the same */}
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
