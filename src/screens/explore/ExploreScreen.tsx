// src/screens/explore/ExploreScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../theme/theme';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.center}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.sub}>Map & property search coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[4] },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing[2] },
  sub: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
});
