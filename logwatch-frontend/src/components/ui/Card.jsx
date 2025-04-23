import React from "react";

export const Card = ({ className = "", children }) => (
  <div className={`bg-white rounded-xl shadow ${className}`}>{children}</div>
);

export const CardContent = ({ className = "", children }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);
