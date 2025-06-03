import React from "react";
import { motion } from "framer-motion";
const StatsCard = ({ icon, title, value, color }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    success: "bg-green-50 text-green-700",
    warning: "bg-yellow-50 text-yellow-700",
    error: "bg-red-50 text-red-700",
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
