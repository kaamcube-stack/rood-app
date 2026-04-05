import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, radius, shadows } from '../../theme/theme';

// ── Data ──────────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  'Relevance',
  'Newest first',
  'Price : Low to High',
  'Price : High to Low',
  'Price / sq.ft : Low to High',
  'Price / sq.ft : High to Low',
];

const PROPERTY_TYPES = [
  { key: 'residential', label: 'Residential', icon: 'home' },
  { key: 'commercial',  label: 'Commercial',  icon: null },
  { key: 'land',        label: 'Land',        icon: null },
] as const;

const FILTER_CATEGORIES = [
  'Quick Filters',
  'Location',
  'Budget',
  'Availability',
  'Property Type',
  'BHK',
  'Construction Status',
  'Furnishing Status',
  'Area',
  'Bathrooms',
  'New Booking / Resale',
  'Amenities',
  'Floor Preference',
  'Posted By',
  'Builders',
  'Projects',
  'Facing Direction',
  'Property Features',
  'Project Density',
];

const QUICK_FILTERS = [
  'Rood-recommended',
  'High demand',
  'New Launches',
  'Zero Brokerage',
  'Photos',
  'Videos',
  'Corner Property',
  'Park Facing',
  'Gated Society',
  'Road Facing',
  'Having boundary wall',
  'RERA Approved properties',
  'RERA registered dealers',
  'Resale',
];

const BHK_OPTIONS = ['1RK/ 1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK'];
const BATHROOM_OPTIONS = ['1 +', '2 +', '3 +', '4 +', '5 +'];
const FURNISHING_OPTIONS = ['Unfurnished', 'Semi - Furnished', 'Fully Furnished'];
const AVAILABILITY_OPTIONS = ['Immediately', 'Within 15 Days', 'Within 30 Days', 'After 30 Days'];

const AGE_OF_PROPERTY_OPTIONS = ['0-1 year old', '1-5 year old', '5-10 year old', '10+ year old'];

const POPULAR_PROJECTS = ['Kolte Patil', 'Godrej Properties', 'Oberoi Realty', 'L&T Realty'];
const ALL_PROJECTS = [
  'Kolte Patil', 'Godrej Properties', 'Oberoi Realty', 'L&T Realty',
  'Hiranandani Developers', 'Tata Housing', 'Mahindra Lifespace',
  'Paravankara Limited', 'Panchavati Foods', 'Paladin Technologies',
  'Pavillion Enterprises', 'Paragon Solutions', 'Paradigm Innovations',
  'Palladium Ventures', 'Phoenix Mills', 'Prestige Group',
];

const POPULAR_BUILDERS = ['Kolte Patil', 'Godrej Properties', 'Oberoi Realty', 'L&T Realty'];
const ALL_BUILDERS = [
  'Kolte Patil', 'Godrej Properties', 'Oberoi Realty', 'L&T Realty',
  'Hiranandani Developers', 'Tata Housing', 'Mahindra Lifespace',
  'Paravankara Limited', 'Panchavati Foods', 'Paladin Technologies',
  'Pavillion Enterprises', 'Paragon Solutions', 'Paradigm Innovations',
  'Palladium Ventures', 'Phoenix Mills', 'Prestige Group',
];

const NEARBY_LOCALITIES = ['Wardhe', 'Pimpri', 'Chincwad', 'Wakawaka'];
const MOST_SEARCHED_LOCATIONS = ['Kharadi', 'Hinjewadi', 'Hadapsar', 'Undri'];
const ALL_LOCATIONS = [
  'Kharadi', 'Hinjewadi', 'Hadapsar', 'Undri', 'Wakad Phase 1', 'Wakad',
  'Wakarusa', 'Wakawaka', 'Wakimoto', 'Wagholi', 'Baner', 'Pimpri',
  'Chincwad', 'Wardhe', 'Kothrud', 'Baner Pashan Link Road',
  'Aundh Road', 'Nagar Road', 'Viman Nagar',
];

// ── Floor Preference data ─────────────────────────────────────────────────────

type BuildingHeight = 'all' | 'highRise' | 'midRise' | 'lowRise';

const FLOOR_OPTIONS: Record<BuildingHeight, string[]> = {
  all:      ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor', '6th - 9th Floor', '10th - 14th Floor', '15th - 19th Floor', '20th+ Floor'],
  highRise: ['1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor', '6th - 9th Floor', '10th - 14th Floor', '15th - 19th Floor', '20th+ Floor'],
  midRise:  ['1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor', '6th - 9th Floor'],
  lowRise:  ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor'],
};

const BUILDING_HEIGHT_LABELS: Record<BuildingHeight, string> = {
  all:      'All',
  highRise: 'High Rise',
  midRise:  'Mid Rise',
  lowRise:  'Low Rise',
};

const BUILDING_HEIGHT_INFO = [
  { label: 'Low-rise',  desc: 'Buildings with one to four stories' },
  { label: 'Mid-rise',  desc: 'Buildings with five to ten stories' },
  { label: 'High-rise', desc: 'Buildings with more than ten stories' },
];

const PROJECT_DENSITY_OPTIONS = ['Low', 'Medium', 'High'];
const POSTED_BY_OPTIONS = ['Owner', 'Builder', 'Dealer', 'Featured Dealer'];

const FACING_DIRECTION_OPTIONS = [
  'East Facing', 'North Facing', 'West Facing', 'South Facing',
  'North-East Facing', 'North-West Facing', 'South-East Facing', 'South-West Facing',
];

const AMENITIES_OPTIONS = [
  'Parking', 'Club House', 'Power Backup', 'Vaastu Compliant', 'Park',
  'Gymnasium', 'Lift', 'Swimming Pool', 'Security Guard', 'Gas Pipeline',
];
const POSSESSION_OPTIONS = ['In 3 months', 'In 6 months', 'In 2026', 'In 2027', 'In 2028', 'In 2029', 'In 2030', 'In 2031', 'After 2032'];

const PROPERTY_TYPE_OPTIONS: Record<'residential' | 'commercial' | 'land', string[]> = {
  residential: [
    'Apartments',
    'Independent House/Villas',
    'Builder Projects',
    'Studio Apartment',
    'Penthouse',
    'Farmhouse',
    'Serviced Apartment',
  ],
  commercial: [
    'Office Space',
    'Shop / Showroom',
    'Warehouse / Godown',
    'Industrial Building',
    'Industrial Shed',
    'Commercial Land',
    'Hotel / Resorts',
    'Co-working Space',
  ],
  land: [
    'Residential Land / Plot',
    'Commercial Land',
    'Agricultural Land',
    'Industrial Land',
    'Farm Land',
  ],
};

// ── Area data ─────────────────────────────────────────────────────────────────

const AREA_UNITS = ['sq.yards', 'sq.ft.', 'sq.meters', 'acres', 'bigha', 'hectares', 'rood'] as const;
type AreaUnit = typeof AREA_UNITS[number];

// Values in the unit selected; increments of 100 from 100 to 4000
const AREA_OPTIONS: { label: string; value: number }[] = Array.from({ length: 40 }, (_, i) => ({
  label: String((i + 1) * 100),
  value: (i + 1) * 100,
}));

// ── Numeric values in Lakhs for comparison ────────────────────────────────────
const BUDGET_OPTIONS: { label: string; value: number }[] = [
  { label: '5 L',    value: 5 },
  { label: '10 L',   value: 10 },
  { label: '15 L',   value: 15 },
  { label: '20 L',   value: 20 },
  { label: '25 L',   value: 25 },
  { label: '30 L',   value: 30 },
  { label: '35 L',   value: 35 },
  { label: '40 L',   value: 40 },
  { label: '45 L',   value: 45 },
  { label: '50 L',   value: 50 },
  { label: '60 L',   value: 60 },
  { label: '70 L',   value: 70 },
  { label: '80 L',   value: 80 },
  { label: '90 L',   value: 90 },
  { label: '1 Cr',   value: 100 },
  { label: '1.5 Cr', value: 150 },
  { label: '2 Cr',   value: 200 },
  { label: '2.5 Cr', value: 250 },
  { label: '3 Cr',   value: 300 },
  { label: '3.5 Cr', value: 350 },
  { label: '4 Cr',   value: 400 },
  { label: '4.5 Cr', value: 450 },
  { label: '5 Cr',   value: 500 },
  { label: '6 Cr',   value: 600 },
  { label: '7 Cr',   value: 700 },
  { label: '8 Cr',   value: 800 },
  { label: '9 Cr',   value: 900 },
  { label: '10 Cr',  value: 1000 },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function RadioOption({ label, selected, onPress }: {
  label: string; selected: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.radioRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

// Budget value pill — selected = blue with checkmark, unselected = plain text
function BudgetPill({ label, selected, onPress }: {
  label: string; selected: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.budgetPill, selected && styles.budgetPillSelected]}
    >
      {selected && (
        <Ionicons name="checkmark-circle" size={14} color={colors.brand} style={{ marginRight: 4 }} />
      )}
      <Text style={[styles.budgetPillText, selected && styles.budgetPillTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ── Budget panel ──────────────────────────────────────────────────────────────

function BudgetPanel({
  minBudget, maxBudget, onSetMin, onSetMax,
}: {
  minBudget: number | null;
  maxBudget: number | null;
  onSetMin: (v: number | null) => void;
  onSetMax: (v: number | null) => void;
}) {
  // Filter: min list only shows values strictly less than selected max
  const minOptions = BUDGET_OPTIONS.filter(
    (o) => maxBudget === null || o.value < maxBudget,
  );
  // Filter: max list only shows values strictly greater than selected min
  const maxOptions = BUDGET_OPTIONS.filter(
    (o) => minBudget === null || o.value > minBudget,
  );

  const minLabel = BUDGET_OPTIONS.find((o) => o.value === minBudget)?.label ?? 'NA';
  const maxLabel = BUDGET_OPTIONS.find((o) => o.value === maxBudget)?.label ?? 'NA';

  return (
    <View style={styles.budgetWrap}>
      {/* MIN / MAX header */}
      <View style={styles.budgetHeader}>
        <View style={styles.budgetHeaderSide}>
          <Text style={styles.budgetHeaderLabel}>MIN</Text>
          <Text style={styles.budgetHeaderValue}>₹ {minLabel}</Text>
        </View>
        <Text style={styles.budgetHeaderDash}>—</Text>
        <View style={[styles.budgetHeaderSide, { alignItems: 'flex-end' }]}>
          <Text style={styles.budgetHeaderLabel}>MAX</Text>
          <Text style={styles.budgetHeaderValue}>₹ {maxLabel}</Text>
        </View>
      </View>

      {/* No min / No max chips */}
      <View style={styles.budgetNoRow}>
        <TouchableOpacity
          onPress={() => onSetMin(null)}
          style={[styles.noChip, minBudget === null && styles.noChipSelected]}
        >
          {minBudget === null && (
            <Ionicons name="checkmark-circle" size={14} color={colors.white} style={{ marginRight: 4 }} />
          )}
          <Text style={[styles.noChipText, minBudget === null && styles.noChipTextSelected]}>
            No min
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSetMax(null)}
          style={[styles.noChip, maxBudget === null && styles.noChipSelected]}
        >
          {maxBudget === null && (
            <Ionicons name="checkmark-circle" size={14} color={colors.white} style={{ marginRight: 4 }} />
          )}
          <Text style={[styles.noChipText, maxBudget === null && styles.noChipTextSelected]}>
            No max
          </Text>
        </TouchableOpacity>
      </View>

      {/* Two-column value list */}
      <View style={styles.budgetColumns}>
        {/* MIN column */}
        <View style={styles.budgetCol}>
          {minOptions.map((opt) => (
            <BudgetPill
              key={`min-${opt.value}`}
              label={opt.label}
              selected={minBudget === opt.value}
              onPress={() => onSetMin(minBudget === opt.value ? null : opt.value)}
            />
          ))}
        </View>

        {/* MAX column */}
        <View style={styles.budgetCol}>
          {maxOptions.map((opt) => (
            <BudgetPill
              key={`max-${opt.value}`}
              label={opt.label}
              selected={maxBudget === opt.value}
              onPress={() => onSetMax(maxBudget === opt.value ? null : opt.value)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

// ── Area panel ────────────────────────────────────────────────────────────────

function AreaPanel({
  unit, minArea, maxArea, onSetUnit, onSetMin, onSetMax,
}: {
  unit: AreaUnit;
  minArea: number | null;
  maxArea: number | null;
  onSetUnit: (u: AreaUnit) => void;
  onSetMin: (v: number | null) => void;
  onSetMax: (v: number | null) => void;
}) {
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const minOptions = AREA_OPTIONS.filter((o) => maxArea === null || o.value < maxArea);
  const maxOptions = AREA_OPTIONS.filter((o) => minArea === null || o.value > minArea);

  const minLabel = AREA_OPTIONS.find((o) => o.value === minArea)?.label ?? 'NA';
  const maxLabel = AREA_OPTIONS.find((o) => o.value === maxArea)?.label ?? 'NA';

  return (
    <View style={styles.budgetWrap}>
      {/* Unit dropdown trigger */}
      <TouchableOpacity
        style={styles.areaUnitTrigger}
        onPress={() => setShowUnitPicker((v) => !v)}
        activeOpacity={0.75}
      >
        <Text style={styles.areaUnitLabel}>
          Size in <Text style={styles.areaUnitUnderline}>{unit}</Text>
        </Text>
        <Ionicons
          name={showUnitPicker ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textPrimary}
        />
      </TouchableOpacity>

      {/* Unit picker dropdown */}
      {showUnitPicker && (
        <View style={styles.areaUnitDropdown}>
          {AREA_UNITS.map((u) => (
            <RadioOption
              key={u}
              label={u}
              selected={unit === u}
              onPress={() => { onSetUnit(u); setShowUnitPicker(false); }}
            />
          ))}
        </View>
      )}

      {!showUnitPicker && (
        <>
          {/* MIN / MAX header */}
          <View style={styles.budgetHeader}>
            <View style={styles.budgetHeaderSide}>
              <Text style={styles.budgetHeaderLabel}>MIN</Text>
              <Text style={styles.budgetHeaderValue}>
                {minArea !== null ? `${minLabel} ${unit}` : 'NA'}
              </Text>
            </View>
            <Text style={styles.budgetHeaderDash}>—</Text>
            <View style={[styles.budgetHeaderSide, { alignItems: 'flex-end' }]}>
              <Text style={styles.budgetHeaderLabel}>MAX</Text>
              <Text style={styles.budgetHeaderValue}>
                {maxArea !== null ? `${maxLabel} ${unit}` : 'NA'}
              </Text>
            </View>
          </View>

          {/* No min / No max chips */}
          <View style={styles.budgetNoRow}>
            <TouchableOpacity
              onPress={() => onSetMin(null)}
              style={[styles.noChip, minArea === null && styles.noChipSelected]}
            >
              {minArea === null && (
                <Ionicons name="checkmark-circle" size={14} color={colors.white} style={{ marginRight: 4 }} />
              )}
              <Text style={[styles.noChipText, minArea === null && styles.noChipTextSelected]}>
                No min
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onSetMax(null)}
              style={[styles.noChip, maxArea === null && styles.noChipSelected]}
            >
              {maxArea === null && (
                <Ionicons name="checkmark-circle" size={14} color={colors.white} style={{ marginRight: 4 }} />
              )}
              <Text style={[styles.noChipText, maxArea === null && styles.noChipTextSelected]}>
                No max
              </Text>
            </TouchableOpacity>
          </View>

          {/* Two-column value list */}
          <View style={styles.budgetColumns}>
            <View style={styles.budgetCol}>
              {minOptions.map((opt) => (
                <BudgetPill
                  key={`amin-${opt.value}`}
                  label={opt.label}
                  selected={minArea === opt.value}
                  onPress={() => onSetMin(minArea === opt.value ? null : opt.value)}
                />
              ))}
            </View>
            <View style={styles.budgetCol}>
              {maxOptions.map((opt) => (
                <BudgetPill
                  key={`amax-${opt.value}`}
                  label={opt.label}
                  selected={maxArea === opt.value}
                  onPress={() => onSetMax(maxArea === opt.value ? null : opt.value)}
                />
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function FilterScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab]         = useState<'sort' | 'filter'>('filter');
  const [sortOption, setSortOption]       = useState('Relevance');
  const [propertyType, setPropertyType]   = useState<'residential' | 'commercial' | 'land'>('residential');
  const [activeCategory, setActiveCategory] = useState('Quick Filters');
  const [quickFilters, setQuickFilters]   = useState<string[]>([
    'Rood-recommended', 'New Launches', 'Photos', 'Corner Property',
  ]);
  const [minBudget, setMinBudget]         = useState<number | null>(null);
  const [maxBudget, setMaxBudget]         = useState<number | null>(null);
  const [propTypeFilter, setPropTypeFilter] = useState<string[]>(['Apartments']);
  const [areaUnit, setAreaUnit]           = useState<AreaUnit>('sq.ft.');
  const [minArea, setMinArea]             = useState<number | null>(null);
  const [maxArea, setMaxArea]             = useState<number | null>(null);
  const [bhkFilter, setBhkFilter]         = useState<string[]>([]);
  const [projectSearch, setProjectSearch]         = useState('');
  const [selectedProjects, setSelectedProjects]   = useState<string[]>([]);
  const [pendingProjects, setPendingProjects]     = useState<string[]>([]);
  const [builderSearch, setBuilderSearch]         = useState('');
  const [selectedBuilders, setSelectedBuilders]   = useState<string[]>([]);
  const [pendingBuilders, setPendingBuilders]     = useState<string[]>([]);
  const [locationSearch, setLocationSearch]     = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [pendingLocations, setPendingLocations]   = useState<string[]>([]);
  const [amenities, setAmenities]         = useState<string[]>([]);
  const [constructionStatus, setConstructionStatus] = useState<string[]>([]);
  const [ageOfProperty, setAgeOfProperty] = useState<string[]>([]);
  const [possession, setPossession]       = useState<string[]>([]);
  const [availability, setAvailability]     = useState<string[]>([]);
  const [furnishingStatus, setFurnishingStatus] = useState<string[]>([]);
  const [bathrooms, setBathrooms]           = useState<string | null>(null);
  const [postedBy, setPostedBy]             = useState<string[]>([]);
  const [projectDensity, setProjectDensity] = useState<string[]>([]);
  const [facingDirection, setFacingDirection] = useState<string[]>([]);
  const [buildingHeight, setBuildingHeight] = useState<BuildingHeight>('all');
  const [floorNumbers, setFloorNumbers]   = useState<string[]>([]);
  const [showHeightInfo, setShowHeightInfo] = useState(false);

  const toggleQuickFilter = (f: string) =>
    setQuickFilters((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  const handleReset = () => {
    setSortOption('Relevance');
    setPropertyType('residential');
    setQuickFilters([]);
    setMinBudget(null);
    setMaxBudget(null);
    setPropTypeFilter([]);
    setAreaUnit('sq.ft.');
    setMinArea(null);
    setMaxArea(null);
    setBhkFilter([]);
    setProjectSearch('');
    setSelectedProjects([]);
    setPendingProjects([]);
    setBuilderSearch('');
    setSelectedBuilders([]);
    setPendingBuilders([]);
    setLocationSearch('');
    setSelectedLocations([]);
    setPendingLocations([]);
    setAmenities([]);
    setConstructionStatus([]);
    setAgeOfProperty([]);
    setPossession([]);
    setAvailability([]);
    setFurnishingStatus([]);
    setBathrooms(null);
    setPostedBy([]);
    setProjectDensity([]);
    setFacingDirection([]);
    setBuildingHeight('all');
    setFloorNumbers([]);
    setShowHeightInfo(false);
  };

  const handleSetMin = (v: number | null) => {
    setMinBudget(v);
    // If new min >= current max, clear max
    if (v !== null && maxBudget !== null && v >= maxBudget) setMaxBudget(null);
  };

  const handleSetMax = (v: number | null) => {
    setMaxBudget(v);
    // If new max <= current min, clear min
    if (v !== null && minBudget !== null && v <= minBudget) setMinBudget(null);
  };

  const applyProjectSearch = () => {
    setSelectedProjects((prev) => [...new Set([...prev, ...pendingProjects])]);
    setPendingProjects([]);
    setProjectSearch('');
  };

  const projectSearchResults = projectSearch.length > 0
    ? ALL_PROJECTS.filter((p) => p.toLowerCase().includes(projectSearch.toLowerCase()))
    : [];

  const applyBuilderSearch = () => {
    setSelectedBuilders((prev) => [...new Set([...prev, ...pendingBuilders])]);
    setPendingBuilders([]);
    setBuilderSearch('');
  };

  const builderSearchResults = builderSearch.length > 0
    ? ALL_BUILDERS.filter((b) => b.toLowerCase().includes(builderSearch.toLowerCase()))
    : [];

  const applyLocationSearch = () => {
    setSelectedLocations((prev) => [...new Set([...prev, ...pendingLocations])]);
    setPendingLocations([]);
    setLocationSearch('');
  };

  const searchResults = locationSearch.length > 0
    ? ALL_LOCATIONS.filter((l) => l.toLowerCase().includes(locationSearch.toLowerCase()))
    : [];

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) =>
    setList((prev) => prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]);

  const handleSetMinArea = (v: number | null) => {
    setMinArea(v);
    if (v !== null && maxArea !== null && v >= maxArea) setMaxArea(null);
  };

  const handleSetMaxArea = (v: number | null) => {
    setMaxArea(v);
    if (v !== null && minArea !== null && v <= minArea) setMinArea(null);
  };

  return (
    <View style={[styles.sheet, { paddingBottom: insets.bottom }]}>
      {/* Drag handle */}
      <View style={styles.handle} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sort & Filters</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Sort / Filter tab switcher */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'sort' && styles.tabBtnActive]}
          onPress={() => setActiveTab('sort')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabBtnText, activeTab === 'sort' && styles.tabBtnTextActive]}>Sort</Text>
          <Ionicons name="funnel-outline" size={14}
            color={activeTab === 'sort' ? colors.textPrimary : colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'filter' && styles.tabBtnActive]}
          onPress={() => setActiveTab('filter')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabBtnText, activeTab === 'filter' && styles.tabBtnTextActive]}>Filter</Text>
          <MaterialCommunityIcons name="sort" size={16}
            color={activeTab === 'filter' ? colors.textPrimary : colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* ── Sort panel ── */}
      {activeTab === 'sort' && (
        <ScrollView style={styles.sortPanel} showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sortContent}>
          {SORT_OPTIONS.map((opt) => (
            <RadioOption key={opt} label={opt} selected={sortOption === opt}
              onPress={() => setSortOption(opt)} />
          ))}
        </ScrollView>
      )}

      {/* ── Filter panel ── */}
      {activeTab === 'filter' && (
        <View style={styles.filterPanel}>
          {/* Property type toggle */}
          <View style={styles.propTypeRow}>
            {PROPERTY_TYPES.map((pt) => {
              const isActive = propertyType === pt.key;
              return (
                <TouchableOpacity key={pt.key}
                  style={[styles.propTypeBtn, isActive && styles.propTypeBtnActive]}
                  onPress={() => setPropertyType(pt.key)} activeOpacity={0.8}>
                  <Text
                    style={[styles.propTypeBtnText, isActive && styles.propTypeBtnTextActive]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                  >
                    {pt.label}
                  </Text>
                  {pt.icon && isActive && (
                    <Ionicons name={pt.icon as any} size={14} color={colors.textPrimary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Sidebar + content */}
          <View style={styles.filterBody}>
            {/* Left sidebar */}
            <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
              {FILTER_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <TouchableOpacity key={cat}
                    style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
                    onPress={() => setActiveCategory(cat)} activeOpacity={0.75}>
                    {isActive && <View style={styles.sidebarActiveBar} />}
                    <Text style={[styles.sidebarText, isActive && styles.sidebarTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Right content */}
            <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.filterContentInner}>

              {/* Quick Filters */}
              {activeCategory === 'Quick Filters' && (
                <View style={styles.quickFiltersWrap}>
                  {QUICK_FILTERS.map((f) => {
                    const isSelected = quickFilters.includes(f);
                    return (
                      <TouchableOpacity key={f}
                        style={[styles.qfChip, isSelected && styles.qfChipSelected]}
                        onPress={() => toggleQuickFilter(f)} activeOpacity={0.75}>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                            style={{ marginRight: spacing.xs }} />
                        )}
                        <Text style={[styles.qfChipText, isSelected && styles.qfChipTextSelected]}>
                          {f}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  {quickFilters.length > 0 && (
                    <TouchableOpacity onPress={() => setQuickFilters([])}>
                      <Text style={styles.clearText}>Clear Selection</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Budget */}
              {activeCategory === 'Budget' && (
                <BudgetPanel
                  minBudget={minBudget}
                  maxBudget={maxBudget}
                  onSetMin={handleSetMin}
                  onSetMax={handleSetMax}
                />
              )}

              {/* Property Type */}
              {activeCategory === 'Property Type' && (
                <View style={styles.quickFiltersWrap}>
                  {PROPERTY_TYPE_OPTIONS[propertyType].map((pt) => {
                    const isSelected = propTypeFilter.includes(pt);
                    return (
                      <TouchableOpacity
                        key={pt}
                        style={[styles.qfChip, isSelected && styles.qfChipSelected]}
                        onPress={() =>
                          setPropTypeFilter((prev) =>
                            prev.includes(pt) ? prev.filter((x) => x !== pt) : [...prev, pt],
                          )
                        }
                        activeOpacity={0.75}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                            style={{ marginRight: spacing.xs }} />
                        )}
                        <Text style={[styles.qfChipText, isSelected && styles.qfChipTextSelected]}>
                          {pt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  {propTypeFilter.length > 0 && (
                    <TouchableOpacity onPress={() => setPropTypeFilter([])}>
                      <Text style={styles.clearText}>Clear Selection</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Projects */}
              {activeCategory === 'Projects' && (
                <View style={styles.locWrap}>
                  <View style={styles.locSearchBar}>
                    <Ionicons name="search-outline" size={16} color={colors.textMuted} />
                    <TextInput
                      style={styles.locSearchInput}
                      placeholder="Search Projects"
                      placeholderTextColor={colors.textMuted}
                      value={projectSearch}
                      onChangeText={(t) => { setProjectSearch(t); setPendingProjects([]); }}
                    />
                    {projectSearch.length > 0 && (
                      <TouchableOpacity onPress={() => { setProjectSearch(''); setPendingProjects([]); }}>
                        <Ionicons name="close-circle" size={16} color={colors.textMuted} />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Search dropdown */}
                  {projectSearch.length > 0 && (
                    <View style={styles.locDropdown}>
                      <View style={styles.locDropdownList}>
                        {projectSearchResults.map((p) => {
                          const isPending = pendingProjects.includes(p);
                          return (
                            <TouchableOpacity
                              key={p}
                              style={[styles.bhkChip, isPending && styles.bhkChipSelected]}
                              onPress={() =>
                                setPendingProjects((prev) =>
                                  prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
                                )
                              }
                              activeOpacity={0.75}
                            >
                              {isPending && (
                                <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                                  style={{ marginRight: 6 }} />
                              )}
                              <Text style={[styles.bhkChipText, isPending && styles.bhkChipTextSelected]}>
                                {p}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                      {pendingProjects.length > 0 && (
                        <TouchableOpacity style={styles.locApplyBtn} onPress={applyProjectSearch}>
                          <Text style={styles.locApplyBtnText}>Apply</Text>
                          <Ionicons name="checkmark" size={16} color={colors.white} />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {/* Default state */}
                  {projectSearch.length === 0 && (
                    <>
                      {selectedProjects.filter((p) => !POPULAR_PROJECTS.includes(p)).length > 0 && (
                        <View style={styles.locSection}>
                          <Text style={styles.csSubLabel}>Selected Projects</Text>
                          {selectedProjects
                            .filter((p) => !POPULAR_PROJECTS.includes(p))
                            .map((p) => (
                              <TouchableOpacity
                                key={p}
                                style={[styles.bhkChip, styles.bhkChipSelected]}
                                onPress={() =>
                                  setSelectedProjects((prev) => prev.filter((x) => x !== p))
                                }
                                activeOpacity={0.75}
                              >
                                <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                                  style={{ marginRight: 6 }} />
                                <Text style={[styles.bhkChipText, styles.bhkChipTextSelected]}>{p}</Text>
                              </TouchableOpacity>
                            ))}
                        </View>
                      )}

                      <View style={styles.locSection}>
                        <Text style={styles.csSubLabel}>Popular Projects</Text>
                        {POPULAR_PROJECTS.map((p) => {
                          const isSel = selectedProjects.includes(p);
                          return (
                            <TouchableOpacity
                              key={p}
                              style={[styles.bhkChip, isSel && styles.bhkChipSelected]}
                              onPress={() => toggleItem(selectedProjects, setSelectedProjects, p)}
                              activeOpacity={0.75}
                            >
                              {isSel && (
                                <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                                  style={{ marginRight: 6 }} />
                              )}
                              <Text style={[styles.bhkChipText, isSel && styles.bhkChipTextSelected]}>
                                {p}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                        {selectedProjects.length === 0 ? (
                          <TouchableOpacity
                            onPress={() => setSelectedProjects([...POPULAR_PROJECTS])}
                          >
                            <Text style={styles.clearText}>Select All</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => setSelectedProjects([])}>
                            <Text style={styles.clearText}>Clear Selection</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </>
                  )}
                </View>
              )}

              {/* Builders */}
              {activeCategory === 'Builders' && (
                <View style={styles.locWrap}>
                  {/* Search bar */}
                  <View style={styles.locSearchBar}>
                    <Ionicons name="search-outline" size={16} color={colors.textMuted} />
                    <TextInput
                      style={styles.locSearchInput}
                      placeholder="Search Builders"
                      placeholderTextColor={colors.textMuted}
                      value={builderSearch}
                      onChangeText={(t) => { setBuilderSearch(t); setPendingBuilders([]); }}
                    />
                    {builderSearch.length > 0 && (
                      <TouchableOpacity onPress={() => { setBuilderSearch(''); setPendingBuilders([]); }}>
                        <Ionicons name="close-circle" size={16} color={colors.textMuted} />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Search dropdown */}
                  {builderSearch.length > 0 && (
                    <View style={styles.locDropdown}>
                      <View style={styles.locDropdownList}>
                        {builderSearchResults.map((b) => {
                          const isPending = pendingBuilders.includes(b);
                          return (
                            <TouchableOpacity
                              key={b}
                              style={[styles.bhkChip, isPending && styles.bhkChipSelected]}
                              onPress={() =>
                                setPendingBuilders((prev) =>
                                  prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b],
                                )
                              }
                              activeOpacity={0.75}
                            >
                              {isPending && (
                                <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                                  style={{ marginRight: 6 }} />
                              )}
                              <Text style={[styles.bhkChipText, isPending && styles.bhkChipTextSelected]}>
                                {b}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                      {pendingBuilders.length > 0 && (
                        <TouchableOpacity style={styles.locApplyBtn} onPress={applyBuilderSearch}>
                          <Text style={styles.locApplyBtnText}>Apply</Text>
                          <Ionicons name="checkmark" size={16} color={colors.white} />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {/* Default state (no search) */}
                  {builderSearch.length === 0 && (
                    <>
                      {/* Selected Builders — only non-popular ones from search */}
                      {selectedBuilders.filter((b) => !POPULAR_BUILDERS.includes(b)).length > 0 && (
                        <View style={styles.locSection}>
                          <Text style={styles.csSubLabel}>Selected Builders</Text>
                          {selectedBuilders
                            .filter((b) => !POPULAR_BUILDERS.includes(b))
                            .map((b) => (
                              <TouchableOpacity
                                key={b}
                                style={[styles.bhkChip, styles.bhkChipSelected]}
                                onPress={() =>
                                  setSelectedBuilders((prev) => prev.filter((x) => x !== b))
                                }
                                activeOpacity={0.75}
                              >
                                <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                                  style={{ marginRight: 6 }} />
                                <Text style={[styles.bhkChipText, styles.bhkChipTextSelected]}>{b}</Text>
                              </TouchableOpacity>
                            ))}
                        </View>
                      )}

                      {/* Popular Builders — inline toggle */}
                      <View style={styles.locSection}>
                        <Text style={styles.csSubLabel}>Popular Builders</Text>
                        {POPULAR_BUILDERS.map((b) => {
                          const isSel = selectedBuilders.includes(b);
                          return (
                            <TouchableOpacity
                              key={b}
                              style={[styles.bhkChip, isSel && styles.bhkChipSelected]}
                              onPress={() => toggleItem(selectedBuilders, setSelectedBuilders, b)}
                              activeOpacity={0.75}
                            >
                              {isSel && (
                                <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                                  style={{ marginRight: 6 }} />
                              )}
                              <Text style={[styles.bhkChipText, isSel && styles.bhkChipTextSelected]}>
                                {b}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                        {selectedBuilders.length === 0 ? (
                          <TouchableOpacity
                            onPress={() => setSelectedBuilders([...POPULAR_BUILDERS])}
                          >
                            <Text style={styles.clearText}>Select All</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => setSelectedBuilders([])}>
                            <Text style={styles.clearText}>Clear Selection</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </>
                  )}
                </View>
              )}

              {/* Location */}
              {activeCategory === 'Location' && (
                <View style={styles.locWrap}>
                  {/* Search bar */}
                  <View style={styles.locSearchBar}>
                    <Ionicons name="search-outline" size={16} color={colors.textMuted} />
                    <TextInput
                      style={styles.locSearchInput}
                      placeholder="Search Location"
                      placeholderTextColor={colors.textMuted}
                      value={locationSearch}
                      onChangeText={(t) => { setLocationSearch(t); setPendingLocations([]); }}
                    />
                    {locationSearch.length > 0 && (
                      <TouchableOpacity onPress={() => { setLocationSearch(''); setPendingLocations([]); }}>
                        <Ionicons name="close-circle" size={16} color={colors.textMuted} />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Search results dropdown */}
                  {locationSearch.length > 0 && (
                    <View style={styles.locDropdown}>
                      <TouchableOpacity style={styles.locCurrentLocation} activeOpacity={0.7}>
                        <Ionicons name="location" size={14} color={colors.textPrimary} />
                        <Text style={styles.locCurrentLocationText}>Use my current location</Text>
                      </TouchableOpacity>
                      <View style={styles.locDropdownList}>
                        {searchResults.map((loc) => {
                          const isPending = pendingLocations.includes(loc);
                          return (
                            <TouchableOpacity
                              key={loc}
                              style={[styles.bhkChip, isPending && styles.bhkChipSelected]}
                              onPress={() =>
                                setPendingLocations((prev) =>
                                  prev.includes(loc) ? prev.filter((x) => x !== loc) : [...prev, loc],
                                )
                              }
                              activeOpacity={0.75}
                            >
                              {isPending && (
                                <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                                  style={{ marginRight: 6 }} />
                              )}
                              <Text style={[styles.bhkChipText, isPending && styles.bhkChipTextSelected]}>
                                {loc}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                      {pendingLocations.length > 0 && (
                        <TouchableOpacity style={styles.locApplyBtn} onPress={applyLocationSearch}>
                          <Text style={styles.locApplyBtnText}>Apply</Text>
                          <Ionicons name="checkmark" size={16} color={colors.white} />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {/* Default state (no search) */}
                  {locationSearch.length === 0 && (
                    <>
                      {/* Nearby Localities */}
                      <View>
                        <Text style={styles.csSubLabel}>Nearby Localities</Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={{ marginTop: spacing.s }}
                          contentContainerStyle={{ gap: spacing.s }}
                        >
                          {NEARBY_LOCALITIES.map((loc) => {
                            const isSel = selectedLocations.includes(loc);
                            return (
                              <TouchableOpacity
                                key={loc}
                                style={[styles.bhkChip, isSel && styles.bhkChipSelected]}
                                onPress={() => toggleItem(selectedLocations, setSelectedLocations, loc)}
                                activeOpacity={0.75}
                              >
                                {isSel && (
                                  <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                                    style={{ marginRight: 6 }} />
                                )}
                                <Text style={[styles.bhkChipText, isSel && styles.bhkChipTextSelected]}>
                                  {loc}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      </View>

                      {/* Selected Locations */}
                      {selectedLocations.length > 0 && (
                        <View style={styles.locSection}>
                          <Text style={styles.csSubLabel}>Selected Locations</Text>
                          {selectedLocations.map((loc) => (
                            <TouchableOpacity
                              key={loc}
                              style={[styles.bhkChip, styles.bhkChipSelected]}
                              onPress={() =>
                                setSelectedLocations((prev) => prev.filter((x) => x !== loc))
                              }
                              activeOpacity={0.75}
                            >
                              <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                                style={{ marginRight: 6 }} />
                              <Text style={[styles.bhkChipText, styles.bhkChipTextSelected]}>{loc}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}

                      {/* Most Searched Locations */}
                      <View style={styles.locSection}>
                        <Text style={styles.csSubLabel}>
                          {selectedLocations.length > 0 ? 'Most Searched Locations' : 'Most Searched Location'}
                        </Text>
                        {MOST_SEARCHED_LOCATIONS.filter((l) => !selectedLocations.includes(l)).map((loc) => (
                          <TouchableOpacity
                            key={loc}
                            style={styles.bhkChip}
                            onPress={() => toggleItem(selectedLocations, setSelectedLocations, loc)}
                            activeOpacity={0.75}
                          >
                            <Text style={styles.bhkChipText}>{loc}</Text>
                          </TouchableOpacity>
                        ))}
                        {selectedLocations.length === 0 && (
                          <TouchableOpacity
                            onPress={() => setSelectedLocations([...MOST_SEARCHED_LOCATIONS])}
                          >
                            <Text style={styles.clearText}>Select All</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </>
                  )}
                </View>
              )}

              {/* Amenities */}
              {activeCategory === 'Amenities' && (
                <View style={styles.bhkWrap}>
                  {AMENITIES_OPTIONS.map((opt) => {
                    const isSelected = amenities.includes(opt);
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.bhkChip, isSelected && styles.bhkChipSelected]}
                        onPress={() => toggleItem(amenities, setAmenities, opt)}
                        activeOpacity={0.75}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                            style={{ marginRight: 6 }} />
                        )}
                        <Text style={[styles.bhkChipText, isSelected && styles.bhkChipTextSelected]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  {amenities.length > 0 && (
                    <TouchableOpacity onPress={() => setAmenities([])}>
                      <Text style={styles.clearText}>Clear Selection</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Construction Status */}
              {activeCategory === 'Construction Status' && (
                <View style={styles.bhkWrap}>
                  {/* Ready To Move */}
                  <TouchableOpacity
                    style={[styles.bhkChip, constructionStatus.includes('Ready To Move') && styles.bhkChipSelected]}
                    onPress={() => {
                      toggleItem(constructionStatus, setConstructionStatus, 'Ready To Move');
                      if (constructionStatus.includes('Ready To Move')) setAgeOfProperty([]);
                    }}
                    activeOpacity={0.75}
                  >
                    {constructionStatus.includes('Ready To Move') && (
                      <Ionicons name="checkmark-circle" size={16} color={colors.brand} style={{ marginRight: 6 }} />
                    )}
                    <Text style={[styles.bhkChipText, constructionStatus.includes('Ready To Move') && styles.bhkChipTextSelected]}>
                      Ready To Move
                    </Text>
                  </TouchableOpacity>

                  {constructionStatus.includes('Ready To Move') && (
                    <View style={styles.csSubSection}>
                      <Text style={styles.csSubLabel}>Age of Property</Text>
                      {AGE_OF_PROPERTY_OPTIONS.map((opt) => (
                        <TouchableOpacity
                          key={opt}
                          style={[styles.bhkChip, ageOfProperty.includes(opt) && styles.bhkChipSelected]}
                          onPress={() => toggleItem(ageOfProperty, setAgeOfProperty, opt)}
                          activeOpacity={0.75}
                        >
                          {ageOfProperty.includes(opt) && (
                            <Ionicons name="checkmark-circle" size={16} color={colors.brand} style={{ marginRight: 6 }} />
                          )}
                          <Text style={[styles.bhkChipText, ageOfProperty.includes(opt) && styles.bhkChipTextSelected]}>
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Under Construction */}
                  <TouchableOpacity
                    style={[styles.bhkChip, constructionStatus.includes('Under Construction') && styles.bhkChipSelected]}
                    onPress={() => {
                      toggleItem(constructionStatus, setConstructionStatus, 'Under Construction');
                      if (constructionStatus.includes('Under Construction')) setPossession([]);
                    }}
                    activeOpacity={0.75}
                  >
                    {constructionStatus.includes('Under Construction') && (
                      <Ionicons name="checkmark-circle" size={16} color={colors.brand} style={{ marginRight: 6 }} />
                    )}
                    <Text style={[styles.bhkChipText, constructionStatus.includes('Under Construction') && styles.bhkChipTextSelected]}>
                      Under Construction
                    </Text>
                  </TouchableOpacity>

                  {constructionStatus.includes('Under Construction') && (
                    <View style={styles.csSubSection}>
                      <Text style={styles.csSubLabel}>Possession</Text>
                      {POSSESSION_OPTIONS.map((opt) => (
                        <TouchableOpacity
                          key={opt}
                          style={[styles.bhkChip, possession.includes(opt) && styles.bhkChipSelected]}
                          onPress={() => toggleItem(possession, setPossession, opt)}
                          activeOpacity={0.75}
                        >
                          {possession.includes(opt) && (
                            <Ionicons name="checkmark-circle" size={16} color={colors.brand} style={{ marginRight: 6 }} />
                          )}
                          <Text style={[styles.bhkChipText, possession.includes(opt) && styles.bhkChipTextSelected]}>
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {(constructionStatus.length > 0 || ageOfProperty.length > 0 || possession.length > 0) && (
                    <TouchableOpacity onPress={() => {
                      setConstructionStatus([]);
                      setAgeOfProperty([]);
                      setPossession([]);
                    }}>
                      <Text style={styles.clearText}>Clear Selection</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* BHK */}
              {activeCategory === 'BHK' && (
                <View style={styles.bhkWrap}>
                  {BHK_OPTIONS.map((opt) => {
                    const isSelected = bhkFilter.includes(opt);
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.bhkChip, isSelected && styles.bhkChipSelected]}
                        onPress={() =>
                          setBhkFilter((prev) =>
                            prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt],
                          )
                        }
                        activeOpacity={0.75}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                            style={{ marginRight: 6 }} />
                        )}
                        <Text style={[styles.bhkChipText, isSelected && styles.bhkChipTextSelected]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  {bhkFilter.length > 0 && (
                    <TouchableOpacity onPress={() => setBhkFilter([])}>
                      <Text style={styles.clearText}>Clear Selection</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Area */}
              {activeCategory === 'Area' && (
                <AreaPanel
                  unit={areaUnit}
                  minArea={minArea}
                  maxArea={maxArea}
                  onSetUnit={setAreaUnit}
                  onSetMin={handleSetMinArea}
                  onSetMax={handleSetMaxArea}
                />
              )}

              {/* Availability */}
              {activeCategory === 'Availability' && (
                <View style={styles.bhkWrap}>
                  {AVAILABILITY_OPTIONS.map((opt) => {
                    const isSelected = availability.includes(opt);
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.bhkChip, isSelected && styles.bhkChipSelected]}
                        onPress={() => toggleItem(availability, setAvailability, opt)}
                        activeOpacity={0.75}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                            style={{ marginRight: 6 }} />
                        )}
                        <Text style={[styles.bhkChipText, isSelected && styles.bhkChipTextSelected]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity onPress={() => setAvailability([])}>
                    <Text style={styles.clearText}>Clear Selection</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Furnishing Status */}
              {activeCategory === 'Furnishing Status' && (
                <View style={styles.bhkWrap}>
                  {FURNISHING_OPTIONS.map((opt) => {
                    const isSelected = furnishingStatus.includes(opt);
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.bhkChip, isSelected && styles.bhkChipSelected]}
                        onPress={() => toggleItem(furnishingStatus, setFurnishingStatus, opt)}
                        activeOpacity={0.75}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                            style={{ marginRight: 6 }} />
                        )}
                        <Text style={[styles.bhkChipText, isSelected && styles.bhkChipTextSelected]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity onPress={() => setFurnishingStatus([])}>
                    <Text style={styles.clearText}>Clear Selection</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Bathrooms */}
              {activeCategory === 'Bathrooms' && (
                <View style={styles.sortContent}>
                  {BATHROOM_OPTIONS.map((opt) => (
                    <RadioOption
                      key={opt}
                      label={opt}
                      selected={bathrooms === opt}
                      onPress={() => setBathrooms(bathrooms === opt ? null : opt)}
                    />
                  ))}
                  {bathrooms !== null && (
                    <TouchableOpacity onPress={() => setBathrooms(null)} style={{ paddingTop: spacing.m }}>
                      <Text style={styles.clearText}>Clear Selection</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Posted By */}
              {activeCategory === 'Posted By' && (
                <View style={styles.bhkWrap}>
                  {POSTED_BY_OPTIONS.map((opt) => {
                    const isSelected = postedBy.includes(opt);
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.bhkChip, isSelected && styles.bhkChipSelected]}
                        onPress={() => toggleItem(postedBy, setPostedBy, opt)}
                        activeOpacity={0.75}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                            style={{ marginRight: 6 }} />
                        )}
                        <Text style={[styles.bhkChipText, isSelected && styles.bhkChipTextSelected]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity onPress={() => setPostedBy([])}>
                    <Text style={styles.clearText}>Clear Selection</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Project Density */}
              {activeCategory === 'Project Density' && (
                <View style={styles.bhkWrap}>
                  {/* Info blurb */}
                  <View style={styles.pdInfoRow}>
                    <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} style={{ marginTop: 2 }} />
                    <Text style={styles.pdInfoText}>
                      Project density refers to the number of residential units or buildings within a specific area. It helps understand the concentration of housing and population in a given location.
                    </Text>
                  </View>

                  {/* Density chips */}
                  {PROJECT_DENSITY_OPTIONS.map((opt) => {
                    const isSelected = projectDensity.includes(opt);
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.bhkChip, isSelected && styles.bhkChipSelected]}
                        onPress={() => toggleItem(projectDensity, setProjectDensity, opt)}
                        activeOpacity={0.75}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                            style={{ marginRight: 6 }} />
                        )}
                        <Text style={[styles.bhkChipText, isSelected && styles.bhkChipTextSelected]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Facing Direction */}
              {activeCategory === 'Facing Direction' && (
                <View style={styles.bhkWrap}>
                  {FACING_DIRECTION_OPTIONS.map((dir) => {
                    const isSelected = facingDirection.includes(dir);
                    return (
                      <TouchableOpacity
                        key={dir}
                        style={[styles.bhkChip, isSelected && styles.bhkChipSelected]}
                        onPress={() => toggleItem(facingDirection, setFacingDirection, dir)}
                        activeOpacity={0.75}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                            style={{ marginRight: 6 }} />
                        )}
                        <Text style={[styles.bhkChipText, isSelected && styles.bhkChipTextSelected]}>
                          {dir}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity onPress={() => setFacingDirection([])}>
                    <Text style={styles.clearText}>Clear Selection</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Floor Preference */}
              {activeCategory === 'Floor Preference' && (
                <View style={styles.bhkWrap}>
                  {/* Building Height label + info icon */}
                  <View style={styles.fpSectionHeader}>
                    <Text style={styles.fpSectionLabel}>Building Height</Text>
                    <TouchableOpacity onPress={() => setShowHeightInfo((v) => !v)} activeOpacity={0.7}>
                      <Ionicons name="information-circle-outline" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>

                  {/* Info tooltip card */}
                  {showHeightInfo && (
                    <View style={styles.fpInfoCard}>
                      <TouchableOpacity style={styles.fpInfoClose} onPress={() => setShowHeightInfo(false)}>
                        <Ionicons name="close" size={16} color={colors.textPrimary} />
                      </TouchableOpacity>
                      {BUILDING_HEIGHT_INFO.map((item) => (
                        <View key={item.label} style={styles.fpInfoRow}>
                          <Text style={styles.fpInfoLabel}>{item.label}</Text>
                          <Text style={styles.fpInfoDesc}>{item.desc}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Radio grid: 2 columns */}
                  <View style={styles.fpRadioGrid}>
                    {(['all', 'highRise'] as BuildingHeight[]).map((key) => (
                      <View key={key} style={styles.fpRadioCell}>
                        <TouchableOpacity
                          style={styles.fpRadioRow}
                          onPress={() => { setBuildingHeight(key); setFloorNumbers([]); setShowHeightInfo(false); }}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.radioOuter, buildingHeight === key && styles.radioOuterSelected]}>
                            {buildingHeight === key && <View style={styles.radioInner} />}
                          </View>
                          <Text style={[styles.radioLabel, buildingHeight === key && styles.radioLabelSelected]}>
                            {BUILDING_HEIGHT_LABELS[key]}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                    {(['midRise', 'lowRise'] as BuildingHeight[]).map((key) => (
                      <View key={key} style={styles.fpRadioCell}>
                        <TouchableOpacity
                          style={styles.fpRadioRow}
                          onPress={() => { setBuildingHeight(key); setFloorNumbers([]); setShowHeightInfo(false); }}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.radioOuter, buildingHeight === key && styles.radioOuterSelected]}>
                            {buildingHeight === key && <View style={styles.radioInner} />}
                          </View>
                          <Text style={[styles.radioLabel, buildingHeight === key && styles.radioLabelSelected]}>
                            {BUILDING_HEIGHT_LABELS[key]}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  {/* Floor Number */}
                  <Text style={[styles.fpSectionLabel, { marginTop: spacing[3] }]}>Floor Number</Text>
                  <View style={styles.fpFloorList}>
                    {FLOOR_OPTIONS[buildingHeight].map((floor) => {
                      const isSelected = floorNumbers.includes(floor);
                      return (
                        <TouchableOpacity
                          key={floor}
                          style={[styles.fpFloorChip, isSelected && styles.bhkChipSelected]}
                          onPress={() => toggleItem(floorNumbers, setFloorNumbers, floor)}
                          activeOpacity={0.75}
                        >
                          {isSelected && (
                            <Ionicons name="checkmark-circle" size={16} color={colors.brand}
                              style={{ marginRight: 6 }} />
                          )}
                          <Text style={[styles.bhkChipText, isSelected && styles.bhkChipTextSelected]}>
                            {floor}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {floorNumbers.length > 0 && (
                    <TouchableOpacity onPress={() => setFloorNumbers([])}>
                      <Text style={styles.clearText}>Clear Selection</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Placeholder for other categories */}
              {activeCategory !== 'Quick Filters' && activeCategory !== 'Budget'
                && activeCategory !== 'Property Type' && activeCategory !== 'BHK'
                && activeCategory !== 'Construction Status' && activeCategory !== 'Amenities'
                && activeCategory !== 'Location' && activeCategory !== 'Builders'
                && activeCategory !== 'Projects' && activeCategory !== 'Area'
                && activeCategory !== 'Floor Preference'
                && activeCategory !== 'Facing Direction'
                && activeCategory !== 'Project Density'
                && activeCategory !== 'Posted By'
                && activeCategory !== 'Bathrooms'
                && activeCategory !== 'Furnishing Status'
                && activeCategory !== 'Availability' && (
                <View style={styles.emptyCategory}>
                  <Text style={styles.emptyCategoryText}>{activeCategory}</Text>
                  <Text style={styles.emptyCategoryHint}>Options coming soon</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.saveBtnText}>Save Filters</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.brand} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.seeAllBtnText}>See all 34K+ Properties</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const SIDEBAR_W = 120;

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    marginTop: spacing.m,
    marginBottom: spacing.xs,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.m,
  },
  closeBtn: { padding: spacing.xs },
  headerTitle: { ...typography.h2, color: colors.textPrimary },
  resetText: { ...typography.labelLarge, color: colors.brand },

  // Tab switcher
  tabSwitcher: {
    flexDirection: 'row',
    marginHorizontal: spacing.l,
    backgroundColor: colors.brandLight,
    borderRadius: radius.full,
    padding: 4,
    marginBottom: spacing.l,
    overflow: 'hidden',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.s + 2,
    borderRadius: radius.full,
  },
  tabBtnActive: { backgroundColor: colors.surface, ...shadows.card },
  tabBtnText: { ...typography.labelLarge, color: colors.textSecondary },
  tabBtnTextActive: { color: colors.textPrimary, fontFamily: 'Roboto_500Medium' },

  // Sort
  sortPanel: { flex: 1 },
  sortContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.l,
    paddingVertical: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  radioOuter: {
    width: 22, height: 22, borderRadius: radius.full,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: colors.brand },
  radioInner: { width: 11, height: 11, borderRadius: radius.full, backgroundColor: colors.brand },
  radioLabel: { ...typography.bodyLarge, color: colors.textBody },
  radioLabelSelected: { color: colors.brand, fontFamily: 'Roboto_500Medium' },

  // Filter panel
  filterPanel: { flex: 1 },
  propTypeRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.l,
    backgroundColor: colors.brandLight,
    borderRadius: radius.full,
    padding: 4,
    marginBottom: spacing.l,
    overflow: 'hidden',
  },
  propTypeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: spacing.xs,
    paddingVertical: spacing.s + 2, borderRadius: radius.full,
  },
  propTypeBtnActive: { backgroundColor: colors.surface, ...shadows.card },
  propTypeBtnText: { ...typography.labelLarge, color: colors.textSecondary, flexShrink: 1 },
  propTypeBtnTextActive: { color: colors.textPrimary, fontFamily: 'Roboto_500Medium' },

  filterBody: { flex: 1, flexDirection: 'row', overflow: 'hidden' },

  // Sidebar
  sidebar: { width: SIDEBAR_W, flexShrink: 0, backgroundColor: colors.brandLight },
  sidebarItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.l, paddingHorizontal: spacing.m,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
    position: 'relative',
  },
  sidebarItemActive: { backgroundColor: colors.surface },
  sidebarActiveBar: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: 3, backgroundColor: colors.brand,
    borderTopRightRadius: 2, borderBottomRightRadius: 2,
  },
  sidebarText: { ...typography.body, color: colors.textSecondary, flexShrink: 1 },
  sidebarTextActive: { color: colors.brand, fontFamily: 'Roboto_500Medium' },

  // Right content
  filterContent: { flex: 1, minWidth: 0, backgroundColor: colors.surface },
  filterContentInner: { padding: spacing.l, gap: spacing.m },

  // Quick filters
  quickFiltersWrap: { gap: spacing.m },
  qfChip: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    paddingHorizontal: spacing.l, paddingVertical: spacing.s + 2,
    borderRadius: radius.full, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.surface,
  },
  qfChipSelected: { borderColor: colors.brand },
  qfChipText: { ...typography.body, color: colors.textSecondary },
  qfChipTextSelected: { color: colors.brand, fontFamily: 'Roboto_500Medium' },
  clearText: { ...typography.labelLarge, color: colors.brand, marginTop: spacing.xs },

  // ── Budget ──
  budgetWrap: {},
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  budgetHeaderSide: { gap: 1 },
  budgetHeaderLabel: { ...typography.caption, color: colors.textMuted, textTransform: 'uppercase' },
  budgetHeaderValue: { ...typography.titleSmall, color: colors.textPrimary },
  budgetHeaderDash: { ...typography.body, color: colors.textMuted },

  budgetNoRow: {
    flexDirection: 'row',
    gap: spacing.s,
    marginBottom: spacing.m,
  },
  noChip: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  noChipSelected: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  noChipText: { ...typography.bodySmall, color: colors.textSecondary },
  noChipTextSelected: { color: colors.white, fontFamily: 'Roboto_500Medium' },

  budgetColumns: { flexDirection: 'row', gap: spacing.xs },
  budgetCol: { flex: 1, gap: 2 },

  budgetPill: {
    paddingVertical: spacing.s + 2,
    paddingHorizontal: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  budgetPillSelected: {
    backgroundColor: colors.primaryFaded,
    borderRadius: radius.full,
    paddingHorizontal: spacing.m,
  },
  budgetPillText: { ...typography.body, color: colors.textSecondary },
  budgetPillTextSelected: { color: colors.brand, fontFamily: 'Roboto_500Medium' },

  // ── Location ──
  locWrap: { gap: spacing.m },
  locSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.m,
    height: 44,
  },
  locSearchInput: {
    flex: 1,
    minWidth: 0,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  locDropdown: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.card,
  },
  locCurrentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  locCurrentLocationText: {
    ...typography.body,
    color: colors.textPrimary,
    fontFamily: 'Roboto_500Medium',
  },
  locDropdownList: {
    padding: spacing.m,
    gap: spacing.m,
  },
  locApplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.brandDark,
    paddingVertical: spacing.m,
    margin: spacing.m,
    marginTop: 0,
    borderRadius: radius.md,
  },
  locApplyBtnText: {
    ...typography.button,
    color: colors.white,
  },
  locSection: { gap: spacing.m },

  // ── BHK ──
  bhkWrap: { gap: spacing.m },
  bhkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s + 2,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  bhkChipSelected: { borderColor: colors.brand },
  bhkChipText: { ...typography.body, color: colors.textSecondary },
  bhkChipTextSelected: { color: colors.brand, fontFamily: 'Roboto_500Medium' },

  csSubSection: { gap: spacing.m, paddingLeft: spacing.m },
  csSubLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },

  // ── Area ──
  areaUnitTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.m,
  },
  areaUnitLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontFamily: 'Roboto_500Medium',
  },
  areaUnitUnderline: {
    textDecorationLine: 'underline',
  },
  areaUnitDropdown: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.m,
    marginBottom: spacing.m,
    ...shadows.card,
  },

  // ── Project Density ──
  pdInfoRow: {
    flexDirection: 'row',
    gap: spacing.s,
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  pdInfoText: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // ── Floor Preference ──
  fpSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  fpSectionLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  fpInfoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.m,
    marginBottom: spacing.m,
    gap: spacing.s,
    ...shadows.card,
    position: 'relative' as const,
  },
  fpInfoClose: {
    position: 'absolute' as const,
    top: spacing.s,
    right: spacing.s,
    padding: 4,
  },
  fpInfoRow: { gap: 2 },
  fpInfoLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: colors.textPrimary,
  },
  fpInfoDesc: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  fpRadioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap' as const,
    marginBottom: spacing.xs,
    marginTop: spacing.s,
  },
  fpRadioCell: {
    width: '50%',
    paddingVertical: spacing.xs,
  },
  fpRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  fpFloorList: {
    gap: spacing.s,
    marginTop: spacing.s,
  },
  fpFloorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s + 2,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  // Empty placeholder
  emptyCategory: {
    flex: 1, alignItems: 'center', paddingTop: spacing.xl, gap: spacing.s,
  },
  emptyCategoryText: { ...typography.h4, color: colors.textPrimary },
  emptyCategoryHint: { ...typography.body, color: colors.textMuted },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    gap: spacing.m,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.surface,
  },
  saveBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, height: 52, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.brand, backgroundColor: colors.surface,
  },
  saveBtnText: { ...typography.button, color: colors.brand },
  seeAllBtn: {
    flex: 1.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, height: 52, borderRadius: radius.md,
    backgroundColor: colors.brandDark, ...shadows.button,
  },
  seeAllBtnText: { ...typography.buttonSmall, color: colors.white },
});
