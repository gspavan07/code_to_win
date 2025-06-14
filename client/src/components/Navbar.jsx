import React, { useEffect, useState } from "react";
import { GrCodepen } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  // Replace this with your actual authentication logic
  const { logout, currentUser } = useAuth();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-40">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <NavLink to="/">
            <div className="flex flex-row items-center gap-3">
              <img src="/logo.svg" alt="" className="w-12" />
              <div className="border border-gray-500 h-10" />
              <img src="/au_logo.svg" alt="" className="w-10" />
              <h1 className="text-lg font-bold text-gray-800">CodeTracker</h1>
            </div>
          </NavLink>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 font-medium p-2 cursor-pointer">
              <FiUser />
              {currentUser.name}
              <span className="text-sm font-normal text-gray-500">
                ({currentUser.role})
              </span>
            </div>
            <div
              onClick={logout}
              className="flex items-center gap-2 on hover:text-blue-800 p-2 cursor-pointer"
            >
              <FiLogOut />
              Logout
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <div
              onClick={logout}
              className="flex items-center gap-2 on hover:text-blue-800 p-2 cursor-pointer"
            >
              <FiLogOut />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
