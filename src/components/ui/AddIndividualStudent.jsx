import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa6";
import { useDepts } from "../../context/MetaContext";

const API_BASE = "http://localhost:5000";

function AddIndividualStudentForm({ onSuccess }) {
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
          className={`w-full mt-4 flex justify-center items-center gap-2 ${
            submitStatus.loading ? "bg-blue-400" : "bg-blue-600"
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

export default AddIndividualStudentForm;
