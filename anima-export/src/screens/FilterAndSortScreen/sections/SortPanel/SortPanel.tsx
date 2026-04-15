import { useState } from "react";

const sortOptions = [
  { id: "relevance", label: "Relevance" },
  { id: "price-low-high", label: "Price - Low to High" },
  { id: "price-high-low", label: "Price - High to Low" },
  { id: "newest-first", label: "Newest First" },
  { id: "oldest-first", label: "Oldest First" },
  { id: "area-low-high", label: "Area - Low to High" },
  { id: "area-high-low", label: "Area - High to Low" },
  { id: "price-per-sqft", label: "Price per Sq.Ft" },
];

interface SortPanelProps {
  onApply?: (selected: string) => void;
}

export const SortPanel = ({ onApply }: SortPanelProps): JSX.Element => {
  const [selected, setSelected] = useState<string>("relevance");

  return (
    <div className="flex flex-col w-full flex-1">
      <div className="flex flex-col gap-0 w-full border-t border-[#e9e9e9]">
        {sortOptions.map((option, idx) => (
          <button
            key={option.id}
            onClick={() => setSelected(option.id)}
            className={`flex items-center justify-between px-5 py-4 w-full border-b border-[#e9e9e9] transition-colors ${
              selected === option.id ? "bg-[#ebf1f6]" : "bg-white hover:bg-gray-50"
            }`}
          >
            <span
              className={`text-sm leading-5 ${
                selected === option.id
                  ? "font-medium text-[#356fa1]"
                  : "font-normal text-[#616363]"
              }`}
            >
              {option.label}
            </span>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selected === option.id
                  ? "border-[#356fa1]"
                  : "border-[#c4c4c4]"
              }`}
            >
              {selected === option.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#356fa1]" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
