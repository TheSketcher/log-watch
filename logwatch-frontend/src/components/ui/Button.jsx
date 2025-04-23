import React from "react";

const Button = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  const base =
    "rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const styles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
    ghost: "text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-300",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
