import React, { useEffect, useState } from "react";
import axios from "axios";
import { TbUserShare } from "react-icons/tb";
import ViewProfile from "./ViewProfile";

const RankBadge = ({ rank }) => {
  if (rank === 1)
    return (
      <span className="bg-yellow-400 text-white px-2 py-1 rounded-full">
        1st 🥇
      </span>
    );
  if (rank === 2)
    return (
      <span className="bg-gray-400 text-white px-2 py-1 rounded-full">
        2nd 🥈
      </span>
    );
  if (rank === 3)
    return (
      <span className="bg-orange-400 text-white px-2 py-1 rounded-full">
        3rd 🥉
      </span>
    );
  return <span>{rank}th</span>;
};

const TOP_X_OPTIONS = [
  { label: "All", value: "" },
  { label: "Top 5", value: 5 },
  { label: "Top 10", value: 10 },
  { label: "Top 50", value: 50 },
  { label: "Top 100", value: 100 },
];

const RankingTable = () => {
  const [ranks, setRanks] = useState([]);
  const [filters, setFilters] = useState({
    dept: "",
    year: "",
    section: "",
  });
  const [topX, setTopX] = useState("");
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  console.log(branches, sections, filters);
  const fetchRanks = async () => {
    try {
      let params = { ...filters };
      if (topX) params.limit = topX;

      let res;
      if (!filters.dept && !filters.year && !filters.section) {
        res = await axios.get("http://localhost:5000/ranking/overall", {
          params,
        });
        const uniqueBranches = [...new Set(res.data.map((s) => s.dept))];
        const uniqueSections = [...new Set(res.data.map((s) => s.section))];
        setBranches(uniqueBranches);
        setSections(uniqueSections);
      } else {
        res = await axios.get("http://localhost:5000/ranking/filter", {
          params,
        });
      }

      setRanks(res.data);
    } catch (err) {
      console.error(err);
      setRanks([]);
    }
  };

  useEffect(() => {
    fetchRanks();
    // eslint-disable-next-line
  }, [filters, topX]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredRanks = ranks.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.roll_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {selectedStudent && (
        <ViewProfile
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">🏆 Student Rankings</h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 ">
            <div>
              <label
                className="block text-xs font-semibold text-gray-500 mb-1"
                htmlFor="department"
              >
                Branch
              </label>
              <select
                id="department"
                onChange={(e) => handleChange("dept", e.target.value)}
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-2 rounded-lg transition outline-none"
                value={filters.dept}
              >
                <option value="">All Branches</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-xs font-semibold text-gray-500 mb-1"
                htmlFor="year"
              >
                Year
              </label>
              <select
                id="year"
                onChange={(e) => handleChange("year", e.target.value)}
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-2 rounded-lg transition outline-none"
                value={filters.year}
              >
                <option value="">All Years</option>
                <option value="1">1st</option>
                <option value="2">2nd</option>
                <option value="3">3rd</option>
                <option value="4">4th</option>
              </select>
            </div>
            <div>
              <label
                className="block text-xs font-semibold text-gray-500 mb-1"
                htmlFor="section"
              >
                Section
              </label>
              <select
                id="section"
                onChange={(e) => handleChange("section", e.target.value)}
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-2 rounded-lg transition outline-none"
                value={filters.section}
              >
                <option value="">All Sections</option>
                {sections.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-xs font-semibold text-gray-500 mb-1"
                htmlFor="topx"
              >
                Top X
              </label>
              <select
                id="topx"
                value={topX}
                onChange={(e) => setTopX(e.target.value)}
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-2 rounded-lg transition outline-none"
              >
                {TOP_X_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-2 rounded-lg transition outline-none"
            placeholder="Search by name or roll number"
          />
        </div>

        {/* Table */}
        <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4 text-left">Student</th>
              <th className="py-3 px-4">Roll Number</th>
              <th className="py-3 px-4">Branch</th>
              <th className="py-3 px-4">Year</th>
              <th className="py-3 px-4">Section</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRanks.map((s) => (
              <tr key={s.student_id} className="hover:bg-gray-50 text-center">
                <td className="py-3 px-4 ">
                  <RankBadge rank={s.rank} />
                </td>
                <td className="py-3 px-4 text-left flex items-center gap-2">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center text-sm justify-center font-bold">
                    {s.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  {s.name}
                </td>
                <td className="py-3 px-4">{s.student_id}</td>
                <td className="py-3 px-4">{s.dept}</td>
                <td className="py-3 px-4">{s.year}</td>
                <td className="py-3 px-4">{s.section}</td>
                <td className="py-3 px-4 font-semibold">{s.score}</td>
                <td className="py-3 px-4 ">
                  <div
                    onClick={() => setSelectedStudent(s)}
                    className="text-gray-700 px-2 py-1 justify-center rounded hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <TbUserShare /> Profile
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RankingTable;
