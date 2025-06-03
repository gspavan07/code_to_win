import React, { useState, useMemo } from "react";
import { BiDownload, BiSearch } from "react-icons/bi";
import { FaUserPlus, FaKey, FaUpload, FaCog } from "react-icons/fa";
import Modals from "../../components/Modals";
const platforms = ["Leetcode", "Codechef", "Geeksforgeeks", "Hackerrank"];

const initialConfig = {
  Leetcode: { Easy: 10, Medium: 25, Hard: 50 },
  Codechef: { Easy: 8, Medium: 20, Hard: 40 },
  Geeksforgeeks: { Easy: 6, Medium: 15, Hard: 30 },
  Hackerrank: { Easy: 7, Medium: 18, Hard: 35 },
};

function AdminDashboard() {
  const [activeModal, setActiveModal] = useState(null);
  const [tab, setTab] = useState("overall");
  const [selectedTab, setSelectedTab] = useState("StudentRanking");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);
  const [selectedSection, setSelectedSection] = useState("");
  const allStudents = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      branch: "CSE",
      year: "3",
      problems: [
        { difficulty: "Easy" },
        { difficulty: "Medium" },
        { difficulty: "Hard" },
        { difficulty: "Medium" },
      ],
      contestsParticipated: [1, 2],
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      branch: "ECE",
      year: "2",
      problems: [{ difficulty: "Easy" }, { difficulty: "Easy" }],
      contestsParticipated: [1],
    },
    {
      id: "3",
      name: "Clara Zhang",
      email: "clara@example.com",
      branch: "CSE",
      year: "1",
      problems: [
        { difficulty: "Hard" },
        { difficulty: "Hard" },
        { difficulty: "Medium" },
      ],
      contestsParticipated: [1, 2, 3],
    },
    {
      id: "4",
      name: "David Lee",
      email: "david@example.com",
      branch: "ME",
      year: "4",
      problems: [
        { difficulty: "Easy" },
        { difficulty: "Medium" },
        { difficulty: "Easy" },
      ],
      contestsParticipated: [],
    },
  ];

  const calculateScore = (student) => {
    const easy = student.problems.filter((p) => p.difficulty === "Easy").length;
    const medium = student.problems.filter(
      (p) => p.difficulty === "Medium"
    ).length;
    const hard = student.problems.filter((p) => p.difficulty === "Hard").length;
    const contests = student.contestsParticipated?.length || 0;
    return easy + medium * 2 + hard * 3 + contests * 5;
  };

  const studentsWithScores = useMemo(() => {
    return allStudents
      .map((s) => ({ ...s, score: calculateScore(s) }))
      .sort((a, b) => b.score - a.score);
  }, []);

  const filteredStudents = useMemo(() => {
    let result = studentsWithScores;

    if (tab === "branch" && selectedBranch) {
      result = result.filter((s) => s.branch === selectedBranch);
    }

    if (tab === "year" && selectedYear) {
      result = result.filter((s) => s.year === selectedYear);
    }

    if (searchTerm) {
      result = result.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result.slice(0, limit);
  }, [
    tab,
    selectedBranch,
    selectedYear,
    searchTerm,
    limit,
    studentsWithScores,
  ]);

  const getRankBadge = (rank) => {
    const badges = ["🥇", "🥈", "🥉"];
    return badges[rank] || `${rank + 1}`;
  };
  const [config, setConfig] = useState(initialConfig);

  const handleChange = (platform, level, value) => {
    setConfig((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [level]: parseInt(value) || 0,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved Configuration:", config);
    // TODO: Send to backend
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className=" max-w-7xl mx-auto p-6">
        {/* <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Administrator Dashboard</h1>
        <div className="flex items-center gap-4 ">
          <span className="text-sm">👤 Admin User <span className="text-gray-500">(admin)</span></span>
          <button variant="outline">Logout</button>
        </div>
      </header> */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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

        <div className="flex justify-around  flex-1/3 shadow-sm gap-4 mb-4 text-base">
          <button
            onClick={() => setSelectedTab("StudentRanking")}
            className={`px-16 py-1 rounded ${
              selectedTab === "StudentRanking"
                ? "bg-white text-black"
                : "bg-gray-100"
            }`}
          >
            Student Ranking
          </button>
          <button
            onClick={() => setSelectedTab("GradingSystem")}
            className={`px-16 py-1 rounded ${
              selectedTab === "GradingSystem"
                ? "bg-white text-black"
                : "bg-gray-100"
            }`}
          >
            Grading System
          </button>
          <button
            onClick={() => setSelectedTab("UserManagment")}
            className={`px-16 py-1 rounded ${
              selectedTab === "UserManagment"
                ? "bg-white text-black"
                : "bg-gray-100"
            }`}
          >
            User Managment
          </button>
        </div>
        {selectedTab === "StudentRanking" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Student Rankings</h2>
                <p className="text-sm text-gray-500">
                  Compare performance across branches and years
                </p>
              </div>
            </div>

            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">
                Student Ranking Dashboard
              </h1>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 rounded-lg">
                <div className="mb-4 md:mb-0 text-sm">
                  <button
                    onClick={() => setTab("overall")}
                    className={`px-4 py-2 rounded  mr-2 ${
                      tab === "overall"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Overall Ranking{" "}
                  </button>
                  <button
                    onClick={() => setTab("branch")}
                    className={`px-4 py-2 rounded mr-2 ${
                      tab === "branch"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Branch Ranking{" "}
                  </button>
                  <button
                    onClick={() => setTab("year")}
                    className={`px-4 py-2 rounded mr-2 ${
                      tab === "year" ? "bg-blue-600 text-white" : "bg-gray-100"
                    }`}
                  >
                    Year Ranking{" "}
                  </button>
                  <button
                    onClick={() => setTab("section")}
                    className={`px-4 py-2 rounded mr-2 ${
                      tab === "section"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Section Ranking{" "}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full p-2"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    disabled={
                      !filteredStudents || filteredStudents.length === 0
                    }
                    className="whitespace-nowrap flex bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <BiDownload className="h-4 w-4 mr-2 mt-1" />
                    Export Excel
                  </button>
                </div>
              </div>
              <select
                onChange={(e) => setLimit(Number(e.target.value))}
                value={limit}
                className="p-2 border rounded mr-5 mb-4 text-sm "
              >
                <option value={10}>Top 10</option>
                <option value={25}>Top 25</option>
                <option value={50}>Top 50</option>
              </select>

              {tab === "branch" && (
                <select
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  value={selectedBranch}
                  className="mb-4 p-2 border rounded"
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                </select>
              )}

              {tab === "year" && (
                <select
                  onChange={(e) => setSelectedYear(e.target.value)}
                  value={selectedYear}
                  className="mb-4 p-2 border rounded"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              )}
              {tab === "section" && (
                <select
                  onChange={(e) => setSelectedSection(e.target.value)}
                  value={selectedSection}
                  className="mb-4 p-2 border rounded"
                >
                  <option value="">Select Section</option>
                  <option value="A">A sec</option>
                  <option value="B">B sec</option>
                  <option value="C">C sec</option>
                  <option value="D  ">D sec</option>
                </select>
              )}
            </div>
            <table className="w-full rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-100 border-b-[0.5px] border-blue-200">
                  <th className=" p-2">Rank</th>
                  <th className=" p-2">Name</th>
                  <th className=" p-2">Email</th>
                  <th className=" p-2">Branch</th>
                  <th className=" p-2">Year</th>
                  <th className=" p-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className="text-center border-b-[0.5px] border-blue-200 border:opacity-50"
                  >
                    <td className=" p-2">{getRankBadge(index)}</td>
                    <td className=" p-2">{student.name}</td>
                    <td className=" p-2">{student.email}</td>
                    <td className=" p-2">{student.branch}</td>
                    <td className=" p-2">{student.year}</td>
                    <td className=" p-2">{student.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selectedTab === "GradingSystem" && (
          <div className="bg-white px-4 py-8">
            <h1 className="text-2xl font-bold text-center mb-6">
              Administrator Dashboard
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6  mx-auto">
              {platforms.map((platform) => (
                <div
                  key={platform}
                  className="bg-white rounded-lg border border-blue-100 p-4 space-y-4"
                >
                  <h2 className="text-lg font-semibold text-gray-800">
                    {platform}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Easy", "Medium", "Hard"].map((level) => (
                      <div key={level}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {level} Problems
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={config[platform][level]}
                          onChange={(e) =>
                            handleChange(platform, level, e.target.value)
                          }
                          className="w-full border border-gray-100 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Points per problem
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition w-full"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        )}
        {selectedTab === "UserManagment" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto">
            {/* User Management */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-1">User Management</h2>
              <p className="text-sm text-gray-500 mb-4">
                Manage faculty, HODs, and student accounts
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveModal("addFaculty")}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  <FaUserPlus /> Add Faculty
                </button>
                <button
                  onClick={() => setActiveModal("addHOD")}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                >
                  <FaUserPlus /> Add HOD
                </button>
                <button
                  onClick={() => setActiveModal("resetPassword")}
                  className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded"
                >
                  <FaKey /> Reset Password
                </button>
                <button
                  onClick={() => setActiveModal("bulkImport")}
                  className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                >
                  <FaUpload /> Bulk Import
                </button>
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-1">System Settings</h2>
              <p className="text-sm text-gray-500 mb-4">
                Configure system-wide preferences
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span>Auto-approve profiles</span>
                  <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                    Disabled
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Email notifications</span>
                  <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                    Enabled
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data backup</span>
                  <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                    Daily
                  </span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded hover:bg-gray-900">
                <FaCog /> Advanced Settings
              </button>
            </div>

            {/* Modals */}
            <Modals
              activeModal={activeModal}
              onClose={() => setActiveModal(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminDashboard;
