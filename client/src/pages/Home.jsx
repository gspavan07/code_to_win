import React, { useEffect, useState } from "react";
import Login from "./Login";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const RankBadge = ({ rank }) => {
  if (rank === 1)
    return <span className=" text-white px-2 py-1 rounded-full">🥇</span>;
  if (rank === 2)
    return <span className=" text-white px-2 py-1 rounded-full">🥈</span>;
  if (rank === 3)
    return <span className=" text-white px-2 py-1 rounded-full">🥉</span>;
  return <span>{rank}th</span>;
};

function Home() {
  const [ranks, setRanks] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fetchRanks = async () => {
    try {
      const limit = 10;
      const url = `/api/ranking/overall?limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ranks");
      }

      const data = await response.json();
      setRanks(data);
    } catch (err) {
      console.error("Error fetching ranks:", err);
      setRanks([]);
    }
  };

  useEffect(() => {
    fetchRanks();
  }, []);
  return (
    <div className="">
      <img src="/home_bg.svg" alt="" className="absolute -z-10 top-0 w-full" />
      <nav className="py-5">
        <div className=" mx-auto px-4 sm:px-6 lg:px-10 xl:px-40">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/">
              <div className="flex flex-row items-center gap-3">
                <img src="/logo.svg" alt="" />
                <h1 className="text-lg font-bold text-gray-800">CodeTracker</h1>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/">Home</Link>
              <Link to="/stdDash">Check Your Strength</Link>
              <Link to="/dev">Developers</Link>
              <Link to="/contact">Contact</Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="text-2xl text-gray-700 focus:outline-none"
              >
                {mobileMenuOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden flex flex-col gap-2 py-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/stdDash" onClick={() => setMobileMenuOpen(false)}>
                Check Your Strength
              </Link>
              <Link to="/dev" onClick={() => setMobileMenuOpen(false)}>
                Developers
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </div>
          )}
        </div>
      </nav>
      <div className="relative flex flex-col lg:flex-row px-5 lgS:px-10 xl:px-40 justify-between items-center">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left ">
          <div className="flex flex-col">
            <h1 className="text-2xl lg:text-3xl xl:text-6xl font-bold tracking-wide mb-4">
              Track Your Coding <br /> Journey with Precision
            </h1>
            <p className="text-gray-600 max-w-xl mb-6">
              CodeTrack helps you monitor your progress, set goals, and compete
              with peers to become a better programmer every day.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 py-2 px-4 rounded-lg text-base hover:bg-transparent border border-blue-600 text-white hover:text-blue-600">
              Check Your Score
            </button>
          </div>
        </div>
        <div className="my-8">
          <Login />
        </div>
      </div>
      <section className="relative w-[95%] xl:w-3/4 mx-auto  mb-20 z-20">
        <img
          src="/owl.png"
          alt=""
          className="absolute h-28 right-0 -top-20 w-auto"
        />
        <div className="bg-yellow-50 py-5 px-5 flex items-center gap-5 rounded-t-2xl border-b-2 border-b-gray-200 text-center">
          <img src="/trophy.png" alt="" />
          <p className="font-bold text-base">Top Coders This Month</p>
        </div>
        <table className="min-w-full px-10 bg-white border-b border-t-2 border-t-gray-800 rounded-b-2xl overflow-hidden shadow-2xl text-sm md:text-base">
          <thead className=" text-center">
            <tr>
              <th className="py-5 lg:px-4 px-2">Rank</th>
              <th className="py-3 lg:px-4 px-2 text-left">Student Name</th>
              <th className="py-3 lg:px-4 px-2">Roll Number</th>
              <th className="py-3 lg:px-4 px-2 sr-only md:not-sr-only">
                Branch
              </th>
              <th className="py-3 lg:px-4 px-2 ">Year</th>

              <th className="py-3 lg:px-4 px-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {ranks.map((s) => (
              <tr key={s.student_id} className="hover:bg-gray-50 text-center">
                <td className="py-5 px-2 md:px-4 ">
                  <RankBadge rank={s.rank} />
                </td>
                <td className="py-3 md:px-4 px-2 text-left flex items-center gap-2">
                  <div className=" hidden bg-blue-100 text-blue-800 rounded-full w-8 h-8 md:flex items-center text-sm justify-center font-bold">
                    {s.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  {s.name}
                </td>
                <td className="py-3 px-4">{s.student_id}</td>
                <td className="py-3 md:px-4 px-2 sr-only md:not-sr-only">
                  {s.dept_name}
                </td>
                <td className="py-3 md:px-4 px-2">{s.year}</td>
                <td className="py-3 md:px-4 px-2 font-semibold">{s.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <Footer />
    </div>
  );
}
export default Home;
