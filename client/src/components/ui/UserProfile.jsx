import React from 'react'
import { useAuth } from "../../context/AuthContext";
import { FaUser } from 'react-icons/fa';

function UserProfile() {
      const { currentUser } = useAuth();
    
  return (
      <div>
           <div className="bg-blue-600 rounded-md p-4 md:p-6 text-white flex flex-col md:flex-row items-center w-full shadow-md gap-4">
                      {/* Avatar Circle */}
                      <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-2 md:mb-0 md:mr-4">
                        <FaUser className="text-white text-2xl" />
                      </div>
          
                      {/* Text Info */}
                      <div className="flex flex-col items-center md:items-start">
                        <div className="text-xl font-semibold">{currentUser.name}</div>
                        <div className="text-base">{currentUser.email}</div>
                      </div>
                    </div>
    </div>
  )
}
export default UserProfile;