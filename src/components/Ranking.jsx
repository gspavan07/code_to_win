import React, { useEffect, useState } from "react";
import axios from "axios";
import { TbUserShare } from "react-icons/tb";
import ViewProfile from "./ViewProfile";
import { FaSearch, FaSearchMinus } from "react-icons/fa";

const RankBadge = ({ rank }) => {
  if (rank === 1)
    return (
      <span className="bg-yellow-400 text-white px-2 py-1 rounded-full">
        🥇
      </span>
    );
  if (rank === 2)
    return (
      <span className="bg-gray-400 text-white px-2 py-1 rounded-full">
        🥈
      </span>
    );
  if (rank === 3)
    return (
      <span className="bg-orange-400 text-white px-2 py-1 rounded-full">
        🥉
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
        <h1 className="md:text-2xl text-xl font-semibold mb-4">🏆 Student Rankings</h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-between gap-2 mb-6">
          <div className="grid grid-cols-3 md:grid-cols-4  items-center gap-4 text-sm ">
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
                className="border border-gray-300  hover:bg-blue-50 p-2 rounded-lg transition outline-none"
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
                className="border border-gray-300 hover:bg-blue-50 p-2 rounded-lg transition outline-none"
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
                className="border border-gray-300 hover:bg-blue-50 p-2 rounded-lg transition outline-none"
                value={filters.section}
              >
                <option value="">All Sections</option>
                {sections.map((s) => (
                  <option key={s} value={s} >
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
                className="border border-gray-300 hover:bg-blue-50 p-2 rounded-lg transition outline-none"
              >
                {TOP_X_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative max-w-xs block md:hidden mt-5">
  <FaSearch className="absolute left-3 md:top-1/3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 opacity-85 text-blue-800" />
  <input
    type="text"
    placeholder="Search students..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg hover:bg-blue-50  focus:ring-1 focus:border-blue-100 transition focus:outline-none"
  />
</div>
          </div>
          <div className="relative max-w-xs hidden md:block">
  <FaSearch className="absolute left-3 md:top-1/3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 opacity-85 text-blue-800" />
  <input
    type="text"
    placeholder="Search students..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg hover:bg-blue-50  focus:ring-1 focus:border-blue-100 transition focus:outline-none"
  />
</div>

        </div>

        {/* Table */}
        <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow text-sm md:text-base">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4 text-left">Student</th>
              <th className="py-3 px-4">Roll Number</th>
              <th className="py-3 px-4 sr-only md:not-sr-only">Branch</th>
              <th className="py-3 px-4  sr-only md:not-sr-only">Year</th>
              <th className="py-3 px-4  sr-only md:not-sr-only">Section</th>
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
                  <div className=" hidden bg-blue-100 text-blue-800 rounded-full w-8 h-8 md:flex items-center text-sm justify-center font-bold">
                    {s.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  {s.name}
                </td>
                <td className="py-3 px-4">{s.student_id}</td>
                <td className="py-3 px-4 sr-only md:not-sr-only">{s.dept}</td>
                <td className="py-3 px-4 sr-only md:not-sr-only">{s.year}</td>
                <td className="py-3 px-4 sr-only md:not-sr-only">{s.section}</td>
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
