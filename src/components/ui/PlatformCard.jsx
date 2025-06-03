import React from "react";

const PlatformCard = ({
  name,
  color,
  total,
  breakdown,
  subtitle = "Problems Solved",
}) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full">
    <div className="flex justify-between items-center mb-2">
      <h2 className="font-semibold text-base md:text-lg">{name}</h2>
      <div className={`w-4 h-4 rounded-full ${color}`} />
    </div>
    <div className="text-3xl font-bold">{total}</div>
    <div className="text-sm text-gray-500 mb-2">{subtitle}</div>
    {breakdown && (
      <div className="flex flex-wrap text-sm text-gray-700 space-x-3">
        {Object.entries(breakdown).map(([label, count]) => (
          <span key={label}>
            {label}: {count}
          </span>
        ))}
      </div>
    )}
  </div>
);

export default PlatformCard;
