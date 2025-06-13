import React from "react";
import { FaEnvelope, FaGithub, FaLinkedin, FaRegEnvelope } from "react-icons/fa6";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#111827] border-t border-gray-200 pt-10 pb-5 px-6 text-base text-gray-400">
      <div className="max-w-6xl mx-auto flex md:flex-row flex-col justify-around  gap-y-8">
        {/* Logo and Description */}
        <div>
          <h2 className="text-xl font-bold text-[#FFFFFF]">
            Code<span className="text-[#FFFFFF]">Track</span>
          </h2>
          <p className="mt-2 text-gray-500 md:max-w-xs">
            Helping students track and showcase their coding journey across
            multiple platforms.
          </p>
          <div className="flex space-x-4 mt-4 text-xl">
            <a href="#" aria-label="GitHub" className="hover:text-[#FFFFFF]">
              <FiGithub />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-[#FFFFFF]">
              <FiLinkedin />
            </a>
            <a
              href="mailto:your@email.com"
              aria-label="Email"
              className="hover:text-[#FFFFFF]"
            >
              <FaRegEnvelope />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-[#FFFFFF] mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li>
              <NavLink to="/" className="hover:text-[#FFFFFF]">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/strength" className="hover:text-[#FFFFFF]">
                Check Your Strength
              </NavLink>
            </li>
            <li>
              <NavLink to="/dev" className="hover:text-[#FFFFFF]">
                Developers
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="hover:text-[#FFFFFF]">
                Contact Us
              </NavLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-[#FFFFFF] mb-2">KEY FEATURES</h3>
          <ul className="space-y-1">
            <li className="hover:text-[#FFFFFF]">
              Dynamic Dashboards
            </li>
            <li className="hover:text-[#FFFFFF]">
              Live Ranking
            </li>

          </ul>
        </div>
        {/* Platforms */}
        <div>
          <h3 className="font-semibold text-[#FFFFFF] mb-2">Platforms</h3>
          <ul className="space-y-1">
            <li>
              <a
                href="https://www.hackerrank.com/"
                className="hover:text-[#FFFFFF]"
                target="_blank"
              >
                HackerRank
              </a>
            </li>
            <li>
              <a
                href="https://leetcode.com/"
                className="hover:text-[#FFFFFF]"
                target="_blank"
              >
                LeetCode
              </a>
            </li>
            <li>
              <a
                href="https://www.codechef.com/"
                className="hover:text-[#FFFFFF]"
                target="_blank"
              >
                CodeChef
              </a>
            </li>
            <li>
              <a
                href="https://www.geeksforgeeks.org/"
                className="hover:text-[#FFFFFF]"
                target="_blank"
              >
                GeeksforGeeks
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-base text-gray-300 border-t border-gray-300 pt-6">
        © 2025 CodeProfileTracker. All rights reserved by{" "}
        <a href="https://ofzen.in/" className="text-gray-100 hover:underline font-medium">
          Ofzen
        </a>
        .
      </div>
    </footer>
  );
};

export default Footer;
