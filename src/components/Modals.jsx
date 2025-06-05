import React,{useState,useEffect} from "react";

function Modals({ activeModal, onClose,user }) {
  if (!activeModal) return null;
  
  // This is the "saved" form data (simulate initial saved data)
  const savedData = {
    name: user.name || "",
    roll: user.student_id || "",
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
    {
      setForm(savedForm);
    }
  }, [ savedForm]);

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

  const ModalWrapper = ({ children }) => (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl text-gray-600 hover:text-black"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );

  switch (activeModal) {
    case "addFaculty":
      return (
        <ModalWrapper>
          <div className="space-y-4">
            {/* Faculty Name */}
            <div className="space-y-1">
              <h3>Add New Faculty</h3>
              <label
                htmlFor="hodName"
                className="block text-sm font-medium text-gray-700"
              >
                Faculty Name *
              </label>
              <input
                type="text"
                id="facultyName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter faculty name"
              />
            </div>

            {/* Employee ID */}
            <div className="space-y-1">
              <label
                htmlFor="employeeId"
                className="block text-sm font-medium text-gray-700"
              >
                Employee ID *
              </label>
              <input
                type="text"
                id="employeeId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter employee ID"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              {/* Department */}
              <label
                htmlFor="Department"
                className="block text-sm font-medium text-gray-700"
              >
                Department
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option>Select department</option>
                <option>CSE</option>
                <option>ECE</option>
              </select>
            </div>
            {/* Specialization */}
            <div className="space-y-1">
              <label
                htmlFor="specialization"
                className="block text-sm font-medium text-gray-700"
              >
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter specialization"
              />
            </div>

            {/* Qualification */}
            <div className="space-y-1">
              <label
                htmlFor="qualification"
                className="block text-sm font-medium text-gray-700"
              >
                Qualification
              </label>
              <input
                type="text"
                id="qualification"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter qualification"
              />
            </div>

            {/* Experience */}
            <div className="space-y-1">
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-700"
              >
                Experience (Years)
              </label>
              <input
                type="number"
                id="experience"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter years of experience"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Add Faculty
              </button>
              <button
                type="button"
                onClick={onClose}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </ModalWrapper>
      );

    case "addHOD":
      return (
        <ModalWrapper>
          <div className="space-y-4">
            {/* Faculty Name */}
            <div className="space-y-1">
              <h3>Add New HOD</h3>
              <label
                htmlFor="hodName"
                className="block text-sm font-medium text-gray-700"
              >
                Faculty Name *
              </label>
              <input
                type="text"
                id="hodName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter faculty name"
              />
            </div>

            {/* Employee ID */}
            <div className="space-y-1">
              <label
                htmlFor="employeeId"
                className="block text-sm font-medium text-gray-700"
              >
                Employee ID *
              </label>
              <input
                type="text"
                id="employeeId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter employee ID"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              {/* Department */}
              <label
                htmlFor="Department"
                className="block text-sm font-medium text-gray-700"
              >
                Department
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option>Select department</option>
                <option>CSE</option>
                <option>ECE</option>
              </select>
            </div>
            {/* Specialization */}
            <div className="space-y-1">
              <label
                htmlFor="specialization"
                className="block text-sm font-medium text-gray-700"
              >
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter specialization"
              />
            </div>

            {/* Qualification */}
            <div className="space-y-1">
              <label
                htmlFor="qualification"
                className="block text-sm font-medium text-gray-700"
              >
                Qualification
              </label>
              <input
                type="text"
                id="qualification"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter qualification"
              />
            </div>

            {/* Experience */}
            <div className="space-y-1">
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-700"
              >
                Experience (Years)
              </label>
              <input
                type="number"
                id="experience"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter years of experience"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Add HOD
              </button>
              <button
                type="button"
                onClick={onClose}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </ModalWrapper>
      );

    case "resetPassword":
      return (
        <ModalWrapper>
          <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
          <form className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="usertype" className="block mb-1 font-medium">
                  User Type *
                </label>
                <input
                  type="text"
                  id="usertype"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter user type"
                  required
                />
              </div>

              <div>
                <label htmlFor="employeeId" className="block mb-1 font-medium">
                  Employee ID *
                </label>
                <input
                  type="text"
                  id="employeeId"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter Employee ID"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter Email"
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block mb-1 font-medium">
                  New Password *
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter New Password"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 font-medium"
                >
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
              >
                Reset Password
              </button>
              <button
                type="button"
                onClick={onClose}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </ModalWrapper>
      );

    case "bulkImport":
      return (
        <ModalWrapper>
          <h2 className="text-lg font-semibold mb-4">Bulk Import Users</h2>
          <form className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="importType" className="block mb-1 font-medium">
                  Import Type *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option>Select department</option>
                  <option>student</option>
                  <option>faculty</option>
                </select>
              </div>

              <div>
                <label htmlFor="department" className="block mb-1 font-medium">
                  Department *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option>Select department</option>
                  <option>CSE</option>
                  <option>ECE</option>
                  <option>AIML</option>
                  <option>IT</option>
                </select>
              </div>

              <div>
                <label htmlFor="fileUpload" className="block mb-1 font-medium">
                  Upload File (.csv, .xlsx) *
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  accept=".csv, .xlsx"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Upload a CSV or Excel file containing user data.
            </p>
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={onClose}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </ModalWrapper>
      );
    case "edit":
      return (
        <ModalWrapper>
        <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
        <p className="text-sm text-gray-500 mb-4">
          Update your personal details here
        </p>
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
        </ModalWrapper>
      )
      
    default:
      return null;
  }
}

export default Modals;
