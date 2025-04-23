import React from "react";
import Input from "@/components/ui/Input";

const SearchBar = ({ value, onChange }) => (
  <div className="mb-6">
    <Input
      placeholder="Suche Applikationen …"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default SearchBar;
