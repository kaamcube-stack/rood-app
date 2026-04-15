// src/screens/rewards/RewardsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme/theme';

export default function RewardsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.center}>
        <View style={styles.iconWrap}>
          <Ionicons name="ribbon" size={48} color={colors.brand} />
        </View>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.sub}>Earn points with every property interaction</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[4] },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing[2] },
  sub: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
});
