import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../../theme/theme';

const sortFilterTabs: { id: 'sort' | 'filter'; label: string }[] = [
  { id: 'sort', label: 'Sort' },
  { id: 'filter', label: 'Filter' },
];

const propertyTypeTabs = [
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'land', label: 'Land' },
];

interface FilterSortControlSectionProps {
  activeTab: 'sort' | 'filter';
  onTabChange: (tab: 'sort' | 'filter') => void;
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
}: FilterSortControlSectionProps) => {
  const { width } = useWindowDimensions();
  const toggleWidth = width - spacing.l * 2;

  return (
    <View style={styles.container}>
      {/* Drag handle */}
      <View style={styles.dragHandle} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.title}>Sort & Filters</Text>

        <TouchableOpacity
          onPress={onReset}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Sort / Filter toggle */}
      <View style={[styles.toggleContainer, { width: toggleWidth }]}>
        {sortFilterTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={[styles.toggleTab, activeTab === tab.id && styles.toggleTabActive]}
            activeOpacity={0.8}
          >
            <Text style={styles.toggleTabText}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Property type toggle — only shown in filter mode */}
      {activeTab === 'filter' && (
        <View style={[styles.toggleContainer, { width: toggleWidth }]}>
          {propertyTypeTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onPropertyTypeChange(tab.id)}
              style={[
                styles.toggleTab,
                activePropertyType === tab.id && styles.toggleTabActive,
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.toggleTabText}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 18,
    paddingVertical: spacing.l,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
  },
  dragHandle: {
    width: 74,
    height: 6,
    backgroundColor: '#E9E9E9',
    borderRadius: 64,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    alignSelf: 'stretch',
  },
  closeBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 20,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  resetText: {
    ...typography.titleSmall,
    color: '#1879DA',
  },
  toggleContainer: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    gap: 10,
    padding: 4,
    backgroundColor: colors.brandLight,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  toggleTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  toggleTabActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleTabText: {
    ...typography.titleSmall,
    color: colors.textPrimary,
  },
});
