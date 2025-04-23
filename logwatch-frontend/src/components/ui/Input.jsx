import React from "react";

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${className}`}
    {...props}
  />
);

export default Input;
