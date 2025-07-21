import React, { useState, useEffect } from "react";
import { FaEnvelope, FaCheck, FaReply } from "react-icons/fa";

const ContactRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchContactRequests();
  }, []);

  const fetchContactRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact");
      if (!response.ok) {
        throw new Error("Failed to fetch contact requests");
      }
      const data = await response.json();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError("Error loading contact requests. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update request status");
      }
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status } : req
      ));
      
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update request status");
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">New</span>;
      case 'read':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Read</span>;
      case 'responded':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Responded</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading contact requests...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        {error}
        <button 
          onClick={fetchContactRequests}
          className="block mx-auto mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Contact Requests</h2>
        <p className="text-sm text-gray-500">Manage user inquiries and feedback</p>
      </div>

      <div className="flex flex-col md:flex-row h-[600px]">
        {/* Request List */}
        <div className="w-full md:w-1/3 border-r overflow-y-auto h-full">
          {requests.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No contact requests found
            </div>
          ) : (
            <ul className="divide-y">
              {requests.map((request) => (
                <li 
                  key={request.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedRequest?.id === request.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    setSelectedRequest(request);
                    if (request.status === 'new') {
                      updateRequestStatus(request.id, 'read');
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{request.name}</p>
                      <p className="text-sm text-gray-600">{request.email}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(request.created_at)}
                  </p>
                  <p className="text-sm mt-1 text-gray-700 truncate">
                    {request.message.substring(0, 60)}
                    {request.message.length > 60 ? "..." : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Request Detail */}
        <div className="w-full md:w-2/3 p-6 overflow-y-auto h-full">
          {selectedRequest ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{selectedRequest.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateRequestStatus(selectedRequest.id, 'read')}
                    className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    title="Mark as Read"
                  >
                    <FaEnvelope />
                  </button>
                  <button
                    onClick={() => updateRequestStatus(selectedRequest.id, 'responded')}
                    className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    title="Mark as Responded"
                  >
                    <FaCheck />
                  </button>
                  <a
                    href={`mailto:${selectedRequest.email}?subject=Re: Your Contact Request`}
                    className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                    title="Reply via Email"
                  >
                    <FaReply />
                  </a>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  <strong>Email:</strong> {selectedRequest.email}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Date:</strong> {formatDate(selectedRequest.created_at)}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Status:</strong> {selectedRequest.status}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Message:</h4>
                <p className="whitespace-pre-wrap">{selectedRequest.message}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FaEnvelope size={48} className="mb-4 opacity-30" />
              <p>Select a request to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactRequests;