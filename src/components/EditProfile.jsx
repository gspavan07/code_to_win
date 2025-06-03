import React, { useState, useEffect } from "react";

const EditProfile = ({ isOpen, user, onClose }) => {
  // This is the "saved" form data (simulate initial saved data)
  const savedData = {
    name: user.name || "",
    roll: user.roll_number || "",
    email: user.email || "",
    year: user.year || "",
    section: user.section || "",
  };

  // State for the form inputs (changes as user types)
  const [form, setForm] = useState(savedData);

  // State to keep the last saved form data
  const [savedForm, setSavedForm] = useState(savedData);

  // Reset form state to saved data when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setForm(savedForm);
    }
  }, [isOpen, savedForm]);

  // Handle input changes locally, do NOT save yet
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission - Save changes
  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedForm(form); // Save the current form state
    console.log("Saved form data:", form);
    onClose(); // Close modal after saving
  };

  // Handle Cancel - reset form to last saved state and close modal
  const handleCancel = () => {
    setForm(savedForm); // Reset form fields to saved data
    console.log("Cancelled changes, form reset.");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/50 ">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg relative">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
        <p className="text-sm text-gray-500 mb-4">
          Update your personal details here
        </p>

        <div className="flex items-center space-x-4 mb-6">
          <img
            src="/profile_bg.jpeg"
            alt="Profile"
            className="w-16 h-16 rounded-full shadow-lg"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4"
        >
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="name" className="text-sm font-semibold flex">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Registration Number - read-only */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="roll" className="text-sm font-medium flex">
              Registration Number
            </label>
            <input
              id="roll"
              name="roll"
              value={form.roll}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Year - read-only */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="year" className="text-sm font-medium flex">
              Year
            </label>
            <input
              id="year"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          {/* Section - read-only */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="section" className="text-sm font-medium flex">
              Section
            </label>
            <input
              id="section"
              name="section"
              value={form.section}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          {/* Email - read-only */}
          <div className="col-span-2">
            <label htmlFor="email" className="text-sm font-medium flex">
              Email
            </label>
            <input
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          {/* Submit button under form */}
          <div className="col-span-2 flex justify-end space-x-3 mt-4">
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
};

export default EditProfile;
