import React from "react";

interface FilterDropdownProps {
  filters: string[];
  show: boolean;
  toggle: () => void;
  selectedFilter?: string;
  onSelect: (filter: string | undefined) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filters,
  show,
  toggle,
  selectedFilter,
  onSelect,
}) => {
  if (filters.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className={`p-1 hover:bg-gray-600 rounded cursor-pointer ${selectedFilter ? "bg-red-500" : "bg-gray-300"
          }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="7" y1="12" x2="17" y2="12" />
          <line x1="10" y1="18" x2="14" y2="18" />
        </svg>
      </button>
      {show && (
        <div className="p-1 absolute right-9 bottom-0 mt-2 mb-1 bg-white border rounded shadow-md z-10 whitespace-nowrap">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                onSelect(filter === "none" ? undefined : filter);
                toggle();
              }}
              className={`block px-4 py-2 text-sm w-full text-left text-gray-800 rounded hover:bg-gray-100 ${selectedFilter === filter ? "bg-gray-200 font-semibold" : ""
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
