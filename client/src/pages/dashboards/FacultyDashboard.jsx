import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { FaUser } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import axios from "axios";
import LoadingSpinner from "../../common/LoadingSpinner";
import { AddIndividualStudentModel } from "../../components/Modals";

// Lazy-loaded components
const RankingTable = lazy(() => import("../../components/Ranking"));
const ViewProfile = lazy(() => import("../../components/ViewProfile"));
const CodingProfileRequests = lazy(() =>
  import("../../components/ui/CodingProfileRequests")
);
const StudentTable = lazy(() => import("../../components/ui/StudentTable"));
const BulkImportStudent = lazy(() =>
  import("../../components/ui/BulkImportStudent")
);

function FacultyDashboard() {
  const { currentUser } = useAuth();
  const [addStudentMenu, setAddStudentMenu] = useState("individual");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("StudentRanking");

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/faculty/students`, {
        params: {
          dept: currentUser?.dept_code,
          year: currentUser?.year,
          section: currentUser?.section,
        },
      });
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.dept_code, currentUser?.year, currentUser?.section]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const memoizedStudents = useMemo(() => students, [students]);

  const FacultyInfoCard = () => (
    <div className="bg-blue-600 rounded-md p-4 md:p-6 text-white flex flex-col md:flex-row items-center justify-between w-full shadow-md gap-4">
      <div className="flex items-center flex-col md:flex-row">
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-2 md:mb-0 md:mr-4">
          <FaUser className="text-white text-2xl" />
        </div>
        <div className="flex flex-col items-center md:items-start">
          <div className="text-xl font-semibold">{currentUser?.name}</div>
          <div className="text-base">{currentUser?.email}</div>
          <div className="mt-1">
            <span className="text-base bg-blue-500 font-semibold text-white px-2 py-1 rounded-full">
              {currentUser?.dept_name} - {currentUser?.year} -{" "}
              {currentUser?.section}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-blue-500 p-4 rounded-lg shadow">
        <h2 className="text-gray-200 text-sm">Total Students</h2>
        <p className="text-2xl font-bold text-center text-white">
          {currentUser?.total_students || 0}
        </p>
      </div>
    </div>
  );

  const DashboardTabs = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 justify-around rounded bg-gray-100 border-gray-200 border gap-2 md:gap-4 p-1 mb-4 text-base">
      {[
        "StudentRanking",
        "StudentManagment",
        "StudentRequests",
        "AddStudent",
      ].map((tab) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          className={`flex-1 min-w-[120px] py-1 rounded ${
            selectedTab === tab ? "bg-white text-black" : ""
          }`}
        >
          {tab.replace(/([A-Z])/g, " $1").trim()}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {selectedStudent && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center h-screen bg-black/30">
              <LoadingSpinner />
            </div>
          }
        >
          <ViewProfile
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        </Suspense>
      )}

      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 space-y-4 p-2 md:p-6">
          <h1 className="text-2xl font-semibold">Faculty Dashboard</h1>

          <FacultyInfoCard />
          <DashboardTabs />

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {selectedTab === "StudentRanking" && (
                <Suspense fallback={<LoadingSpinner />}>
                  <RankingTable filter={true} />
                </Suspense>
              )}

              {selectedTab === "StudentManagment" && (
                <div className="bg-white p-2 md:p-6 rounded-lg shadow overflow-x-auto">
                  <h2 className="text-xl font-semibold mb-4">
                    Student Management
                  </h2>
                  <p className="text-gray-500 mb-4">
                    Manage student records, update details, and more.
                  </p>
                  <Suspense
                    fallback={
                      <>
                        <LoadingSpinner />
                        <p className="text-center">Loading Student Table...</p>
                      </>
                    }
                  >
                    <StudentTable
                      students={memoizedStudents}
                      showBranch={true}
                      showYear={false}
                      showSection={true}
                      onProfileClick={setSelectedStudent}
                    />
                  </Suspense>
                </div>
              )}

              {selectedTab === "StudentRequests" && (
                <div className="bg-white p-2 md:p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">
                    Student Requests
                  </h2>
                  <p className="text-gray-500 mb-4">
                    Review and manage student coding profile requests.
                  </p>
                  <Suspense
                    fallback={
                      <>
                        <LoadingSpinner />
                        <p className="text-center">
                          Loading Student Requests...
                        </p>
                      </>
                    }
                  >
                    <CodingProfileRequests
                      dept={currentUser?.dept_code}
                      year={currentUser?.year}
                      section={currentUser?.section}
                      facultyId={currentUser?.faculty_id}
                    />
                  </Suspense>
                </div>
              )}

              {selectedTab === "AddStudent" && (
                <div className="flex flex-col lg:flex-row gap-6 p-0 md:p-6 bg-gray-50">
                  {/* Sidebar Menu */}
                  <div className="w-full lg:w-1/4 bg-white p-4 md:p-6 rounded shadow mb-4 lg:mb-0">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      Add Students Menu
                    </h2>
                    <ul className="space-y-2">
                      <li>
                        <button
                          className={`w-full text-left px-3 py-2 rounded ${
                            addStudentMenu === "individual"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                          onClick={() => setAddStudentMenu("individual")}
                        >
                          Add Individual Student
                        </button>
                      </li>
                      <li>
                        <button
                          className={`w-full text-left px-3 py-2 rounded ${
                            addStudentMenu === "bulk"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                          onClick={() => setAddStudentMenu("bulk")}
                        >
                          Bulk Import Students
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Dynamic Content Area */}
                  <div className="w-full lg:w-3/4">
                    {addStudentMenu === "individual" && (
                      <Suspense fallback={<LoadingSpinner />}>
                        <AddIndividualStudentModel onSuccess={fetchStudents} />
                      </Suspense>
                    )}
                    {addStudentMenu === "bulk" && (
                      <div className="bg-white p-4 md:p-6 h-fit rounded shadow">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                          Bulk Import Students
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                          Import multiple students from CSV file
                        </p>
                        <Suspense fallback={<LoadingSpinner />}>
                          <BulkImportStudent onSuccess={fetchStudents} />
                        </Suspense>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default FacultyDashboard;
