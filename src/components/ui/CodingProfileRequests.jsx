import axios from "axios";
import { useEffect, useState } from "react";
import { TbUserShare } from "react-icons/tb";
import StudentTable from "./StudentTable";

function CodingProfileRequests({ dept, year, section, facultyId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await axios.get(
      "http://localhost:5000/faculty/coding-profile-requests",
      { params: { dept, year, section } }
    );
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [dept, year, section]);

  // Group requests by student_id
  const grouped = requests.reduce((acc, req) => {
    if (!acc[req.student_id]) acc[req.student_id] = [];
    acc[req.student_id].push(req);
    return acc;
  }, {});

  if (loading) return <p>Loading...</p>;
  if (!requests.length) return <p>No pending requests.</p>;

  return (
    <>
      <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow text-sm">
        <thead className="bg-gray-100 text-center">
          <tr>
            <th className="py-3 px-2 md:px-4">S. NO</th>
            <th className="py-3 px-4 text-left">Student</th>
            <th className="py-3 px-4">Roll Number</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped).map(([student_id, reqs], index) => (
            <tr key={student_id} className="hover:bg-gray-50 text-center">
              <td className="py-3 md:px-4">{index + 1}</td>
              <td className="py-3 px-4 text-left flex items-center gap-2">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 hidden md:flex items-center text-sm justify-center font-bold">
                  {reqs[0].name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                {reqs[0].name}
              </td>
              <td className="py-3 px-4">{student_id}</td>
              <td className="py-3 px-4 ">
                <div
                  onClick={() => setSelectedStudent({ student_id, reqs })}
                  className="text-gray-700 px-2 py-1 justify-center rounded  hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <TbUserShare /> View
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for viewing requests */}
      {selectedStudent && (
        <StudentRequestsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onAction={async (platformIdHandled) => {
            // Fetch latest requests and use the result directly
            const { data: latestRequests } = await axios.get(
              "http://localhost:5000/faculty/coding-profile-requests",
              { params: { dept, year, section } }
            );
            setRequests(latestRequests);

            // Group the latest requests
            const groupedLatest = latestRequests.reduce((acc, req) => {
              if (!acc[req.student_id]) acc[req.student_id] = [];
              acc[req.student_id].push(req);
              return acc;
            }, {});

            const updated = groupedLatest[selectedStudent.student_id];

            // If no more pending requests for this student, close modal
            if (!updated || updated.length === 0) {
              setSelectedStudent(null);
            } else {
              // Otherwise, update the modal with the new requests for this student
              setSelectedStudent({
                student_id: selectedStudent.student_id,
                reqs: updated,
              });
            }
          }}
          facultyId={facultyId}
        />
      )}
    </>
  );
}

// Modal component
function StudentRequestsModal({ student, onClose, onAction, facultyId }) {
  const handleAction = async (platform_id, action) => {
    await axios.post("http://localhost:5000/faculty/verify-coding-profile", {
      student_id: student.student_id,
      platform_id,
      action,
      faculty_id: facultyId,
    });
    await onAction(platform_id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>
        <h2 className="text-md mb-2 ">
          Requests for {student.reqs[0].name} ({student.student_id})
        </h2>
        <table className="min-w-full mb-4 text-md text-left">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Username</th>
              <th>Link</th>
              <th className="flex justify-around">Actions</th>
            </tr>
          </thead>
          <tbody>
            {student.reqs.map((req) => (
              <tr key={req.platform_id} className="text-sm p-4">
                <td>{req.platform_name}</td>
                <td>{req.profile_username}</td>
                <td>
                  {/* You can customize the link format per platform */}
                  <a
                    href={getProfileLink(
                      req.platform_name,
                      req.profile_username
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
                <td className="flex justify-center gap-2 mb-2 mt-1">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2 text-xs hover:bg-green-600"
                    onClick={() => handleAction(req.platform_id, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                    onClick={() => handleAction(req.platform_id, "reject")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Helper to generate profile links (customize as needed)
function getProfileLink(platform, username) {
  switch (platform.toLowerCase()) {
    case "leetcode":
      return `https://leetcode.com/${username}`;
    case "geeksforgeeks":
      return `https://auth.geeksforgeeks.org/user/${username}/`;
    case "codechef":
      return `https://www.codechef.com/users/${username}`;
    case "hackerrank":
      return `https://www.hackerrank.com/${username}`;
    default:
      return "#";
  }
}
export default CodingProfileRequests;
