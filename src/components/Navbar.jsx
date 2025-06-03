import React, { useEffect, useState } from "react";
import { GrCodepen } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  // Replace this with your actual authentication logic
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, currentUser } = useAuth();
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
      : "text-gray-800 hover:text-blue-600 pb-1";

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className=" mx-auto px-4 sm:px-6 lg:px-40">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <NavLink to="/">
            <div className="flex flex-row items-center gap-3">
              <GrCodepen className="text-3xl text-gray-800" />
              <h1 className="text-lg font-bold text-gray-800">
                Coding Dashboard
              </h1>
            </div>
          </NavLink>
          {!currentUser ? (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-6">
                <NavLink to="/" className={linkClass}>
                  Home
                </NavLink>
                <NavLink to="/stdDash" className={linkClass}>
                  Check Your Strength
                </NavLink>
                <NavLink to="/dev" className={linkClass}>
                  Developers
                </NavLink>
                <NavLink to="/contact" className={linkClass}>
                  Contact
                </NavLink>
              </div>
            </>
          ) : (
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
          )}

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            {!currentUser ? (
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="text-2xl text-gray-700 focus:outline-none"
              >
                {mobileMenuOpen ? <FiX /> : <FiMenu />}
              </button>
            ) : (
              <div
                onClick={logout}
                className="flex items-center gap-2 on hover:text-blue-800 p-2 cursor-pointer"
              >
                <FiLogOut />
              </div>
            )}
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden flex flex-col gap-2 py-2">
            <NavLink
              to="/"
              className={linkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/stdDash"
              className={linkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Check Your Strength
            </NavLink>
            <NavLink
              to="/dev"
              className={linkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Developers
            </NavLink>
            <NavLink
              to="/contact"
              className={linkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </NavLink>
            {!isLoggedIn ? (
              <>
                <NavLink
                  to="/login"
                  className={linkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={linkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </NavLink>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100"
              >
                <FiLogOut /> Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
