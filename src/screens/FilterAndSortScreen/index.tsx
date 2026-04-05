import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FilterSortControlSection } from './sections/FilterSortControlSection';
import { QuickFilterGridSection } from './sections/QuickFilterGridSection';
import { SortPanel } from './sections/SortPanel';
import { colors, typography, spacing, radius, shadows } from '../../theme/theme';

export default function FilterAndSortScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'sort' | 'filter'>('filter');
  const [activePropertyType, setActivePropertyType] = useState('residential');
  const [resultCount] = useState(1248);

  const handleReset = () => {
    // Reset logic — wire to child state via context/callback if needed
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.sheet}>
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
        <View style={styles.content}>
          {activeTab === 'filter' ? (
            <QuickFilterGridSection />
          ) : (
            <SortPanel />
          )}
        </View>

        {/* Bottom Apply Bar */}
        <View style={styles.applyBar}>
          <View style={styles.resultInfo}>
            <Text style={styles.resultLabel}>Properties found</Text>
            <Text style={styles.resultCount}>
              {resultCount.toLocaleString()} Results
            </Text>
          </View>

          <TouchableOpacity style={styles.applyBtn} activeOpacity={0.85}>
            <Text style={styles.applyBtnText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  // Apply bar
  applyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
  },
  resultInfo: {
    gap: 2,
  },
  resultLabel: {
    ...typography.bodySmall,
    color: '#858585',
  },
  resultCount: {
    ...typography.titleLarge,
    color: colors.textPrimary,
  },
  applyBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  applyBtnText: {
    ...typography.buttonSmall,
    color: colors.textInverse,
  },
});
