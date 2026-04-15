import { XIcon } from "lucide-react";
import { Button } from "../../../../components/ui/button";

const sortFilterTabs = [
  {
    id: "sort",
    label: "Sort",
    iconSrc: "https://c.animaapp.com/mniv5syd3Wpj1v/img/component-2.svg",
    iconAlt: "Sort icon",
  },
  {
    id: "filter",
    label: "Filter",
    iconSrc: "https://c.animaapp.com/mniv5syd3Wpj1v/img/component-3.svg",
    iconAlt: "Filter icon",
  },
];

const propertyTypeTabs = [
  {
    id: "residential",
    label: "Residential",
    iconSrc: "https://c.animaapp.com/mniv5syd3Wpj1v/img/material-symbols-home-rounded.svg",
    iconAlt: "Home",
  },
  { id: "commercial", label: "Commercial", iconSrc: null, iconAlt: null },
  { id: "land", label: "Land", iconSrc: null, iconAlt: null },
];

interface FilterSortControlSectionProps {
  activeTab: "sort" | "filter";
  onTabChange: (tab: "sort" | "filter") => void;
  activePropertyType: string;
  onPropertyTypeChange: (type: string) => void;
  onReset: () => void;
  onClose: () => void;
}

export const FilterSortControlSection = ({
  activeTab,
  onTabChange,
  activePropertyType,
  onPropertyTypeChange,
  onReset,
  onClose,
}: FilterSortControlSectionProps): JSX.Element => {
  return (
    <div className="flex flex-col w-full items-center gap-[18px] px-0 py-4 bg-white rounded-[32px_32px_0px_0px]">
      <div className="flex flex-col items-center gap-[18px] self-stretch w-full">
        {/* Drag handle */}
        <div className="w-[74px] h-1.5 bg-[#e9e9e9] rounded-[64px]" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 self-stretch w-full">
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center"
            aria-label="Close"
          >
            <XIcon className="w-5 h-5 text-black" strokeWidth={2} />
          </button>

          <span className="font-medium text-black text-xl leading-5 whitespace-nowrap [font-family:'Roboto',Helvetica]">
            Sort &amp; Filters
          </span>

          <Button
            variant="ghost"
            onClick={onReset}
            className="h-auto p-0 text-[#1879da] text-sm font-medium hover:bg-transparent hover:text-[#1879da]"
          >
            Reset
          </Button>
        </div>

        {/* Sort / Filter toggle */}
        <div className="flex w-[343px] h-12 items-start gap-2.5 p-1 bg-[#ebf1f6] rounded-xl overflow-hidden">
          {sortFilterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as "sort" | "filter")}
              className={`flex items-center justify-center gap-2.5 px-2.5 py-1.5 flex-1 self-stretch rounded-[10px] transition-colors ${
                activeTab === tab.id ? "bg-white shadow-sm" : "bg-transparent"
              }`}
            >
              <span className="text-sm font-medium text-black whitespace-nowrap">
                {tab.label}
              </span>
              <img className="w-4 h-4" alt={tab.iconAlt} src={tab.iconSrc} />
            </button>
          ))}
        </div>

        {/* Property type toggle — only shown in filter mode */}
        {activeTab === "filter" && (
          <div className="flex w-[343px] h-12 items-start gap-2.5 p-1 bg-[#ebf1f6] rounded-xl overflow-hidden">
            {propertyTypeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onPropertyTypeChange(tab.id)}
                className={`flex items-center justify-center gap-2 px-2.5 py-1.5 self-stretch flex-1 rounded-[10px] transition-colors ${
                  activePropertyType === tab.id ? "bg-white shadow-sm" : "bg-transparent"
                }`}
              >
                <span className="text-sm font-medium text-black whitespace-nowrap">
                  {tab.label}
                </span>
                {tab.iconSrc && (
                  <img className="w-5 h-5" alt={tab.iconAlt ?? ""} src={tab.iconSrc} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
