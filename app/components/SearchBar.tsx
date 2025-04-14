import React from "react";

interface SearchBarProps {
  searchValue?: string;
  onSearchChange: (value: string) => void;
  onSubmit: () => void;
  submitDisabled: boolean;
  submitButtonText: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  onSearchChange,
  onSubmit,
  submitDisabled,
  submitButtonText,
}) => {
  return (
    <div className="relative flex items-center h-12">
      <input
        type="text"
        value={searchValue || ""}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Filtrer les résultats..."
        className="h-full w-1/2 px-4 rounded-l-lg border border-black focus:outline-none disabled:bg-gray-100 disabled:text-gray-400 shadow-sm transition-all duration-200 text-black"
      />
      <button
        type="button"
        disabled={submitDisabled}
        className="h-full w-1/2 px-4 bg-indigo-600 text-white rounded-r-lg border border-black border-l-0 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex justify-center items-center cursor-pointer shadow-sm"
        onClick={onSubmit}
      >
        {submitButtonText}
      </button>
    </div>
  );
};

export default SearchBar;
