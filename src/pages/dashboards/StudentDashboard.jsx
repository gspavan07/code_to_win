import React from "react";
import { FiCheck, FiCode } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";
import EditProfile from "../../components/EditProfile";
import Navbar from "../../components/Navbar";
import StatsCard from "../../components/ui/StatsCard";
import PlatformCard from "../../components/ui/PlatformCard";
const StudentDashboard = () => {
  const [showModal, setShowModal] = React.useState(false);
  const { currentUser } = useAuth();
  const perf = currentUser.performance;
  const formattedDate = dayjs(perf.last_updated).format("DD/MM/YYYY | hh:mm A");
  const totalProblems =
    perf.easy_lc +
    perf.medium_lc +
    perf.hard_lc +
    perf.problems_cf +
    perf.school_gfg +
    perf.basic_gfg +
    perf.easy_gfg +
    perf.medium_gfg +
    perf.hard_gfg;

  const easyProblems =
    perf.easy_lc + perf.school_gfg + perf.basic_gfg + perf.easy_gfg;

  const mediumProblems = perf.medium_lc + perf.problems_cf + perf.medium_gfg;

  const hardProblems = perf.hard_lc + perf.hard_gfg;

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
          <div className="bg-white rounded-xl shadow-lg p-6 text-center lg:w-lg h-fit -mt-24 z-20">
            <img
              src="/profile_bg.jpeg"
              alt="sunil"
              className="object-cover w-32 h-32 rounded-full mx-auto mb-2"
            />
            <h2 className="text-lg font-bold">{currentUser.name}</h2>
            <p className="text-sm text-gray-500 mb-2">University Rank</p>
            <p className="text-2xl font-semibold text-gray-800">
              {currentUser.overall_rank}
            </p>
            <hr className="my-4" />
            <div className="text-justify space-y-4">
              <button
                onClick={() => setShowModal(true)}
                className="text-blue-600 underline float-end "
              >
                Edit
              </button>
              <EditProfile
                isOpen={showModal}
                user={currentUser}
                option={"edit"}
                onClose={() => setShowModal(false)}
              />
              <p className="font-semibold">Personal Information</p>

              <p className="flex justify-between">
                <span className="font-semibold text-left">Name:</span>{" "}
                {currentUser.name}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-left">Roll No:</span>{" "}
                {currentUser.roll_number}
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-left">Email:</span>{" "}
                {currentUser.email}
              </p>
            </div>
            <hr className="my-4" />
            <div className="text-justify space-y-4">
              <button
                onClick={() => setShowModal(true)}
                className="text-blue-600 underline float-end "
              >
                Update Profiles
              </button>
              <EditProfile
                isOpen={showModal}
                user={currentUser}
                option={"update_profiles"}
                onClose={() => setShowModal(false)}
              />
              <p className="font-semibold">Coding Profiles</p>

              <div className="flex flex-col gap-2">
                {currentUser.coding_profiles.map((profile) => (
                  <p key={profile.platform} className="flex justify-between">
                    <span className="font-semibold text-left">
                      {profile.platform}
                      <FiCheck className="inline ml-1 text-green-500" />
                    </span>{" "}
                    <p className="text-gray-500">{profile.profile_username}</p>
                  </p>
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
                Batch:{" "}
                <span className="font-semibold">{currentUser.batch}</span>
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
            <div className="grid grid-cols-2 mb-4 xl:grid-cols-4 gap-3">
              <StatsCard
                icon={<FiCode />}
                title="Total Problems"
                value={totalProblems}
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
                total={perf.easy_lc + perf.medium_lc + perf.hard_lc}
                breakdown={{
                  Easy: perf.easy_lc,
                  Medium: perf.medium_lc,
                  Hard: perf.hard_lc,
                }}
              />
              <PlatformCard
                name="CodeChef"
                color="bg-orange-600"
                total={perf.contests_cf}
                subtitle="Contests Participated"
              />
              <PlatformCard
                name="GeeksforGeeks"
                color="bg-green-600"
                total={
                  perf.school_gfg +
                  perf.basic_gfg +
                  perf.easy_gfg +
                  perf.medium_gfg +
                  perf.hard_gfg
                }
                breakdown={{
                  School: perf.school_gfg,
                  Basic: perf.basic_gfg,
                  Easy: perf.easy_gfg,
                  Medium: perf.medium_gfg,
                  Hard: perf.hard_gfg,
                }}
              />
              <PlatformCard
                name="HackerRank"
                color="bg-green-900"
                total={perf.badges_hr}
                subtitle="Badges Gained"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
