import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { colors, typography, spacing } from '../../../theme/theme';

const sortOptions = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'price-low-high', label: 'Price - Low to High' },
  { id: 'price-high-low', label: 'Price - High to Low' },
  { id: 'newest-first', label: 'Newest First' },
  { id: 'oldest-first', label: 'Oldest First' },
  { id: 'area-low-high', label: 'Area - Low to High' },
  { id: 'area-high-low', label: 'Area - High to Low' },
  { id: 'price-per-sqft', label: 'Price per Sq.Ft' },
];

interface SortPanelProps {
  onApply?: (selected: string) => void;
}

export const SortPanel = ({ onApply }: SortPanelProps) => {
  const [selected, setSelected] = useState<string>('relevance');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.borderTop}>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => setSelected(option.id)}
            style={[styles.row, selected === option.id && styles.rowActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, selected === option.id && styles.labelActive]}>
              {option.label}
            </Text>
            <View style={[styles.radio, selected === option.id && styles.radioActive]}>
              {selected === option.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    backgroundColor: colors.surface,
  },
  rowActive: {
    backgroundColor: colors.brandLight,
  },
  label: {
    ...typography.body,
    color: '#616363',
  },
  labelActive: {
    ...typography.titleSmall,
    color: colors.brand,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C4C4C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.brand,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand,
  },
});
