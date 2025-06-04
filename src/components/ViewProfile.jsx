import React, { useEffect, useState } from "react";
import PlatformCard from "./ui/PlatformCard";
import StatsCard from "./ui/StatsCard";
import { FiCheck, FiCode } from "react-icons/fi";
import axios from "axios";

const ViewProfile = ({ student, onClose }) => {
  // Use student data if available, fallback to defaults
  const [stdDetails, setStdDetails] = useState({});
  const [perf, setPerf] = useState({});
  console.log("setStdDetails:", stdDetails);
  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/student/profile`, {
          params: {
            userId: student.student_id,
          },
        });
        setStdDetails(res.data || {}); // Adjust according to your backend response
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setStdDetails({});
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
                {student?.student_id}
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
              <div className="text-white/70">Year</div>
              <div>{student?.year}</div>
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
            value={stdDetails?.performance?.combined?.totalSolved || 0}
            color="blue"
          />
          <StatsCard
            icon={<FiCheck />}
            title="Total Contests"
            value={stdDetails?.performance?.combined?.totalContests || 0}
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
        <div className="grid grid-cols-2 gap-2 md:gap-6 md:p-4">
          <PlatformCard
            name="LeetCode"
            color="bg-yellow-400"
            total={
              stdDetails?.performance?.platformWise?.leetcode?.easy +
              stdDetails?.performance?.platformWise?.leetcode?.medium +
              stdDetails?.performance?.platformWise?.leetcode?.hard
            }
            breakdown={{
              Easy: stdDetails?.performance?.platformWise?.leetcode?.easy,
              Medium: stdDetails?.performance?.platformWise?.leetcode?.medium,
              Hard: stdDetails?.performance?.platformWise?.leetcode?.hard,
            }}
          />
          <PlatformCard
            name="CodeChef"
            color="bg-orange-600"
            total={stdDetails?.performance?.platformWise?.codechef?.contests}
            subtitle="Contests Participated"
            breakdown={{
              Easy: stdDetails?.performance?.platformWise?.codechef?.problems,
            }}
          />
          <PlatformCard
            name="GeeksforGeeks"
            color="bg-green-600"
            total={
              stdDetails?.performance?.platformWise?.gfg?.school +
              stdDetails?.performance?.platformWise?.gfg?.basic +
              stdDetails?.performance?.platformWise?.gfg?.easy +
              stdDetails?.performance?.platformWise?.gfg?.medium +
              stdDetails?.performance?.platformWise?.gfg?.hard
            }
            breakdown={{
              School: stdDetails?.performance?.platformWise?.gfg?.school,
              Basic: stdDetails?.performance?.platformWise?.gfg?.basic,
              Easy: stdDetails?.performance?.platformWise?.gfg?.easy,
              Medium: stdDetails?.performance?.platformWise?.gfg?.medium,
              Hard: stdDetails?.performance?.platformWise?.gfg?.hard,
            }}
          />
          <PlatformCard
            name="HackerRank"
            color="bg-green-900"
            total={stdDetails?.performance?.platformWise?.hackerrank?.badges}
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
