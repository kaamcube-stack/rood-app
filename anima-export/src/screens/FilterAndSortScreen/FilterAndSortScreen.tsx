import { useState } from "react";
import { FilterSortControlSection } from "./sections/FilterSortControlSection/FilterSortControlSection";
import { QuickFilterGridSection } from "./sections/QuickFilterGridSection/QuickFilterGridSection";
import { SortPanel } from "./sections/SortPanel/SortPanel";

export const FilterAndSortScreen = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<"sort" | "filter">("filter");
  const [activePropertyType, setActivePropertyType] = useState("residential");
  const [resultCount] = useState(1248);

  const handleReset = () => {
    // Reset logic (can be wired to child state via context/callback if needed)
  };

  const handleClose = () => {
    // Close / dismiss modal
  };

  return (
    <div className="flex flex-col w-[375px] h-[812px] items-center relative bg-white rounded-[32px_32px_0px_0px] overflow-hidden shadow-2xl">
      {/* Header controls */}
      <FilterSortControlSection
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activePropertyType={activePropertyType}
        onPropertyTypeChange={setActivePropertyType}
        onReset={handleReset}
        onClose={handleClose}
      />

      {/* Scrollable content area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {activeTab === "filter" ? (
          <QuickFilterGridSection />
        ) : (
          <SortPanel />
        )}
      </div>

      {/* Bottom Apply Bar */}
      <div className="flex w-full items-center justify-between px-5 py-4 bg-white border-t border-[#e9e9e9] shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-[#858585] font-normal leading-4">
            Properties found
          </span>
          <span className="text-base font-semibold text-black leading-5">
            {resultCount.toLocaleString()} Results
          </span>
        </div>

        <button className="flex items-center justify-center px-8 py-3 bg-[#356fa1] rounded-xl text-white text-sm font-medium hover:bg-[#2a5a88] active:bg-[#1f4a72] transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
};
