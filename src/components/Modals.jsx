import React, { useState, useEffect } from "react";
import { useDepts } from "../context/MetaContext";
import BulkImportStudent from "./ui/BulkImportStudent";
import BulkImportFaculty from "./ui/BulkImportFaculty";
import { FaUserPlus } from "react-icons/fa6";

const API_BASE = "http://localhost:5000";

const optionList = [
  { label: "Leetcode", key: "leetcode" },
  { label: "CodeChef", key: "codechef" },
  { label: "GeeksforGeeks", key: "geekforgeeks" },
  { label: "HackerRank", key: "hackerrank" },
];

export function AddIndividualStudentModel({ onSuccess }) {
  const { depts } = useDepts();
  const [formData, setFormData] = useState({
    name: "",
    stdId: "",
    dept: "",
    year: "",
    section: "",
    degree: "",
    cgpa: "",
  });

  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, error: null, success: false });

    // Basic validation
    if (
      !formData.name ||
      !formData.stdId ||
      !formData.dept ||
      !formData.year ||
      !formData.section ||
      !formData.degree ||
      !formData.cgpa
    ) {
      setSubmitStatus({
        loading: false,
        error: "Please fill all required fields",
        success: false,
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/faculty/add-student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add student");
      }

      setSubmitStatus({ loading: false, error: null, success: true });

      // Reset form after successful submission
      setFormData({
        name: "",
        stdId: "",
        dept: "",
        year: "",
        section: "",
        degree: "",
        cgpa: "",
      });

      // Notify parent to refresh student list
      if (onSuccess) onSuccess();
    } catch (error) {
      setSubmitStatus({ loading: false, error: error.message, success: false });
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Add Individual Student
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Add a single student to your section
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Student Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Student Name *
          </label>
          <input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            type="text"
            placeholder="Enter student name"
            className="w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Roll Number */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Roll Number *
          </label>
          <input
            id="stdId"
            value={formData.stdId}
            onChange={(e) => handleChange("stdId", e.target.value)}
            type="text"
            placeholder="Enter roll number"
            className="w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* CGPA */}
        <div>
          <label className="block text-sm font-medium mb-1">CGPA *</label>
          <input
            id="cgpa"
            value={formData.cgpa}
            onChange={(e) => handleChange("cgpa", e.target.value)}
            type="text"
            placeholder="Enter CGPA"
            className="w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Degree */}
        <div>
          <label className="block text-sm font-medium mb-1">Degree *</label>
          <select
            id="degree"
            value={formData.degree}
            onChange={(e) => handleChange("degree", e.target.value)}
            className="w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select degree</option>
            <option value="B.Tech">B.Tech</option>
            <option value="MCA">MCA</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium mb-1">Branch *</label>
          <select
            id="dept"
            value={formData.dept}
            onChange={(e) => handleChange("dept", e.target.value)}
            className="w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select branch</option>
            {depts?.map((dept) => (
              <option key={dept.dept_code} value={dept.dept_code}>
                {dept.dept_name}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium mb-1">Year *</label>
          <select
            id="year"
            value={formData.year}
            onChange={(e) => handleChange("year", e.target.value)}
            className="w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select year</option>
            {[1, 2, 3, 4].map((year) => (
              <option key={year} value={year}>
                {year}
                {year === 1
                  ? "st"
                  : year === 2
                    ? "nd"
                    : year === 3
                      ? "rd"
                      : "th"}
              </option>
            ))}
          </select>
        </div>

        {/* Section */}
        <div>
          <label className="block text-sm font-medium mb-1">Section *</label>
          <select
            id="section"
            value={formData.section}
            onChange={(e) => handleChange("section", e.target.value)}
            className="w-full border border-gray-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select section</option>
            {["A", "B", "C", "D"].map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitStatus.loading}
          className={`w-full mt-4 flex justify-center items-center gap-2 ${submitStatus.loading ? "bg-blue-400" : "bg-blue-600"
            } text-white font-medium py-2 rounded hover:bg-blue-700 transition`}
        >
          {submitStatus.loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <FaUserPlus className="w-4 h-4" />
              Add Student
            </>
          )}
        </button>

        {submitStatus.error && (
          <div className="text-red-500 text-sm mt-2">{submitStatus.error}</div>
        )}
        {submitStatus.success && (
          <div className="text-green-500 text-sm mt-2">
            Student added successfully!
          </div>
        )}
      </form>
    </div>
  );
}

// Add Faculty Modal
export function AddFacultyModal() {
  const { depts } = useDepts();
  const [form, setForm] = useState({
    name: "",
    facultyId: "",
    email: "",
    dept: "",
  });
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, error: null, success: false });

    // Basic validation
    if (!form.name || !form.facultyId || !form.email || !form.dept) {
      setSubmitStatus({
        loading: false,
        error: "Please fill all required fields",
        success: false,
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/add-faculty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add faculty");
      }

      setSubmitStatus({ loading: false, error: null, success: true });

      // Reset form after successful submission
      setForm({
        name: "",
        facultyId: "",
        email: "",
        dept: "",
      });

      // // Notify parent to refresh student list
      // if (onSuccess) onSuccess();
    } catch (error) {
      setSubmitStatus({ loading: false, error: error.message, success: false });
    }
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
          name="facultyId"
          value={form.facultyId}
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
          name="dept"
          value={form.dept}
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

        <button
          type="submit"
          disabled={submitStatus.loading}
          className={`w-full mt-4 flex justify-center items-center gap-2 ${submitStatus.loading ? "bg-blue-400" : "bg-blue-600"
            } text-white font-medium py-2 rounded hover:bg-blue-700 transition`}
        >
          {submitStatus.loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <FaUserPlus className="w-4 h-4" />
              Add Faculty
            </>
          )}
        </button>

        {submitStatus.error && (
          <div className="text-red-500 text-sm mt-2">{submitStatus.error}</div>
        )}
        {submitStatus.success && (
          <div className="text-green-500 text-sm mt-2">
            Faculty added successfully!
          </div>
        )}
      </form>
    </div>
  );
}

// Add HOD Modal
export function AddHODModal() {
  const { depts } = useDepts();
  const [form, setForm] = useState({
    name: "",
    hodId: "",
    email: "",
    dept: "",
  });
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, error: null, success: false });

    // Basic validation
    if (!form.name || !form.hodId || !form.email || !form.dept) {
      setSubmitStatus({
        loading: false,
        error: "Please fill all required fields",
        success: false,
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/add-hod`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add hod");
      }

      setSubmitStatus({ loading: false, error: null, success: true });

      // Reset form after successful submission
      setForm({
        name: "",
        hodId: "",
        email: "",
        dept: "",
      });

      // // Notify parent to refresh student list
      // if (onSuccess) onSuccess();
    } catch (error) {
      setSubmitStatus({ loading: false, error: error.message, success: false });
    }
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
          placeholder="HOD Name *"
        />
        <input
          name="hodId"
          value={form.hodId}
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
          name="dept"
          value={form.dept}
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

        <button
          type="submit"
          disabled={submitStatus.loading}
          className={`w-full mt-4 flex justify-center items-center gap-2 ${submitStatus.loading ? "bg-blue-400" : "bg-blue-600"
            } text-white font-medium py-2 rounded hover:bg-blue-700 transition`}
        >
          {submitStatus.loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <FaUserPlus className="w-4 h-4" />
              Add HOD
            </>
          )}
        </button>

        {submitStatus.error && (
          <div className="text-red-500 text-sm mt-2">{submitStatus.error}</div>
        )}
        {submitStatus.success && (
          <div className="text-green-500 text-sm mt-2">
            HOD added successfully!
          </div>
        )}
      </form>
    </div>
  );
}

// Reset Password Modal
export function ResetPasswordModal() {
  const [form, setForm] = useState({
    userId: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, error: null, success: false });

    // Validation
    if (!form.userId || !form.role || !form.password || !form.confirmPassword) {
      setSubmitStatus({
        loading: false,
        error: "Please fill all required fields",
        success: false,
      });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setSubmitStatus({
        loading: false,
        error: "Passwords do not match",
        success: false,
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: form.userId,
          role: form.role,
          password: form.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }
      setSubmitStatus({ loading: false, error: null, success: true });
      setForm({
        userId: "",
        role: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setSubmitStatus({ loading: false, error: error.message, success: false });
    }
  };
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <select
          id="role"
          name="role"
          className="w-1/2 px-3 py-2 border border-gray-200 rounded"
          required
          value={form.role}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="hod">HOD</option>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>
        <input
          id="userId"
          name="userId"
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="User ID *"
          required
          value={form.userId}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="New Password *"
          required
          value={form.password}
          onChange={handleChange}
        />
        <input
          name="confirmPassword"
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Confirm Password *"
          required
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
            disabled={submitStatus.loading}
          >
            {submitStatus.loading ? "Processing..." : "Reset Password"}
          </button>
        </div>
        {submitStatus.error && (
          <div className="text-red-500 text-sm mt-2">{submitStatus.error}</div>
        )}
        {submitStatus.success && (
          <div className="text-green-500 text-sm mt-2">
            Password reset successful!
          </div>
        )}
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
          <p className="text-2xl text-gray-800">Student Bulk Upload</p>
          <BulkImportStudent />
        </div>
      )}
      {importType === "faculty" && (
        <div className="p-10 border border-gray-200 felx flex-col rounded-2xl">
          <p className="text-2xl text-gray-800">Faculty Bulk Upload</p>
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
          x
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
    acc[opt.key] = user.coding_profiles?.[`${opt.key}_id`] || "";
    return acc;
  }, {});
  const [usernames, setUsernames] = useState(initialUsernames);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setUsernames(initialUsernames);
    // eslint-disable-next-line
  }, [user]);

  const handleChange = (key, value) => {
    setUsernames((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Build payload with only changed usernames
    const payload = { userId: user.student_id };
    optionList.forEach((opt) => {
      const prev = user.coding_profiles?.[`${opt.key}_id`] || "";
      const curr = usernames[opt.key] || "";
      if (prev !== curr) {
        payload[`${opt.key}_id`] = curr;
      }
    });

    // If nothing changed, just close
    if (Object.keys(payload).length === 1) {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 500);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/student/coding-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update coding profiles");
      }

      setSuccess(true);
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
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
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {success && (
            <div className="text-green-500 text-sm mb-2">
              Coding profiles updated!
            </div>
          )}
          <div className="flex justify-between gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export function UserResetPasswordModal({ onClose, user }) {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, error: null, success: false });

    // Validation
    if (!form.password || !form.confirmPassword) {
      setSubmitStatus({
        loading: false,
        error: "Please fill all required fields",
        success: false,
      });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setSubmitStatus({
        loading: false,
        error: "Passwords do not match",
        success: false,
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.student_id,
          role: user.role,
          password: form.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }
      setSubmitStatus({ loading: false, error: null, success: true });
      setForm({
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setSubmitStatus({ loading: false, error: error.message, success: false });
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl text-gray-600 hover:text-black"
        >
          x
        </button>
        <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            id="userId"
            name="userId"
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="User ID *"
            value={user.student_id}
            disabled
          />
          <input
            name="password"
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="New Password *"
            required
            value={form.password}
            onChange={handleChange}
          />
          <input
            name="confirmPassword"
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Confirm Password *"
            required
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
              disabled={submitStatus.loading}
            >
              {submitStatus.loading ? "Processing..." : "Reset Password"}
            </button>
          </div>
          {submitStatus.error && (
            <div className="text-red-500 text-sm mt-2">{submitStatus.error}</div>
          )}
          {submitStatus.success && (
            <div className="text-green-500 text-sm mt-2">
              Password reset successful!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}