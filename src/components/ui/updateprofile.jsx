import React, { useState } from "react";
import axios from "axios";

const optionList = [
  { label: "Leetcode", key: "leetcode" },
  { label: "CodeChef", key: "codechef" },
  { label: "GeeksforGeeks", key: "geekforgeeks" },
  { label: "HackerRank", key: "hackerrank" },
];

// Map optionList key to platform_id as per your backend
const platformIdMap = {
  leetcode: 1,
  codechef: 2,
  geekforgeeks: 3,
  hackerrank: 4,
};

const UpdateProfile = ({ student_id, profiles = [], onClose }) => {
  // Map profiles to an object for easy access (case-insensitive)
  const initialUsernames = optionList.reduce((acc, opt) => {
    const found = profiles.find(
      (p) => p.platform?.toLowerCase() === opt.label.toLowerCase()
    );
    acc[opt.key] = found ? found.profile_username : "";
    return acc;
  }, {});

  const [usernames, setUsernames] = useState(initialUsernames);

  const handleChange = (key, value) => {
    setUsernames((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // For each filled username, call the API
    const filled = optionList.filter((opt) => usernames[opt.key]?.trim());
    try {
      await Promise.all(
        filled.map((opt) =>
          axios.post("http://localhost:5000/student/coding-profile", {
            userId: student_id,
            platform_id: platformIdMap[opt.key],
            profile_username: usernames[opt.key].trim(),
          })
        )
      );
      alert("Profiles submitted for verification!");
      onClose();
    } catch (err) {
      alert("Error submitting profiles.");
      console.error(err);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-5 min-h-screen bg-black/50"
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl font-bold text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-2 text-center">
          Profile Links
        </h2>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Add or update your coding platform links
        </p>
        <form onSubmit={handleSave}>
          <div className="flex flex-col gap-2 mb-4">
            {optionList.map((opt) => (
              <React.Fragment key={opt.key}>
                <label htmlFor={opt.key}>{opt.label}</label>
                <input
                  type="text"
                  id={opt.key}
                  placeholder={`Enter ${opt.label} Username`}
                  value={usernames[opt.key]}
                  onChange={(e) => handleChange(opt.key, e.target.value)}
                  className="flex-1 border border-blue-50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
