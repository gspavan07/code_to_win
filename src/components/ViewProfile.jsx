import React, { useEffect, useState } from "react";
import PlatformCard from "./ui/PlatformCard";
import StatsCard from "./ui/StatsCard";
import { FiCheck, FiCode } from "react-icons/fi";
import axios from "axios";

const ViewProfile = ({ student, onClose }) => {
  // Use student data if available, fallback to defaults
  const [perf, setPerf] = useState({});
  //   console.log("ViewProfile component rendered with student:", student);
  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/student/performance/${student?.student_id}`
        );
        setPerf(res.data || {}); // Adjust according to your backend response
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setPerf({});
      }
    };
    console.log("Student Data:", student);
    if (student.student_id) {
      fetchPerformance();
    }
  }, [student.student_id]); // <-- Add dependency array here
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center h-screen bg-black/30"
    >
      <div
        className="bg-gray-50 rounded-xl space-y-4 p-6 w-full flex flex-col items-center max-w-3xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="rounded-xl p-4 flex flex-col items-start gap-6 justify-between bg-gradient-to-r from-orange-400 to-purple-500 text-white shadow-lg w-full">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            <div className="bg-white/30 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold">
              {student?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{student?.name}</h2>
              <span className="text-xs bg-white text-purple-600 px-2 py-0.5 rounded-full font-medium">
                {student?.roll_number}
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 w-full text-sm font-medium text-white/90 gap-y-3">
            <div>
              <div className="text-white/70">Campus</div>
              <div>{student?.college}</div>
            </div>
            <div>
              <div className="text-white/70">Section</div>
              <div>{student?.section}</div>
            </div>
            <div>
              <div className="text-white/70">Batch</div>
              <div>{student?.batch}</div>
            </div>
            <div>
              <div className="text-white/70">Department</div>
              <div>{student?.dept}</div>
            </div>
            <div>
              <div className="text-white/70">Degree</div>
              <div>{student?.degree}</div>
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
          <StatsCard
            icon={<FiCode />}
            title="Total Problems"
            value={perf?.combined?.totalSolved || 0}
            color="blue"
          />
          <StatsCard
            icon={<FiCheck />}
            title="Total Contests"
            value={perf?.combined?.totalContests || 0}
            color="success"
          />
          <StatsCard
            icon={<FiCode />}
            title="Grand Total"
            value={student.score}
            color="warning"
          />
        </div>

        {/* Platform-wise Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 md:p-4">
          <PlatformCard
            name="LeetCode"
            color="bg-yellow-400"
            total={
              (perf?.platformWise?.leetcode?.easy || 0) +
              (perf?.platformWise?.leetcode?.medium || 0) +
              (perf?.platformWise?.leetcode?.hard || 0)
            }
            breakdown={{
              Easy: perf?.platformWise?.leetcode?.easy || 0,
              Medium: perf?.platformWise?.leetcode?.medium || 0,
              Hard: perf?.platformWise?.leetcode?.hard || 0,
            }}
          />
          <PlatformCard
            name="CodeChef"
            color="bg-orange-600"
            total={5}
            subtitle="Contests Participated"
          />
          <PlatformCard
            name="GeeksforGeeks"
            color="bg-green-600"
            total={50}
            breakdown={{
              School: 5,
              Basic: 10,
              Easy: 15,
              Medium: 20,
              Hard: 25,
            }}
          />
          <PlatformCard
            name="HackerRank"
            color="bg-green-900"
            total={20}
            subtitle="Badges Gained"
          />
        </div>
        {/* X Close Button */}
        <button
          onClick={onClose}
          className="border border-gray-600 rounded-xl px-4 py-1 text-black hover:text-gray-800 text-base font-bold focus:outline-none"
          aria-label="Close"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewProfile;
