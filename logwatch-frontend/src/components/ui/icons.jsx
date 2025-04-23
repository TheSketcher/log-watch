import React from "react";

export const HomeIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-4 h-4 ${className}`}
  >
    <path d="M3 9.75L12 3l9 6.75V21a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 21V9.75z" />
    <path d="M9 22.5V15h6v7.5" />
  </svg>
);

export const LogoutIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-4 h-4 ${className}`}
  >
    <path d="M17 16l4-4-4-4" />
    <path d="M21 12H9" />
    <path d="M9 4v16" />
  </svg>
);
