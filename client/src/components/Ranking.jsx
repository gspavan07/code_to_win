import React, { useEffect, useState, lazy, Suspense } from "react";
import { TbUserShare } from "react-icons/tb";
const ViewProfile = lazy(() => import("./ViewProfile"));
import { FaSearch } from "react-icons/fa";
import { useDepts } from "../context/MetaContext";
import LoadingSpinner from "../common/LoadingSpinner";
import { FaDownload } from "react-icons/fa6";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const RankBadge = ({ rank }) => {
  if (rank === 1)
    return <span className=" text-white px-2 py-1 rounded-full">🥇</span>;
  if (rank === 2)
    return <span className=" text-white px-2 py-1 rounded-full">🥈</span>;
  if (rank === 3)
    return <span className=" text-white px-2 py-1 rounded-full">🥉</span>;
  return <span>{rank}th</span>;
};

const TOP_X_OPTIONS = [
  { label: "All", value: "" },
  { label: "Top 5", value: 5 },
  { label: "Top 10", value: 10 },
  { label: "Top 50", value: 50 },
  { label: "Top 100", value: 100 },
];

const RankingTable = ({ filter }) => {
  const [ranks, setRanks] = useState([]);
  const [filters, setFilters] = useState({
    dept: "",
    year: "",
    section: "",
  });
  const [topX, setTopX] = useState("");
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [years, setYears] = useState([]);
  const { depts, loading } = useDepts();
  const [sections, setSections] = useState([]);

  const fetchRanks = async () => {
    try {
      let params = { ...filters };
      if (topX) params.limit = topX;

      // Build query string
      const queryString = Object.entries(params)
        .filter(([_, v]) => v !== "" && v !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");

      let url;
      if (!filters.dept && !filters.year && !filters.section) {
        url = `/api/ranking/overall${queryString ? "?" + queryString : ""}`;
      } else {
        url = `/api/ranking/filter${queryString ? "?" + queryString : ""}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch rankings");
      const data = await res.json();

      const uniqueYears = [...new Set(data.map((s) => s.year))].sort(
        (a, b) => a - b
      );
      setYears(uniqueYears);
      const uniqueSections = [...new Set(data.map((s) => s.section))];
      setSections(uniqueSections);
      setRanks(data);
    } catch (err) {
      console.error(err);
      setRanks([]);
    }
  };
  useEffect(() => {
    fetchRanks();
  }, [JSON.stringify(filters), topX]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredRanks = ranks.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.student_id?.toLowerCase().includes(search.toLowerCase())
  );

  const downloadSampleXLSX = () => {
    // 1. Simulate a large dataset
    const largeData = [];
    largeData.push([
      "Student Id",
      "Student Name",
      "Branch",
      "year",
      "Section",
      "Lt_easy",
      "Lt_med",
      "Lt_hard",
      "Lt_Contest",
      "Lt_badges",
      "GFG_school",
      "GFG_basic",
      "GFG_easy",
      "GFG_med",
      "GFG_hard",
      "GFG_Contests",
      "CC_problems",
      "CC_Contests",
      "CC_stars",
      "CC_badges",
      "HR_badges",
      "Score",
    ]);

    ranks.forEach((rank) => {
      largeData.push([
        rank.student_id,
        rank.name,
        rank.dept_name,
        rank.year,
        rank.section,
        rank?.performance?.platformWise?.leetcode?.easy,
        rank?.performance?.platformWise?.leetcode?.medium,
        rank?.performance?.platformWise?.leetcode?.hard,
        rank?.performance?.platformWise?.leetcode?.contests,
        rank?.performance?.platformWise?.leetcode?.badges,
        rank?.performance?.platformWise?.gfg?.school,
        rank?.performance?.platformWise?.gfg?.basic,
        rank?.performance?.platformWise?.gfg?.easy,
        rank?.performance?.platformWise?.gfg?.medium,
        rank?.performance?.platformWise?.gfg?.hard,
        rank?.performance?.platformWise?.gfg?.contests,
        rank?.performance?.platformWise?.codechef?.problems,
        rank?.performance?.platformWise?.codechef?.contests,
        rank?.performance?.platformWise?.codechef?.stars,
        rank?.performance?.platformWise?.codechef?.badges,
        rank?.performance?.platformWise?.hackerrank?.badges,
        rank.score,
      ]);
    });

    const now = new Date();
    const formattedDate = dayjs(now).format("DD/MM/YYYY | hh:mm A");
    const deptName =
      depts.find((d) => d.dept_code === filters.dept)?.dept_name ||
      filters.dept;
    const filenamePrefix =
      `${deptName || ""}${filters?.year ? " " + filters.year + "_year" : ""}${
        filters?.section ? " " + filters.section + "_sec" : ""
      }`.trim() || "overall";
    // 2. Convert array of arrays to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(largeData);

    // 3. Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty");

    // 4. Write workbook to binary array buffer
    const arrayBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // 5. Convert to Blob and trigger download
    const blob = new Blob([arrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filenamePrefix} ${formattedDate}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        {selectedStudent && (
          <ViewProfile
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </Suspense>
      <div className="lg:p-6">
        <div className="flex flex-row justify-between ">
          <h1 className="md:text-2xl text-xl font-semibold mb-4 px-6">
            🏆 Student Rankings
          </h1>
        </div>
        {/* Filters */}
        {filter && (
          <>
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
                    {depts.map((dept) => (
                      <option key={dept.dept_code} value={dept.dept_code}>
                        {dept.dept_name}
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
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
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
                    Top
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
              </div>
              <div className="relative max-w-xs flex  gap-x-5 mr-15 py-3">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 opacity-85 text-blue-800" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg hover:bg-blue-50  focus:ring-1   transition outline-none "
                />
                <button
                  className="px-2 items-center rounded-lg bg-blue-600 flex gap-2 text-white "
                  onClick={downloadSampleXLSX}
                >
                  <FaDownload /> Download
                </button>
              </div>
            </div>
          </>
        )}

        {/* Table */}
        <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow text-sm md:text-base">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="py-3 lg:px-4 px-2">Rank</th>
              <th className="py-3 lg:px-4 px-2 text-left">Student</th>
              <th className="py-3 lg:px-4 px-2">Roll Number</th>
              <th className="py-3 lg:px-4 px-2 sr-only md:not-sr-only">
                Branch
              </th>
              <th className="py-3 lg:px-4 px-2  sr-only md:not-sr-only">
                Year
              </th>
              <th className="py-3 lg:px-4 px-2  sr-only md:not-sr-only">
                Section
              </th>
              <th className="py-3 lg:px-4 px-2">Score</th>
              <th className="py-3 lg:px-4 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRanks.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">
                  No students in ranking
                </td>
              </tr>
            ) : (
              filteredRanks.map((s) => (
                <tr key={s.student_id} className="hover:bg-gray-50 text-center">
                  <td className="py-3 px-2 md:px-4 ">
                    <RankBadge rank={s.rank} />
                  </td>
                  <td className="py-3 px-4 text-left flex items-center gap-2">
                    <div className=" hidden bg-blue-100 text-blue-800 rounded-full w-8 h-8 md:flex items-center text-sm justify-center font-bold">
                      {s.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    {s.name}
                  </td>
                  <td className="py-3 px-4">{s.student_id}</td>
                  <td className="py-3 md:px-4 px-2 sr-only md:not-sr-only">
                    {s.dept_name}
                  </td>
                  <td className="py-3 md:px-4 px-2 sr-only md:not-sr-only">
                    {s.year}
                  </td>
                  <td className="py-3 md:px-4 px-2 sr-only md:not-sr-only">
                    {s.section}
                  </td>
                  <td className="py-3 md:px-4 px-2 font-semibold">{s.score}</td>
                  <td className="py-3 md:px-4 px-2 ">
                    <div
                      onClick={() => setSelectedStudent(s)}
                      className="text-gray-700 px-2 py-1 justify-center rounded hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <TbUserShare /> Profile
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RankingTable;
