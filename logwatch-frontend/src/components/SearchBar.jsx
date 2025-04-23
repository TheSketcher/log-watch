import React from "react";
import Input from "@/components/ui/Input";

const SearchBar = ({ value, onChange }) => (
  <div className="flex-grow">
    <Input
      placeholder="Search applications …"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  </div>
);

export default SearchBar;
