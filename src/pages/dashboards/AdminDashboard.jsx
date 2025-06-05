import React, { useState, useMemo, useEffect } from "react";
import { BiDownload, BiSearch } from "react-icons/bi";
import { FaUserPlus, FaKey, FaUpload, FaCog } from "react-icons/fa";
import Modals from "../../components/Modals";
import ViewProfile from "../../components/ViewProfile";
import { FaUser } from "react-icons/fa6";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import RankingTable from "../../components/Ranking";

const metricToPlatform = {
  badges_hr: "HackerRank",
  contests_cc: "CodeChef",
  easy_gfg: "GeeksforGeeks",
  medium_gfg: "GeeksforGeeks",
  hard_gfg: "GeeksforGeeks",
  school_gfg: "GeeksforGeeks",
  easy_lc: "LeetCode",
  medium_lc: "LeetCode",
  hard_lc: "LeetCode",
  problems_cc: "CodeChef",
  stars_cc: "CodeChef",
  basic_gfg: "GeeksforGeeks",
};

// const platformOrder = ["LeetCode", "GeeksforGeeks", "CodeChef", "HackerRank"];

function AdminDashboard() {
  const { currentUser } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTab, setSelectedTab] = useState("StudentRanking");
  const [grading, setGrading] = useState([]);
  const [platformOrder, setPlatform] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changedMetrics, setChangedMetrics] = useState(new Set());

  // Helper to make metric names readable
  const metricLabels = {
    badges_hr: "HackerRank Badges",
    contests_cc: "CodeChef Contests",
    problems_cc: "CodeChef Problems",
    stars_cc: "CodeChef Stars",
    school_gfg: "GeeksforGeeks School",
    basic_gfg: "GeeksforGeeks Basic",
    easy_gfg: "GeeksforGeeks Easy",
    hard_gfg: "GeeksforGeeks Hard",
    medium_gfg: "GeeksforGeeks Medium",
    easy_lc: "LeetCode Easy",
    hard_lc: "LeetCode Hard",
    medium_lc: "LeetCode Medium",
  };
  useEffect(() => {
    const fetchGrading = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:5000/meta/platforms-and-grading"
        );
        const data = await res.json();
        setPlatform(data.platforms || []);
        setGrading(data.grading || []);
      } catch (err) {
        alert("Failed to load grading config");
        setGrading([]);
      }
      setLoading(false);
    };
    fetchGrading();
  }, []);

  const handleGradingChange = (idx, value) => {
    setGrading((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, points: parseInt(value) || 0 } : item
      )
    );
    setChangedMetrics((prev) => {
      const updated = new Set(prev);
      updated.add(grading[idx].metric);
      return updated;
    });
  };

  const handleGradingSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only update changed metrics
      const updates = grading.filter((item) => changedMetrics.has(item.metric));
      await Promise.all(
        updates.map((item) =>
          fetch(`http://localhost:5000/meta/grading/${item.metric}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ points: item.points }),
          })
        )
      );
      alert("Grading configuration saved!");
      setChangedMetrics(new Set()); // Clear changed set after save
    } catch (err) {
      alert("Failed to save configuration.");
      console.error(err);
    }
  };

  // Group grading metrics by platform
  const gradingByPlatform = useMemo(() => {
    const grouped = {};
    grading.forEach((item) => {
      const platform = metricToPlatform[item.metric] || "Other";
      if (!grouped[platform]) grouped[platform] = [];
      grouped[platform].push(item);
    });
    return grouped;
  }, [grading]);

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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 space-y-4 p-2 md:p-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          {/* Admin Info */}
          <div className="bg-blue-600 rounded-md p-4 md:p-6 text-white flex flex-col md:flex-row items-center w-full shadow-md gap-4">
            {/* Avatar Circle */}
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-2 md:mb-0 md:mr-4">
              <FaUser className="text-white text-2xl" />
            </div>

            {/* Text Info */}
            <div className="flex flex-col items-center md:items-start">
              <div className="text-xl font-semibold">{currentUser.name}</div>
              <div className="text-base">{currentUser.email}</div>
            </div>
          </div>
          {/* Section Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-gray-500 text-sm">Total Students</h2>
              <p className="text-2xl font-bold">{currentUser.total_students}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-gray-500 text-sm">Total HOD's</h2>
              <p className="text-2xl font-bold">{currentUser.total_hod}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-gray-500 text-sm">Total Faculty</h2>
              <p className="text-2xl font-bold">{currentUser.total_faculty}</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-3 justify-around rounded bg-gray-100 border-gray-200 border gap-2 md:gap-4 p-1 mb-4 text-base">
            <button
              onClick={() => setSelectedTab("StudentRanking")}
              className={`flex-1 min-w-[120px] py-1 rounded cursor-pointer ${
                selectedTab === "StudentRanking" ? "bg-white text-black" : ""
              }`}
            >
              Student Ranking
            </button>
            <button
              onClick={() => setSelectedTab("GradingSystem")}
              className={`flex-1 min-w-[120px] py-1 rounded cursor-pointer ${
                selectedTab === "GradingSystem" ? "bg-white text-black" : ""
              }`}
            >
              Grading System
            </button>
            <button
              onClick={() => setSelectedTab("UserManagment")}
              className={`flex-1 min-w-[120px] py-1 rounded cursor-pointer ${
                selectedTab === "UserManagment" ? "bg-white text-black" : ""
              }`}
            >
              User Managment
            </button>
          </div>
          {/* Student Ranking */}
          {selectedTab === "StudentRanking" && <RankingTable />}
          {/* Grading System */}
          {selectedTab === "GradingSystem" && (
            <div className="bg-white px-4 py-8">
              <h1 className="text-2xl font-bold text-center mb-6">
                Grading Configuration
              </h1>
              {loading ? (
                <div className="text-center py-8">
                  Loading grading config...
                </div>
              ) : (
                <form
                  onSubmit={handleGradingSubmit}
                  className="space-y-8 mx-auto"
                >
                  {platformOrder.map(
                    (platform) =>
                      gradingByPlatform[platform.name] && (
                        <div key={platform.platform_id} className="mb-6 ">
                          <h2 className="text-xl font-semibold mb-4 text-blue-700">
                            {platform.name}
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {gradingByPlatform[platform.name].map(
                              (item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between py-2"
                                >
                                  <span className="font-medium">
                                    {metricLabels[item.metric] || item.metric}
                                  </span>
                                  <input
                                    type="number"
                                    min={0}
                                    value={item.points}
                                    onChange={(e) =>
                                      handleGradingChange(
                                        grading.findIndex(
                                          (g) => g.metric === item.metric
                                        ),
                                        e.target.value
                                      )
                                    }
                                    className="w-24 border border-gray-200 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )
                  )}
                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition w-full"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
          {/* User Management */}
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
    </>
  );
}
export default AdminDashboard;
