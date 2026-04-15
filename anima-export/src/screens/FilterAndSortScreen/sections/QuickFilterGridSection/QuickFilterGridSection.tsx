import { useRef, useState } from "react";

// Left sidebar filter categories with linked content sections
const filterCategories = [
  { id: "quick-filters", label: "Quick Filters" },
  { id: "budget", label: "Budget" },
  { id: "availability", label: "Availability" },
  { id: "property-type", label: "Property Type" },
  { id: "bhk", label: "BHK" },
  { id: "furnishing-status", label: "Furnishing Status" },
  { id: "area", label: "Area" },
  { id: "bathrooms", label: "Bathrooms" },
  { id: "construction-status", label: "Construction Status" },
  { id: "new-booking-resale", label: "New Booking / Resale" },
  { id: "amenities", label: "Amenities" },
  { id: "location", label: "Location" },
  { id: "floor-preference", label: "Floor Preference" },
  { id: "posted-by", label: "Posted By" },
  { id: "builders", label: "Builders" },
  { id: "projects", label: "Projects" },
  { id: "facing-direction", label: "Facing Direction" },
  { id: "property-features", label: "Property Features" },
  { id: "project-density", label: "Project Density" },
  { id: "rera-approved", label: "RERA Approved" },
];

// Right panel filter options grouped by category
const filterOptionsByCategory: Record<string, { id: string; label: string }[][]> = {
  "quick-filters": [
    [
      { id: "rood-recommended", label: "Rood-recommended" },
      { id: "high-demand", label: "High demand" },
    ],
    [
      { id: "new-launches", label: "New Launches" },
      { id: "zero-brokerage", label: "Zero Brokerage" },
    ],
    [
      { id: "photos", label: "Photos" },
      { id: "videos", label: "Videos" },
    ],
    [
      { id: "corner-property", label: "Corner Property" },
      { id: "park-facing", label: "Park Facing" },
      { id: "gated-society", label: "Gated Society" },
      { id: "road-facing", label: "Road Facing" },
    ],
    [
      { id: "rera-approved-properties", label: "RERA Approved properties" },
      { id: "rera-registered-dealers", label: "RERA registered dealers" },
    ],
    [
      { id: "resale", label: "Resale" },
      { id: "new-booking", label: "New Booking" },
    ],
  ],
  "budget": [
    [
      { id: "under-50l", label: "Under ₹50 Lakh" },
      { id: "50l-1cr", label: "₹50L – ₹1 Cr" },
      { id: "1cr-2cr", label: "₹1 Cr – ₹2 Cr" },
      { id: "2cr-5cr", label: "₹2 Cr – ₹5 Cr" },
      { id: "above-5cr", label: "Above ₹5 Cr" },
    ],
  ],
  "availability": [
    [
      { id: "ready-to-move", label: "Ready to Move" },
      { id: "under-construction", label: "Under Construction" },
    ],
  ],
  "property-type": [
    [
      { id: "apartment", label: "Apartment" },
      { id: "villa", label: "Villa" },
      { id: "plot", label: "Plot" },
      { id: "builder-floor", label: "Builder Floor" },
      { id: "penthouse", label: "Penthouse" },
    ],
  ],
  "bhk": [
    [
      { id: "1bhk", label: "1 BHK" },
      { id: "2bhk", label: "2 BHK" },
      { id: "3bhk", label: "3 BHK" },
      { id: "4bhk", label: "4 BHK" },
      { id: "4plus-bhk", label: "4+ BHK" },
    ],
  ],
  "furnishing-status": [
    [
      { id: "furnished", label: "Furnished" },
      { id: "semi-furnished", label: "Semi-Furnished" },
      { id: "unfurnished", label: "Unfurnished" },
    ],
  ],
  "area": [
    [
      { id: "under-500", label: "Under 500 sq.ft" },
      { id: "500-1000", label: "500 – 1000 sq.ft" },
      { id: "1000-2000", label: "1000 – 2000 sq.ft" },
      { id: "above-2000", label: "Above 2000 sq.ft" },
    ],
  ],
  "bathrooms": [
    [
      { id: "1bath", label: "1 Bath" },
      { id: "2bath", label: "2 Baths" },
      { id: "3bath", label: "3 Baths" },
      { id: "4plus-bath", label: "4+ Baths" },
    ],
  ],
  "construction-status": [
    [
      { id: "new-launch", label: "New Launch" },
      { id: "mid-construction", label: "Mid Construction" },
      { id: "nearing-possession", label: "Nearing Possession" },
      { id: "possession-overdue", label: "Possession Overdue" },
    ],
  ],
  "new-booking-resale": [
    [
      { id: "nb-new-booking", label: "New Booking" },
      { id: "nb-resale", label: "Resale" },
    ],
  ],
  "amenities": [
    [
      { id: "gym", label: "Gym" },
      { id: "swimming-pool", label: "Swimming Pool" },
      { id: "club-house", label: "Club House" },
      { id: "power-backup", label: "Power Backup" },
      { id: "lift", label: "Lift" },
      { id: "security", label: "Security" },
      { id: "park", label: "Park" },
    ],
  ],
  "location": [
    [
      { id: "metro-nearby", label: "Metro Nearby" },
      { id: "school-nearby", label: "School Nearby" },
      { id: "hospital-nearby", label: "Hospital Nearby" },
      { id: "mall-nearby", label: "Mall Nearby" },
    ],
  ],
  "floor-preference": [
    [
      { id: "ground-floor", label: "Ground Floor" },
      { id: "low-rise", label: "Low Rise (1-5)" },
      { id: "mid-rise", label: "Mid Rise (6-15)" },
      { id: "high-rise", label: "High Rise (15+)" },
    ],
  ],
  "posted-by": [
    [
      { id: "owner", label: "Owner" },
      { id: "dealer", label: "Dealer" },
      { id: "builder", label: "Builder" },
    ],
  ],
  "builders": [
    [
      { id: "dlf", label: "DLF" },
      { id: "godrej", label: "Godrej Properties" },
      { id: "prestige", label: "Prestige Group" },
      { id: "lodha", label: "Lodha" },
      { id: "brigade", label: "Brigade Group" },
    ],
  ],
  "projects": [
    [
      { id: "proj-ongoing", label: "Ongoing Projects" },
      { id: "proj-completed", label: "Completed Projects" },
      { id: "proj-upcoming", label: "Upcoming Projects" },
    ],
  ],
  "facing-direction": [
    [
      { id: "north", label: "North" },
      { id: "south", label: "South" },
      { id: "east", label: "East" },
      { id: "west", label: "West" },
      { id: "north-east", label: "North East" },
      { id: "north-west", label: "North West" },
    ],
  ],
  "property-features": [
    [
      { id: "vastu-compliant", label: "Vastu Compliant" },
      { id: "sea-view", label: "Sea View" },
      { id: "garden-facing", label: "Garden Facing" },
      { id: "corner-unit", label: "Corner Unit" },
    ],
  ],
  "project-density": [
    [
      { id: "low-density", label: "Low Density" },
      { id: "medium-density", label: "Medium Density" },
      { id: "high-density", label: "High Density" },
    ],
  ],
  "rera-approved": [
    [
      { id: "rera-yes", label: "RERA Approved" },
      { id: "rera-registered", label: "RERA Registered" },
    ],
  ],
};

const defaultSelected = new Set([
  "rood-recommended",
  "new-launches",
  "photos",
  "corner-property",
]);

interface QuickFilterGridSectionProps {
  activeCategory?: string;
  onCategoryChange?: (id: string) => void;
}

export const QuickFilterGridSection = ({
  activeCategory: externalActiveCategory,
  onCategoryChange,
}: QuickFilterGridSectionProps): JSX.Element => {
  const [internalActiveCategory, setInternalActiveCategory] = useState<string>("quick-filters");
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set(defaultSelected));
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const activeCategory = externalActiveCategory ?? internalActiveCategory;

  const handleCategoryClick = (id: string) => {
    setInternalActiveCategory(id);
    onCategoryChange?.(id);
    if (rightPanelRef.current) {
      rightPanelRef.current.scrollTop = 0;
    }
  };

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => {
    const currentGroups = filterOptionsByCategory[activeCategory] ?? [];
    const currentIds = currentGroups.flat().map((o) => o.id);
    setSelectedOptions((prev) => {
      const next = new Set(prev);
      currentIds.forEach((id) => next.delete(id));
      return next;
    });
  };

  const currentGroups = filterOptionsByCategory[activeCategory] ?? [];

  return (
    <div className="flex w-full flex-1 items-start border-t border-solid border-[#e9e9e9] overflow-hidden">
      {/* Left sidebar - filter categories */}
      <div className="flex flex-col w-[122px] shrink-0 items-start bg-[#ebf1f6] self-stretch overflow-y-auto">
        {filterCategories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center gap-2.5 px-4 py-3 self-stretch w-full border-b border-solid border-[#e9e9e9] cursor-pointer text-left transition-colors ${
                isActive
                  ? "bg-white border-l-[4px] border-l-[#356fa1]"
                  : "bg-[#ebf1f6] border-l-[4px] border-l-transparent"
              }`}
            >
              <span
                className={`text-xs leading-[1.3] break-words ${
                  isActive
                    ? "font-medium text-[#356fa1]"
                    : "font-normal text-[#616363]"
                }`}
              >
                {category.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right panel - filter option pills */}
      <div
        ref={rightPanelRef}
        className="flex flex-col flex-1 items-start gap-5 px-4 py-6 self-stretch overflow-y-auto"
      >
        {/* Category title */}
        <span className="text-sm font-medium text-black leading-5 w-full">
          {filterCategories.find((c) => c.id === activeCategory)?.label ?? ""}
        </span>

        {currentGroups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="flex flex-wrap items-start gap-3 self-stretch w-full"
          >
            {group.map((option) => {
              const isSelected = selectedOptions.has(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[50px] overflow-hidden border border-solid cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#ebf1f6] border-[#356fa1]"
                      : "bg-white border-[#e9e9e9] hover:border-[#356fa1]"
                  }`}
                >
                  {isSelected && (
                    <img
                      className="w-4 h-4 shrink-0"
                      alt="Selected"
                      src="https://c.animaapp.com/mniv5syd3Wpj1v/img/teenyicons-tick-circle-solid.svg"
                    />
                  )}
                  <span
                    className={`text-xs leading-5 whitespace-nowrap ${
                      isSelected
                        ? "font-medium text-[#356fa1]"
                        : "font-normal text-[#858585]"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        ))}

        {/* Separator */}
        {currentGroups.length > 0 && (
          <div className="w-full h-[1px] bg-[#e9e9e9]" />
        )}

        {/* Clear Selection link */}
        <button
          onClick={clearSelection}
          className="text-sm font-medium text-[#1879da] cursor-pointer bg-transparent border-none p-0 hover:underline"
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
};
