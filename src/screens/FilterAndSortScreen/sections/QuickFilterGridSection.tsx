import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../../theme/theme';

const filterCategories = [
  { id: 'quick-filters', label: 'Quick Filters' },
  { id: 'budget', label: 'Budget' },
  { id: 'availability', label: 'Availability' },
  { id: 'property-type', label: 'Property Type' },
  { id: 'bhk', label: 'BHK' },
  { id: 'furnishing-status', label: 'Furnishing Status' },
  { id: 'area', label: 'Area' },
  { id: 'bathrooms', label: 'Bathrooms' },
  { id: 'construction-status', label: 'Construction Status' },
  { id: 'new-booking-resale', label: 'New Booking / Resale' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'location', label: 'Location' },
  { id: 'floor-preference', label: 'Floor Preference' },
  { id: 'posted-by', label: 'Posted By' },
  { id: 'builders', label: 'Builders' },
  { id: 'projects', label: 'Projects' },
  { id: 'facing-direction', label: 'Facing Direction' },
  { id: 'property-features', label: 'Property Features' },
  { id: 'project-density', label: 'Project Density' },
  { id: 'rera-approved', label: 'RERA Approved' },
];

const filterOptionsByCategory: Record<string, { id: string; label: string }[][]> = {
  'quick-filters': [
    [
      { id: 'rood-recommended', label: 'Rood-recommended' },
      { id: 'high-demand', label: 'High demand' },
    ],
    [
      { id: 'new-launches', label: 'New Launches' },
      { id: 'zero-brokerage', label: 'Zero Brokerage' },
    ],
    [
      { id: 'photos', label: 'Photos' },
      { id: 'videos', label: 'Videos' },
    ],
    [
      { id: 'corner-property', label: 'Corner Property' },
      { id: 'park-facing', label: 'Park Facing' },
      { id: 'gated-society', label: 'Gated Society' },
      { id: 'road-facing', label: 'Road Facing' },
    ],
    [
      { id: 'rera-approved-properties', label: 'RERA Approved properties' },
      { id: 'rera-registered-dealers', label: 'RERA registered dealers' },
    ],
    [
      { id: 'resale', label: 'Resale' },
      { id: 'new-booking', label: 'New Booking' },
    ],
  ],
  budget: [
    [
      { id: 'under-50l', label: 'Under ₹50 Lakh' },
      { id: '50l-1cr', label: '₹50L – ₹1 Cr' },
      { id: '1cr-2cr', label: '₹1 Cr – ₹2 Cr' },
      { id: '2cr-5cr', label: '₹2 Cr – ₹5 Cr' },
      { id: 'above-5cr', label: 'Above ₹5 Cr' },
    ],
  ],
  availability: [
    [
      { id: 'ready-to-move', label: 'Ready to Move' },
      { id: 'under-construction', label: 'Under Construction' },
    ],
  ],
  'property-type': [
    [
      { id: 'apartment', label: 'Apartment' },
      { id: 'villa', label: 'Villa' },
      { id: 'plot', label: 'Plot' },
      { id: 'builder-floor', label: 'Builder Floor' },
      { id: 'penthouse', label: 'Penthouse' },
    ],
  ],
  bhk: [
    [
      { id: '1bhk', label: '1 BHK' },
      { id: '2bhk', label: '2 BHK' },
      { id: '3bhk', label: '3 BHK' },
      { id: '4bhk', label: '4 BHK' },
      { id: '4plus-bhk', label: '4+ BHK' },
    ],
  ],
  'furnishing-status': [
    [
      { id: 'furnished', label: 'Furnished' },
      { id: 'semi-furnished', label: 'Semi-Furnished' },
      { id: 'unfurnished', label: 'Unfurnished' },
    ],
  ],
  area: [
    [
      { id: 'under-500', label: 'Under 500 sq.ft' },
      { id: '500-1000', label: '500 – 1000 sq.ft' },
      { id: '1000-2000', label: '1000 – 2000 sq.ft' },
      { id: 'above-2000', label: 'Above 2000 sq.ft' },
    ],
  ],
  bathrooms: [
    [
      { id: '1bath', label: '1 Bath' },
      { id: '2bath', label: '2 Baths' },
      { id: '3bath', label: '3 Baths' },
      { id: '4plus-bath', label: '4+ Baths' },
    ],
  ],
  'construction-status': [
    [
      { id: 'new-launch', label: 'New Launch' },
      { id: 'mid-construction', label: 'Mid Construction' },
      { id: 'nearing-possession', label: 'Nearing Possession' },
      { id: 'possession-overdue', label: 'Possession Overdue' },
    ],
  ],
  'new-booking-resale': [
    [
      { id: 'nb-new-booking', label: 'New Booking' },
      { id: 'nb-resale', label: 'Resale' },
    ],
  ],
  amenities: [
    [
      { id: 'gym', label: 'Gym' },
      { id: 'swimming-pool', label: 'Swimming Pool' },
      { id: 'club-house', label: 'Club House' },
      { id: 'power-backup', label: 'Power Backup' },
      { id: 'lift', label: 'Lift' },
      { id: 'security', label: 'Security' },
      { id: 'park', label: 'Park' },
    ],
  ],
  location: [
    [
      { id: 'metro-nearby', label: 'Metro Nearby' },
      { id: 'school-nearby', label: 'School Nearby' },
      { id: 'hospital-nearby', label: 'Hospital Nearby' },
      { id: 'mall-nearby', label: 'Mall Nearby' },
    ],
  ],
  'floor-preference': [
    [
      { id: 'ground-floor', label: 'Ground Floor' },
      { id: 'low-rise', label: 'Low Rise (1-5)' },
      { id: 'mid-rise', label: 'Mid Rise (6-15)' },
      { id: 'high-rise', label: 'High Rise (15+)' },
    ],
  ],
  'posted-by': [
    [
      { id: 'owner', label: 'Owner' },
      { id: 'dealer', label: 'Dealer' },
      { id: 'builder', label: 'Builder' },
    ],
  ],
  builders: [
    [
      { id: 'dlf', label: 'DLF' },
      { id: 'godrej', label: 'Godrej Properties' },
      { id: 'prestige', label: 'Prestige Group' },
      { id: 'lodha', label: 'Lodha' },
      { id: 'brigade', label: 'Brigade Group' },
    ],
  ],
  projects: [
    [
      { id: 'proj-ongoing', label: 'Ongoing Projects' },
      { id: 'proj-completed', label: 'Completed Projects' },
      { id: 'proj-upcoming', label: 'Upcoming Projects' },
    ],
  ],
  'facing-direction': [
    [
      { id: 'north', label: 'North' },
      { id: 'south', label: 'South' },
      { id: 'east', label: 'East' },
      { id: 'west', label: 'West' },
      { id: 'north-east', label: 'North East' },
      { id: 'north-west', label: 'North West' },
    ],
  ],
  'property-features': [
    [
      { id: 'vastu-compliant', label: 'Vastu Compliant' },
      { id: 'sea-view', label: 'Sea View' },
      { id: 'garden-facing', label: 'Garden Facing' },
      { id: 'corner-unit', label: 'Corner Unit' },
    ],
  ],
  'project-density': [
    [
      { id: 'low-density', label: 'Low Density' },
      { id: 'medium-density', label: 'Medium Density' },
      { id: 'high-density', label: 'High Density' },
    ],
  ],
  'rera-approved': [
    [
      { id: 'rera-yes', label: 'RERA Approved' },
      { id: 'rera-registered', label: 'RERA Registered' },
    ],
  ],
};

const defaultSelected = new Set([
  'rood-recommended',
  'new-launches',
  'photos',
  'corner-property',
]);

interface QuickFilterGridSectionProps {
  activeCategory?: string;
  onCategoryChange?: (id: string) => void;
}

export const QuickFilterGridSection = ({
  activeCategory: externalActiveCategory,
  onCategoryChange,
}: QuickFilterGridSectionProps) => {
  const [internalActiveCategory, setInternalActiveCategory] = useState<string>('quick-filters');
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set(defaultSelected));
  const rightPanelRef = useRef<ScrollView>(null);

  const activeCategory = externalActiveCategory ?? internalActiveCategory;

  const handleCategoryClick = (id: string) => {
    setInternalActiveCategory(id);
    onCategoryChange?.(id);
    rightPanelRef.current?.scrollTo({ y: 0, animated: false });
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
  const activeCategoryLabel = filterCategories.find((c) => c.id === activeCategory)?.label ?? '';

  return (
    <View style={styles.container}>
      {/* Left sidebar — filter categories */}
      <ScrollView
        style={styles.sidebar}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {filterCategories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleCategoryClick(category.id)}
              style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.sidebarLabel, isActive && styles.sidebarLabelActive]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Right panel — filter option pills */}
      <ScrollView
        ref={rightPanelRef}
        style={styles.rightPanel}
        contentContainerStyle={styles.rightPanelContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Category title */}
        <Text style={styles.categoryTitle}>{activeCategoryLabel}</Text>

        {currentGroups.map((group, gIdx) => (
          <View key={gIdx} style={styles.pillGroup}>
            {group.map((option) => {
              const isSelected = selectedOptions.has(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => toggleOption(option.id)}
                  style={[styles.pill, isSelected && styles.pillSelected]}
                  activeOpacity={0.7}
                >
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={colors.brand}
                      style={styles.pillIcon}
                    />
                  )}
                  <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* Divider */}
        {currentGroups.length > 0 && <View style={styles.divider} />}

        {/* Clear Selection */}
        <TouchableOpacity onPress={clearSelection} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Clear Selection</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    overflow: 'hidden',
  },
  // Left sidebar
  sidebar: {
    width: 122,
    backgroundColor: colors.brandLight,
  },
  sidebarItem: {
    paddingHorizontal: spacing.l,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    backgroundColor: colors.brandLight,
  },
  sidebarItemActive: {
    backgroundColor: colors.surface,
    borderLeftColor: colors.brand,
  },
  sidebarLabel: {
    ...typography.bodySmall,
    color: '#616363',
    flexWrap: 'wrap',
  },
  sidebarLabelActive: {
    fontFamily: 'Roboto_500Medium',
    color: colors.brand,
  },
  // Right panel
  rightPanel: {
    flex: 1,
  },
  rightPanelContent: {
    paddingHorizontal: spacing.l,
    paddingVertical: 24,
    gap: 20,
  },
  categoryTitle: {
    ...typography.titleSmall,
    color: colors.textPrimary,
    width: '100%',
  },
  pillGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  pillSelected: {
    backgroundColor: colors.brandLight,
    borderColor: colors.brand,
  },
  pillIcon: {
    marginRight: 6,
  },
  pillText: {
    ...typography.bodySmall,
    color: '#858585',
  },
  pillTextSelected: {
    fontFamily: 'Roboto_500Medium',
    color: colors.brand,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E9E9E9',
  },
  clearBtn: {
    paddingVertical: 2,
  },
  clearBtnText: {
    ...typography.titleSmall,
    color: '#1879DA',
  },
});
