import React from "react";
import { motion } from "framer-motion";
const StatsCard = ({ icon, title, value, color }) => {
  const colorMap = {
    blue: "bg-[#eff6ff] text-[#1447e6] ",
    purple: "bg-[#faf5ff] text-[#9810fa]",
    success: "bg-[#f0fdf4] text-[#1c7800]",
    warning: "bg-[#fefce8] text-[#a96b00]",
    error: "bg-r[#fef2f2] text-[#bc0000]",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-card md:p-6"
    >
      <div className="flex items-center">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[color]}`}
        >
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="text-2xl font-semibold text-gray-900">{value}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
