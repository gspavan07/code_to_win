import React, { useState, useEffect } from "react";
import { useDepts } from "../context/MetaContext";
import BulkImportForm from "./ui/BulkImportStudent";
import BulkImportStudent from "./ui/BulkImportStudent";
import BulkImportFaculty from "./ui/BulkImportFaculty";

const optionList = [
  { label: "Leetcode", key: "leetcode" },
  { label: "CodeChef", key: "codechef" },
  { label: "GeeksforGeeks", key: "geekforgeeks" },
  { label: "HackerRank", key: "hackerrank" },
];

const platformIdMap = {
  leetcode: 1,
  codechef: 2,
  geekforgeeks: 3,
  hackerrank: 4,
};

// Add Faculty Modal
export function AddFacultyModal() {
  const { depts } = useDepts();
  const [form, setForm] = useState({
    name: "",
    employee_id: "",
    email: "",
    phone: "",
    dept_code: "",
    specialization: "",
    qualification: "",
    experience: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/faculty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    // Optionally handle response and close modal
  };

  return (
    <div className="w-full">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <h3>Add New Faculty</h3>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
          className="w-full px-3 py-2 border border-gray-200 rounded"
          placeholder="Faculty Name *"
        />
        <input
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          type="text"
          className="w-full px-3 py-2 border border-gray-200 rounded"
          placeholder="Employee ID *"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          className="w-full px-3 py-2 border border-gray-200 rounded"
          placeholder="Email *"
        />
        <select
          name="dept_code"
          value={form.dept_code}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded"
          required
        >
          <option value="">Select department</option>
          {depts?.map((dept) => (
            <option key={dept.dept_code} value={dept.dept_code}>
              {dept.dept_name}
            </option>
          ))}
        </select>

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add Faculty
          </button>
        </div>
      </form>
    </div>
  );
}

// Add HOD Modal
export function AddHODModal() {
  const { depts } = useDepts();
  return (
    <div className=" w-full">
      <div className="space-y-4">
        <h3>Add New HOD</h3>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-200 rounded"
          placeholder="HOD Name *"
        />
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-200 rounded"
          placeholder="Employee ID *"
        />
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-200 rounded"
          placeholder="Email *"
        />

        <select
          className="w-full px-3 py-2 border border-gray-200 rounded"
          required
        >
          <option>Select department</option>
          {depts?.map((dept) => (
            <option key={dept.dept_code} value={dept.dept_code}>
              {dept.dept_name}
            </option>
          ))}
        </select>
        <div className="flex justify-between mt-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Add HOD
          </button>
        </div>
      </div>
    </div>
  );
}

// Reset Password Modal
export function ResetPasswordModal() {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
      <form className="space-y-4">
        <select
          className="w-1/2 px-3 py-2 border border-gray-200 rounded"
          required
          // value={importType}
          // onChange={(e) => setImportType(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="hod">HOD</option>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="Employee ID *"
          required
        />
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          placeholder="Email *"
          required
        />
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="New Password *"
          required
        />
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Confirm Password *"
          required
        />
        <div className="flex justify-between mt-4">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded">
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
}

// Bulk Import Modal
export function BulkImportModal() {
  const [importType, setImportType] = useState("");

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Bulk Import Users</h2>
        <form className="space-y-4">
          <select
            className=" px-3 py-2 border border-gray-200 rounded"
            required
            value={importType}
            onChange={(e) => setImportType(e.target.value)}
          >
            <option value="">Select Import Type</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </form>
      </div>
      {importType === "" && (
        <div className="p-10 border border-gray-200 flex justify-center items-center rounded-2xl">
          <p className="text-gray-600">Please Select the type of import</p>
        </div>
      )}
      {/* Render different components based on import type */}
      {importType === "student" && (
        <div className="p-10 border border-gray-200 felx flex-col rounded-2xl">
          <p className="text-2xl text-gray-800">Student Bulk Import</p>
          <BulkImportStudent />
        </div>
      )}
      {importType === "faculty" && (
        <div className="p-10 border border-gray-200 felx flex-col rounded-2xl">
          <p className="text-2xl text-gray-800">Faculty Bulk Import</p>
          <BulkImportFaculty />
        </div>
      )}
    </div>
  );
}

// Edit Modal (student info)
export function EditModal({ onClose, user }) {
  const savedData = {
    name: user.name || "",
    roll: user.student_id || "",
    email: user.email || "",
    year: user.year || "",
    section: user.section || "",
  };
  const [form, setForm] = useState(savedData);

  useEffect(() => {
    setForm(savedData);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save logic here
    onClose();
  };

  const handleCancel = () => {
    setForm(savedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl text-gray-600 hover:text-black"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
          />
          <input
            name="roll"
            value={form.roll}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
            placeholder="Registration Number"
          />
          <input
            name="year"
            value={form.year}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
            placeholder="Year"
          />
          <input
            name="section"
            value={form.section}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
            placeholder="Section"
          />
          <input
            name="email"
            value={form.email}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
            placeholder="Email"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Update Profile Modal (coding profiles)
export function UpdateProfileModal({ onClose, user }) {
  const initialUsernames = optionList.reduce((acc, opt) => {
    const found = user.coding_profiles?.find(
      (p) => p.platform?.toLowerCase() === opt.label.toLowerCase()
    );
    acc[opt.key] = found ? found.profile_username : "";
    return acc;
  }, {});
  const [usernames, setUsernames] = useState(initialUsernames);

  useEffect(() => {
    setUsernames(initialUsernames);
    // eslint-disable-next-line
  }, [user]);

  const handleChange = (key, value) => {
    setUsernames((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Save logic here
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
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
}
