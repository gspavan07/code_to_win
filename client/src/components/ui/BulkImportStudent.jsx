import React, { useState } from "react";
import { FaUpload } from "react-icons/fa6";
import { useDepts } from "../../context/MetaContext";
const RequiredLabel = ({ label, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
    {label} <span className="text-red-500">*</span>
  </label>)
const API_BASE = "http://localhost:5000";

const SAMPLE_CSV_DATA = `Student Id,Student Name,CGPA,Degree
22A91A6182,Pavan G,8.5,B.Tech
22A91A6182,Sunil G,9.0,B.Tech`;

const downloadSampleCSV = () => {
  const blob = new Blob([SAMPLE_CSV_DATA], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", "student_bulk_template.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const BulkImportStudent = ({ onSuccess }) => {
  const { depts } = useDepts();
  const [bulkFormData, setBulkFormData] = useState({
    dept: "",
    year: "",
    section: "",
    file: null,
  });
  const [bulkUploadStatus, setBulkUploadStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const handleBulkFormChange = (field, value) => {
    setBulkFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.endsWith(".csv")) {
      setBulkUploadStatus({
        loading: false,
        error: "Please upload a CSV file",
        success: false,
      });
      return;
    }
    setBulkFormData((prev) => ({
      ...prev,
      file: file,
    }));
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setBulkUploadStatus({ loading: true, error: null, success: false });

    if (
      !bulkFormData.dept ||
      !bulkFormData.year ||
      !bulkFormData.section ||
      !bulkFormData.file
    ) {
      setBulkUploadStatus({
        loading: false,
        error: "Please fill all required fields",
        success: false,
      });
      return;
    }

    const formData = new FormData();
    formData.append("dept", bulkFormData.dept);
    formData.append("year", bulkFormData.year);
    formData.append("section", bulkFormData.section);
    formData.append("file", bulkFormData.file);

    try {
      const response = await fetch(`${API_BASE}/api/bulk-import-student`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.errors[0].error || "Failed to import students");
      }

      setBulkUploadStatus({
        loading: false,
        error: null,
        success: true,
      });

      // Reset form
      setBulkFormData({
        dept: "",
        year: "",
        section: "",
        file: null,
      });

      // Call success callback
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error importing students:", error);
      setBulkUploadStatus({
        loading: false,
        error: error.message,
        success: false,
      });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleBulkSubmit}>
      <div>
        <RequiredLabel label="Branch" htmlFor="Branch" />
        <select
          value={bulkFormData.dept}
          onChange={(e) => handleBulkFormChange("dept", e.target.value)}
          className="w-full border-blue-50 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select branch</option>
          {depts?.map((dept) => (
            <option key={dept.dept_code} value={dept.dept_code}>
              {dept.dept_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <RequiredLabel label="Year" htmlFor="year" />
        <select
          value={bulkFormData.year}
          onChange={(e) => handleBulkFormChange("year", e.target.value)}
          className="w-full border-blue-50 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select year</option>
          {[1, 2, 3, 4].map((year) => (
            <option key={year} value={year}>
              {year}
              {year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <RequiredLabel label="section" htmlFor="section" />
        <select
          value={bulkFormData.section}
          onChange={(e) => handleBulkFormChange("section", e.target.value)}
          className="w-full border-blue-50 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select section</option>
          {["A", "B", "C"].map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>
      </div>

      <div>
        <RequiredLabel label="Choose CSV file" htmlFor="choose CSV file" />

        <div className="space-y-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>CSV Template:</span>
            <button
              type="button"
              onClick={downloadSampleCSV}
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Download Template
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={bulkUploadStatus.loading}
        className={`w-full mt-4 flex justify-center items-center gap-2 ${bulkUploadStatus.loading ? "bg-green-500" : "bg-green-600"
          } text-white font-medium py-2 rounded hover:bg-green-700 transition`}
      >
        {bulkUploadStatus.loading ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <FaUpload className="w-4 h-4" />
            Upload Students
          </>
        )}
      </button>

      {bulkUploadStatus.error && (
        <div className="text-red-500 text-sm mt-2">
          {bulkUploadStatus.error}
        </div>
      )}
      {bulkUploadStatus.success && (
        <div className="text-green-500 text-sm mt-2">
          Students upload successfully!
        </div>
      )}
    </form>
  );
};

export default BulkImportStudent;
