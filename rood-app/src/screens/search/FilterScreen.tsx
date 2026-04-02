import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme/theme';
import { filtersData } from '../../data';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.3;

type TabType = 'sort' | 'filter';

export default function FilterScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('filter');
  const [activeCategory, setActiveCategory] = useState('location');
  const [filters, setFilters] = useState(filtersData);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => [
    { id: 'location', label: 'Location' },
    { id: 'budget', label: 'Budget' },
    { id: 'availability', label: 'Availability' },
    { id: 'propertyType', label: 'Property Type' },
    { id: 'bhk', label: 'BHK' },
    { id: 'constructionStatus', label: 'Construction Status' },
    { id: 'furnishingStatus', label: 'Furnishing Status' },
    { id: 'area', label: 'Area' },
    { id: 'bathrooms', label: 'Bathrooms' },
    { id: 'newBookingResale', label: 'New Booking / Resale' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'floorPreference', label: 'Floor Preference' },
    { id: 'postedBy', label: 'Posted By' },
    { id: 'builders', label: 'Builders' },
    { id: 'projects', label: 'Projects' },
    { id: 'facing', label: 'Facing Direction' },
  ], []);

  const toggleMultiSelect = (categoryKey: string, optionId: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        options: prev[categoryKey].options.map((opt: any) =>
          opt.id === optionId ? { ...opt, selected: !opt.selected } : opt
        ),
      },
    }));
  };

  const handlePropertyTypeToggle = (typeId: string) => {
    setFilters((prev: any) => ({
      ...prev,
      propertyType: prev.propertyType.map((pt: any) =>
        pt.id === typeId ? { ...pt, selected: true } : { ...pt, selected: false }
      ),
    }));
  };

  const closeFilter = () => navigation.goBack();
  const resetFilters = () => {
     setFilters(filtersData);
     setSearchQuery('');
  };

  // ── Render Helpers ───────────────────────────────────────────

  const renderSidebar = () => (
    <View style={styles.sidebar}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.sidebarItem,
              activeCategory === cat.id && styles.sidebarItemActive,
            ]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Text
              style={[
                styles.sidebarText,
                activeCategory === cat.id && styles.sidebarTextActive,
              ]}
            >
              {cat.label}
            </Text>
            {activeCategory === cat.id && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'location':
        return renderLocation();
      case 'propertyType':
        return renderPropertyTypes();
      case 'budget':
      case 'area':
      case 'dimension':
        return renderRange(activeCategory);
      default:
        return renderMultiSelectContent(activeCategory);
    }
  };

  const renderLocation = () => (
    <View style={styles.contentSection}>
      <View style={styles.quickFiltersSub}>
         <TouchableOpacity style={styles.quickFilterChipActive}>
            <Ionicons name="checkmark-circle" size={16} color={colors.brand} />
            <Text style={styles.quickFilterTextActive}>Rood-recommended</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.quickFilterChip}>
            <Text style={styles.quickFilterText}>High demand</Text>
         </TouchableOpacity>
      </View>

      <View style={styles.optionGroup}>
         {filters.quickFilters.map((f: any) => (
            <TouchableOpacity 
              key={f.id} 
              style={styles.checkboxRow}
              onPress={() => {}}
            >
               <Ionicons 
                 name={f.selected ? "checkmark-circle" : "ellipse-outline"} 
                 size={20} 
                 color={f.selected ? colors.brand : colors.textMuted} 
               />
               <Text style={styles.checkboxLabel}>{f.label}</Text>
            </TouchableOpacity>
         ))}
      </View>
      
      <TouchableOpacity style={styles.clearSelection}>
        <Text style={styles.clearSelectionText}>Clear Selection</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPropertyTypes = () => (
    <View style={styles.contentSection}>
      <View style={styles.chipGrid}>
        {filters.propertyType.map((pt: any) => (
          <TouchableOpacity
            key={pt.id}
            style={[styles.typeChip, pt.selected && styles.typeChipActive]}
            onPress={() => handlePropertyTypeToggle(pt.id)}
          >
            <Text style={[styles.typeChipText, pt.selected && styles.typeChipTextActive]}>
              {pt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMultiSelectContent = (key: string) => {
    const data = (filters as any)[key];
    if (!data || !data.options) return null;

    return (
      <View style={styles.contentSection}>
        <Text style={styles.contentTitle}>{data.label}</Text>
        <View style={styles.chipGrid}>
          {data.options.map((opt: any) => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.optionChip, opt.selected && styles.optionChipActive]}
              onPress={() => toggleMultiSelect(key, opt.id)}
            >
              <Text style={[styles.optionChipText, opt.selected && styles.optionChipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderRange = (key: string) => {
    const data = (filters as any)[key];
    return (
      <View style={styles.contentSection}>
        <Text style={styles.contentTitle}>{data.label}</Text>
        <View style={styles.rangeInputs}>
          <TextInput
            style={styles.rangeInput}
            placeholder="Min"
            keyboardType="numeric"
            value={data.min?.toString()}
          />
          <View style={styles.rangeDash} />
          <TextInput
            style={styles.rangeInput}
            placeholder="Max"
            keyboardType="numeric"
            value={data.max?.toString()}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={closeFilter}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sort & Filters</Text>
        <TouchableOpacity onPress={resetFilters}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sort' && styles.tabActive]}
          onPress={() => setActiveTab('sort')}
        >
          <Text style={[styles.tabText, activeTab === 'sort' && styles.tabTextActive]}>Sort</Text>
          <Feather name="bar-chart-2" size={16} color={activeTab === 'sort' ? colors.brand : colors.textMuted} style={{ transform: [{ rotate: '90deg' }] }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'filter' && styles.tabActive]}
          onPress={() => setActiveTab('filter')}
        >
          <Text style={[styles.tabText, activeTab === 'filter' && styles.tabTextActive]}>Filter</Text>
          <MaterialCommunityIcons name="filter-variant" size={18} color={activeTab === 'filter' ? colors.brand : colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Sub-tabs (Residential/Commercial/Land) */}
      <View style={styles.subTabContainer}>
        <TouchableOpacity style={styles.subTabActive}>
          <Text style={styles.subTabTextActive}>Residential</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.subTab}>
          <Text style={styles.subTabText}>Commercial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.subTab}>
          <Text style={styles.subTabText}>Land</Text>
          <MaterialCommunityIcons name="home-outline" size={16} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Main Body */}
      <View style={styles.mainBody}>
        {renderSidebar()}
        <View style={styles.contentArea}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderContent()}
          </ScrollView>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={styles.seeAllBtnText}>See all 34K+ Properties</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  resetText: {
    ...typography.labelSmall,
    color: colors.brand,
    fontWeight: 'bold',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    margin: spacing.l,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.s,
    borderRadius: radius.sm,
    gap: 8,
  },
  tabActive: {
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  tabText: {
    ...typography.labelLarge,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },

  // Sub-tabs
  subTabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.l,
    gap: 8,
    marginBottom: spacing.m,
  },
  subTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  subTabActive: {
    backgroundColor: colors.black,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  subTabText: {
    ...typography.labelSmall,
    color: colors.textPrimary,
  },
  subTabTextActive: {
    ...typography.labelSmall,
    color: colors.white,
  },

  // Main Body
  mainBody: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  // Sidebar
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: colors.background,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  sidebarItem: {
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.m,
    position: 'relative',
  },
  sidebarItemActive: {
    backgroundColor: colors.surface,
  },
  sidebarText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontSize: 11,
  },
  sidebarTextActive: {
    color: colors.brand,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '25%',
    height: '50%',
    width: 3,
    backgroundColor: colors.brand,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

  // Content Area
  contentArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  contentSection: {
    padding: spacing.l,
  },
  contentTitle: {
    ...typography.h4,
    marginBottom: spacing.m,
  },

  // Content styles
  quickFiltersSub: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.l,
  },
  quickFilterChipActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandLight,
    borderWidth: 1,
    borderColor: colors.brand,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    gap: 4,
  },
  quickFilterChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  quickFilterTextActive: {
    fontSize: 11,
    color: colors.brand,
    fontWeight: '700',
  },
  quickFilterText: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  optionGroup: {
    gap: spacing.l,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },

  clearSelection: {
    marginTop: spacing.xl,
  },
  clearSelectionText: {
    ...typography.labelSmall,
    color: colors.primary,
    textDecorationLine: 'underline',
  },

  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipActive: {
    backgroundColor: colors.brandLight,
    borderColor: colors.brand,
  },
  typeChipText: {
    ...typography.body,
  },
  typeChipTextActive: {
    color: colors.brand,
    fontWeight: '700',
  },

  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionChipActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  optionChipText: {
    ...typography.bodySmall,
  },
  optionChipTextActive: {
    color: colors.white,
    fontWeight: '600',
  },

  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rangeInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.m,
  },
  rangeDash: {
    width: 8,
    height: 1,
    backgroundColor: colors.textMuted,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    padding: spacing.l,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  saveBtn: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveBtnText: {
    ...typography.labelSmall,
    color: colors.textPrimary,
  },
  seeAllBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.brand,
    paddingVertical: 12,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  seeAllBtnText: {
    ...typography.buttonSmall,
    color: colors.white,
  },
});