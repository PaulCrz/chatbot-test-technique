import React from "react";

export interface ChipBase {
  text: string;
  onClick: (data: object) => void;
}

interface ChipListProps {
  chips: ChipBase[];
  selected?: boolean;
}

const ChipList: React.FC<ChipListProps> = ({ chips, selected = false }) => {
  if (chips.length === 0) return null;

  return (
    <>
      <hr className="border-t border-gray-300 my-4" />
      <div className="flex flex-wrap gap-2 mb-4">
        {chips.map((chip, index) => (
          <button
            key={index}
            type="button"
            onClick={() => chip.onClick(chip)}
            className={`px-4 py-2 text-sm rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${selected
                ? "bg-indigo-500 text-white hover:bg-indigo-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {chip.text}
          </button>
        ))}
      </div>
    </>
  );
};

export default ChipList;
