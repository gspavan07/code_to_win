import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 py-10 px-6 text-base text-gray-600">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Code<span className="text-black">Track</span>
          </h2>
          <p className="mt-2 text-gray-500">
            Helping students track and showcase their coding journey across
            multiple platforms.
          </p>
          <div className="flex space-x-4 mt-4 text-xl">
            <a href="#" aria-label="GitHub" className="hover:text-black">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-black">
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="mailto:your@email.com"
              aria-label="Email"
              className="hover:text-black"
            >
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Navigation</h3>
          <ul className="space-y-1">
            <li>
              <NavLink to="/" className="hover:text-black">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/strength" className="hover:text-black">
                Check Your Strength
              </NavLink>
            </li>
            <li>
              <NavLink to="/dev" className="hover:text-black">
                Developers
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="hover:text-black">
                Contact Us
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Platforms */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Platforms</h3>
          <ul className="space-y-1">
            <li>
              <a
                href="https://www.hackerrank.com/"
                className="hover:text-black"
                target="_blank"
              >
                HackerRank
              </a>
            </li>
            <li>
              <a
                href="https://leetcode.com/"
                className="hover:text-black"
                target="_blank"
              >
                LeetCode
              </a>
            </li>
            <li>
              <a
                href="https://www.codechef.com/"
                className="hover:text-black"
                target="_blank"
              >
                CodeChef
              </a>
            </li>
            <li>
              <a
                href="https://www.geeksforgeeks.org/"
                className="hover:text-black"
                target="_blank"
              >
                GeeksforGeeks
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-base text-gray-400 border-t border-gray-100 pt-6">
        © 2025 CodeProfileTracker. All rights reserved by{" "}
        <span className="text-black font-medium">Ofzen</span>.
      </div>
    </footer>
  );
};

export default Footer;
