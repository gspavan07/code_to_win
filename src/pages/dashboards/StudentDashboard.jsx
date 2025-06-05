import React, { useState } from "react";
import { FiCheck, FiClock, FiCode, FiX } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";
import Navbar from "../../components/Navbar";
import StatsCard from "../../components/ui/StatsCard";
import PlatformCard from "../../components/ui/PlatformCard";
import UpdateProfile from "../../components/ui/updateprofile";
import Modals from "../../components/Modals";
const StudentDashboard = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [updateProfile, setUpdateProfile] = React.useState(false);
  const { currentUser } = useAuth();
  const formattedDate = dayjs(
    currentUser.performance.combined.last_updated
  ).format("DD/MM/YYYY | hh:mm A");
  const [activeModal, setActiveModal] = useState(null);

  const easyProblems =
    currentUser.performance.platformWise.leetcode.easy +
    currentUser.performance.platformWise.gfg.school +
    currentUser.performance.platformWise.gfg.basic +
    currentUser.performance.platformWise.gfg.easy;

  const mediumProblems =
    currentUser.performance.platformWise.leetcode.medium +
    currentUser.performance.platformWise.codechef.problems +
    currentUser.performance.platformWise.gfg.medium;

  const hardProblems =
    currentUser.performance.platformWise.leetcode.hard +
    currentUser.performance.platformWise.gfg.hard;

  return (
    <>
      <Navbar />

      <div className=" bg-gray-50 p-6 lg:px-10 xl:px-40">
        <div className="text-right text-sm text-gray-500 mb-2">
          Last Updated on {formattedDate}
        </div>
        {/* Cover Section */}
        <div className="w-full h-52 bg-gradient-to-r from-pink-200 via-orange-100 to-teal-100 rounded-t-xl relative overflow-hidden">
          <img
            src="/profile_bg.jpeg"
            alt="Background"
            className="w-full h-full object-cover opacity-70"
          />
        </div>

        {/* Profile Section */}
        <div className="p-4 flex md:flex-row flex-col gap-4">
          {/* Sidebar */}
          <div className="bg-white rounded-xl shadow-lg p-6  lg:w-md h-fit -mt-24 z-20">
            <div className="flex flex-r items-center mb-4">
              <img
                src="/profile_bg.jpeg"
                alt="sunil"
                className="object-cover w-24 h-24 rounded  mb-2"
              />
              <div className="ml-3">
                <h2 className="text-lg font-bold">{currentUser.name}</h2>
                <p className="text-sm text-gray-500  mt-2">University Rank</p>
                <p className="text-xl font-semibold text-gray-800">
                  {currentUser.rank}
                </p>
              </div>
            </div>
            <hr className="my-4" />
            <div className="text-justify space-y-4">
              <button
                onClick={() => setActiveModal("edit")}
                  className="text-blue-600 underline float-end "
              >
                Edit
              </button>
             
              <p className="font-semibold">Personal Information</p>

              <p className="flex justify-between">
                <span className="font-semibold text-left">Name:</span>{" "}
                {currentUser.name}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-left">Roll No:</span>{" "}
                {currentUser.student_id}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-left">Email:</span>{" "}
                {currentUser.email}
              </p>
            </div>
            <hr className="my-4" />
            <div className="text-justify space-y-4">
              <button
                onClick={() => setUpdateProfile(true)}
                className="text-blue-600 underline float-end "
              >
                Update Profiles
              </button>
              {updateProfile && (
                <UpdateProfile
                  student_id={currentUser.student_id}
                  profiles={currentUser.coding_profiles}
                  onClose={() => setUpdateProfile(null)}
                />
              )}

              <p className="font-semibold">Coding Profiles</p>

              <div className="flex flex-col gap-2">
                {currentUser.coding_profiles.map((profile) => (
                  <div key={profile.platform} className="flex justify-between">
                    <span className="font-semibold text-left">
                      {profile.platform}
                    </span>
                    <p className="text-gray-500">
                      {profile.profile_username}
                      {profile.verification_status === "accepted" && (
                        <FiCheck className="inline ml-1 text-green-500" />
                      )}
                      {profile.verification_status === "rejected" && (
                        <FiX className="inline ml-1 text-red-500" />
                      )}
                      {profile.verification_status === "pending" && (
                        <FiClock className="inline ml-1 text-gray-500" />
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Section */}
          <div className="w-full rounded-xl bg-white">
            <div className="flex flex-wrap gap-1 mb-4">
              <span className="px-4 py-2 bg-white rounded-xl shadow-sm">
                Campus:{" "}
                <span className="font-semibold">{currentUser.college}</span>
              </span>
              <span className="px-4 py-2 bg-white rounded-xl shadow-sm">
                Degree:{" "}
                <span className="font-semibold">{currentUser.degree}</span>
              </span>

              <span className="px-4 py-2 bg-white rounded-xl shadow-sm">
                Department:{" "}
                <span className="font-semibold">{currentUser.dept}</span>
              </span>
              <span className="px-4 py-2 bg-white rounded-xl shadow-sm">
                Year: <span className="font-semibold">{currentUser.year}</span>
              </span>
              <span className="px-4 py-2 bg-white rounded-xl shadow-sm">
                Section:{" "}
                <span className="font-semibold">{currentUser.section}</span>
              </span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 mb-4 xl:grid-cols-4 gap-3 p-2 border border-gray-200 rounded-lg">
              <StatsCard
                icon={<FiCode />}
                title="Total Problems"
                value={currentUser?.performance?.combined?.totalSolved || 0}
                color="blue"
              />
              <StatsCard
                icon={<FiCheck />}
                title="Easy Problems"
                value={easyProblems}
                color="success"
              />
              <StatsCard
                icon={<FiCode />}
                title="Medium Problems"
                value={mediumProblems}
                color="warning"
              />
              <StatsCard
                icon={<FiCode />}
                title="Hard Problems"
                value={hardProblems}
                color="error"
              />
            </div>

            {/* Platform-wise Stats */}
            <div className="grid grid-cols-2 gap-2 md:gap-6 md:p-4">
              <PlatformCard
                name="LeetCode"
                color="bg-yellow-400"
                total={
                  currentUser.performance.platformWise.leetcode.easy +
                  currentUser.performance.platformWise.leetcode.medium +
                  currentUser.performance.platformWise.leetcode.hard
                }
                breakdown={{
                  Easy: currentUser.performance.platformWise.leetcode.easy,
                  Medium: currentUser.performance.platformWise.leetcode.medium,
                  Hard: currentUser.performance.platformWise.leetcode.hard,
                }}
              />
              <PlatformCard
                name="CodeChef"
                color="bg-orange-600"
                total={currentUser.performance.platformWise.codechef.contests}
                subtitle="Contests Participated"
                breakdown={{
                  Easy: currentUser.performance.platformWise.codechef.problems,
                }}
              />
              <PlatformCard
                name="GeeksforGeeks"
                color="bg-green-600"
                total={
                  currentUser.performance.platformWise.gfg.school +
                  currentUser.performance.platformWise.gfg.basic +
                  currentUser.performance.platformWise.gfg.easy +
                  currentUser.performance.platformWise.gfg.medium +
                  currentUser.performance.platformWise.gfg.hard
                }
                breakdown={{
                  School: currentUser.performance.platformWise.gfg.school,
                  Basic: currentUser.performance.platformWise.gfg.basic,
                  Easy: currentUser.performance.platformWise.gfg.easy,
                  Medium: currentUser.performance.platformWise.gfg.medium,
                  Hard: currentUser.performance.platformWise.gfg.hard,
                }}
              />
              <PlatformCard
                name="HackerRank"
                color="bg-green-900"
                total={currentUser.performance.platformWise.hackerrank.badges}
                subtitle="Badges Gained"
              />
            </div>
          </div>
        </div>
        <Modals
        activeModal={activeModal}
        user={currentUser}
         onClose={() => setActiveModal(null)}
            />
      </div>
    </>
  );
};

export default StudentDashboard;
