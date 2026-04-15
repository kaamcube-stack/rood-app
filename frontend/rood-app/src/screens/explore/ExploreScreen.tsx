// src/screens/explore/ExploreScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ExploreStackParams } from '../../navigation/MainNavigator';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView as SafeArea } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../theme/theme';

export default function ExploreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ExploreStackParams>>();

  const openFilterScreen = () => {
    console.log('Opening filter screen...');
    try {
      navigation.navigate('Filter');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <SafeArea style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sort & Filters</Text>
          <TouchableOpacity style={styles.resetButton}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.sub}>Map & property search coming soon</Text>
          
          <TouchableOpacity style={styles.filterButton} onPress={openFilterScreen}>
            <Ionicons name="filter" size={20} color={colors.white} />
            <Text style={styles.filterButtonText}>Open Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { 
    flex: 1, 
    padding: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  title: { 
    ...typography.h2, 
    color: colors.textPrimary,
    fontSize: 20,
  },
  resetButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  resetText: {
    ...typography.body,
    color: colors.primary,
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: spacing[4] 
  },
  sub: { 
    ...typography.body, 
    color: colors.textMuted, 
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 8,
    gap: spacing[2],
  },
  filterButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
