import React, { useState } from "react";

const optionList = [
  { label: "Leetcode", key: "leetcode" },
  { label: "CodeChef", key: "codechef" },
  { label: "GeeksforGeeks", key: "geekforgeeks" },
  { label: "HackerRank", key: "hackerrank" },
];

const UpdateProfile = ({ isOpen, user, onClose, initialLinks = [] }) => {
  const [links, setLinks] = useState(initialLinks);
  const [selectedOption, setSelectedOption] = useState(optionList[0].key);
  const [inputValue, setInputValue] = useState("");

  // Reset links when modal opens
  React.useEffect(() => {
    if (isOpen) setLinks(initialLinks);
  }, [isOpen, initialLinks]);

  const handleAddLink = () => {
    if (!inputValue.trim()) return;
    setLinks([
      ...links,
      { type: selectedOption, url: inputValue.trim() }
    ]);
    setInputValue("");
  };

  const handleRemoveLink = (idx) => {
    setLinks(links.filter((_, i) => i !== idx));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (user) user(links);
  };

  const handleCancel = (e) => {
    if (e) e.preventDefault();
    setLinks(initialLinks);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 min-h-screen bg-black/50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-xl font-bold text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-2 text-center">Profile Links</h2>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Add or update your coding platform links
        </p>
        <form onSubmit={handleSave}>
          <div className="flex flex-col gap-2 mb-4">
           <label htmlFor="leet"> leetcode</label>
            <input
              type="url"
              placeholder="Enter link"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 border border-blue-50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
                   <label htmlFor="gfg"> GeeksforGeeks</label>
            <input
              type="url"
              placeholder="Enter link"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 border border-blue-50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
                   <label htmlFor="Hr"> Hacker Rank</label>
            <input
              type="url"
              placeholder="Enter link"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 border border-blue-50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
                   <label htmlFor="cc"> CodeChef</label>
            <input
              type="url"
              placeholder="Enter link"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 border border-blue-50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={handleAddLink}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          
          <div className="flex justify-between gap-2 mt-4">
            <button
              type="button"
              onClick={handleCancel}
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