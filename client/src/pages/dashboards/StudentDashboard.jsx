import React, { useState } from "react";
import { FiCheck, FiClock, FiCode, FiX } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";
import Navbar from "../../components/Navbar";
import StatsCard from "../../components/ui/StatsCard";
import PlatformCard from "../../components/ui/PlatformCard";
import {
  EditModal,
  UpdateProfileModal,
  UserResetPasswordModal,
} from "../../components/Modals";
import Footer from "../../components/Footer";
const StudentDashboard = () => {
  const [editProfile, setEditprofile] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [changepassword, setChangepassword] = useState(false);
  const { currentUser } = useAuth();
  const formattedDate = dayjs(
    currentUser.performance.combined.last_updated
  ).format("DD/MM/YYYY | hh:mm A");
  console.log(currentUser);
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
      {editProfile && (
        <EditModal user={currentUser} onClose={() => setEditprofile(false)} />
      )}
      {updateProfile && (
        <UpdateProfileModal
          user={currentUser}
          onClose={() => setUpdateProfile(false)}
        />
      )}
      {changepassword && (
        <UserResetPasswordModal
          user={currentUser}
          onClose={() => setChangepassword(false)}
        />
      )}
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
              <div className="bg-blue-100 text-blue-800 rounded-lg w-24 h-24 flex  items-center text-4xl justify-center font-bold">
                {currentUser.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              {/* <img
                src="/profile_bg.jpeg"
                alt="sunil"
                className="object-cover w-24 h-24 rounded  mb-2"
              /> */}
              <div className="ml-3">
                <h2 className="text-lg font-bold">{currentUser.name}</h2>
                <div className="flex gap-10">
                  <div>
                    <p className="text-sm text-gray-500  mt-2">University Rank</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {currentUser.overall_rank}
                    </p>
                  </div>
                  <div className="bg-green-200 rounded-full w-18 h-18 flex flex-col items-center p-2">
                    <p className="text-sm text-gray-500  mt-2">Score</p>

                    <p className="text-lg text-gray-900">
                      {currentUser.score}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-4" />
            <div className="text-justify space-y-4">
              <button
                onClick={() => setEditprofile(true)}
                className="text-blue-600 underline float-end cursor-pointer"
              >
                Edit
              </button>

              <p className="font-semibold">Personal Information</p>

              <p className="flex  justify-between">
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
              <button
                onClick={() => setChangepassword(true)}
                className="text-blue-600 underline text-sm float-right cursor-pointer mb-2"
              >
                changepassword
              </button>
            </div>
            <hr className="my-4 w-full" />
            <div className="text-justify space-y-4">
              <button
                onClick={() => setUpdateProfile(true)}
                className="text-blue-600 underline float-end cursor-pointer"
              >
                Update Profiles
              </button>

              <p className="font-semibold">Coding Profiles</p>

              <div className="flex flex-col gap-2">
                {["leetcode", "codechef", "geekforgeeks", "hackerrank"].map(
                  (platform) => {
                    const idKey = `${platform}_id`;
                    const statusKey = `${platform}_status`;
                    const username =
                      currentUser.coding_profiles?.[idKey] || "Not Provided";
                    const status = currentUser.coding_profiles?.[statusKey];
                    return (
                      <div key={platform} className="flex justify-between">
                        <span className="font-semibold text-left••••••••••••••">
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </span>
                        <p className="text-gray-500">
                          {username}
                          {status === "accepted" && (
                            <FiCheck className="inline ml-1 text-green-500" />
                          )}
                          {status === "rejected" && (
                            <FiX className="inline ml-1 text-red-500" />
                          )}
                          {status === "pending" && (
                            <FiClock className="inline ml-1 text-gray-500" />
                          )}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Main Section */}
          <div className="w-full rounded-xl">
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
                <span className="font-semibold">{currentUser.dept_name}</span>
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
            <div className="grid grid-cols-2 mb-4 xl:grid-cols-4 gap-3 md:border-0 border border-gray-200 p-4 rounded-xl ">
              <StatsCard
                icon={<FiCode />}
                title="Total Problems"
                value={currentUser?.performance?.combined?.totalSolved || 0}
                color="blue"
              />
              <StatsCard
                icon={<FiCode />}
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
            <div className="grid grid-cols-2 gap-2 md:gap-6 ">
              <PlatformCard
                name="LeetCode"
                color=" hover:text-yellow-600 hover:shadow-yellow-600"
                icon="/LeetCode_logo.png"
                total={
                  currentUser.performance.platformWise.leetcode.easy +
                  currentUser.performance.platformWise.leetcode.medium +
                  currentUser.performance.platformWise.leetcode.hard
                }
                breakdown={{
                  Easy: currentUser.performance.platformWise.leetcode.easy,
                  Medium: currentUser.performance.platformWise.leetcode.medium,
                  Hard: currentUser.performance.platformWise.leetcode.hard,
                  contests: currentUser.performance.platformWise.leetcode.contests,
                  Badges: currentUser.performance.platformWise.leetcode.badges,
                }}
              />
              <PlatformCard
                name="CodeChef"
                color=" hover:text-orange-900 hover:shadow-orange-900"
                icon="/codechef_logo.png"
                total={currentUser.performance.platformWise.codechef.contests}
                subtitle="Contests Participated"
                breakdown={{
                  "Problems Solved": currentUser.performance.platformWise.codechef.problems,
                  Star: currentUser.performance.platformWise.codechef.stars,
                  Badges: currentUser.performance.platformWise.codechef.badges,
                }}
              />
              <PlatformCard
                name="GeeksforGeeks"
                color=" hover:text-green-600 hover:shadow-green-600"
                icon="/GeeksForGeeks_logo.png"
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
                color=" hover:text-gray-900 hover:shadow-gray-900"
                icon="/HackerRank_logo.png"
                total={currentUser.performance.platformWise.hackerrank.badges}
                subtitle="Badges Gained"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentDashboard;
