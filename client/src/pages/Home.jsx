import React, { useEffect, useState } from "react";
import Login from "./Login";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiUrl } from "../utils/api";

const RankBadge = ({ rank }) => {
  if (rank === 1)
    return <span className="text-white px-2 py-1 rounded-full">🥇</span>;
  if (rank === 2)
    return <span className="text-white px-2 py-1 rounded-full">🥈</span>;
  if (rank === 3)
    return <span className="text-white px-2 py-1 rounded-full">🥉</span>;
  return <span>{rank}th</span>;
};

function Home() {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRanks = async () => {
    try {
      setLoading(true);
      const limit = 10;
      const url = apiUrl(`/api/ranking/overall?limit=${limit}&page=1`);

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
      // API returns array directly
      setRanks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching ranks:", err);
      setRanks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanks();
  }, []);
  return (
    <div className="overflow-hidden">
      <img src="/home_bg.svg" alt="" className="absolute -z-10 top-0 w-full" />
      <Navbar />
      
      {/* Hero Section - Top Center */}
      <section className="relative px-5 lg:px-10 mt-12 mb-8" data-aos="fade-down">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="text-3xl lg:text-4xl xl:text-6xl font-bold tracking-wide mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Track Your Coding <br /> Journey with Precision
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mb-8">
            CodeTrack helps you monitor your progress, set goals, and compete
            with peers to become a better programmer every day.
          </p>
          <Link to="/checkscore">
            <button className="bg-blue-600 py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl text-white transition-all transform hover:scale-105">
              Check Your Score
            </button>
          </Link>
        </div>
      </section>

      {/* Login and Leaderboard Section - Side by Side */}
      <div className="relative flex flex-col lg:flex-row px-5 lg:px-10 xl:px-20 gap-8 justify-center items-start mb-20">
        {/* Left Side: Login */}
        <div className="w-full lg:w-auto lg:flex-shrink-0" data-aos="fade-right">
          <Login />
        </div>

        {/* Right Side: Leaderboard */}
        <section
          className="flex-1 lg:max-w-3xl w-full z-20"
          data-aos="fade-left"
        >
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 py-4 px-6 flex items-center gap-4 rounded-t-2xl border-b-2 border-yellow-300">
            <img src="/trophy.png" alt="Trophy" className="w-10 h-10" />
            <p className="font-bold text-lg lg:text-xl text-gray-800">🏆 Top Coders - University Leaderboard</p>
          </div>
          <div className="bg-white rounded-b-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-center border-b-2 border-gray-200">
                  <tr>
                    <th className="py-4 px-3 font-semibold text-gray-700">Rank</th>
                    <th className="py-4 px-3 text-left font-semibold text-gray-700">Student</th>
                    <th className="py-4 px-3 font-semibold text-gray-700 hidden md:table-cell">Roll No</th>
                    <th className="py-4 px-3 font-semibold text-gray-700 hidden lg:table-cell">Branch</th>
                    <th className="py-4 px-3 font-semibold text-gray-700">Year</th>
                    <th className="py-4 px-3 font-semibold text-gray-700">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : ranks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-gray-500">
                        No ranking data available
                      </td>
                    </tr>
                  ) : (
                    ranks.map((s) => (
                      <tr key={s.student_id} className="hover:bg-blue-50 text-center transition-colors">
                        <td className="py-4 px-3 font-medium">
                          <RankBadge rank={s.rank} />
                        </td>
                        <td className="py-4 px-3 text-left">
                          <div className="flex items-center gap-3">
                            <div className="hidden sm:flex bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full w-9 h-9 items-center justify-center text-xs font-bold shadow-md">
                              {s.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <span className="font-medium text-gray-800">{s.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-gray-600 hidden md:table-cell">{s.student_id}</td>
                        <td className="py-4 px-3 text-gray-600 hidden lg:table-cell">{s.dept_name}</td>
                        <td className="py-4 px-3 text-gray-700 font-medium">{s.year}</td>
                        <td className="py-4 px-3">
                          <span className="inline-block bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-sm">
                            {s.score}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
export default Home;
