import axios from "axios";
import { useEffect, useState } from "react";

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
      <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow">
        <thead>
          <tr>
            <th>Student</th>
            <th>Roll Number</th>
            <th>Requests</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped).map(([student_id, reqs]) => (
            <tr key={student_id}>
              <td>{reqs[0].name}</td>
              <td>{student_id}</td>
              <td>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => setSelectedStudent({ student_id, reqs })}
                >
                  View Requests
                </button>
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
        <h2 className="text-xl font-semibold mb-2">
          Requests for {student.reqs[0].name} ({student.student_id})
        </h2>
        <table className="min-w-full mb-4">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Username</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {student.reqs.map((req) => (
              <tr key={req.platform_id}>
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
                <td>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleAction(req.platform_id, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
