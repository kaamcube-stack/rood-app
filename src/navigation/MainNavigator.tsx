// src/navigation/MainNavigator.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows } from '../theme/theme';

import HomeScreen from '../screens/listing/HomeScreen';
import ExploreScreen from '../screens/explore/ExploreScreen';
import RewardsScreen from '../screens/rewards/RewardsScreen';
import SavedScreen from '../screens/profile/SavedPropertiesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PropertyDetailScreen from '../screens/detail/PropertyDetailScreen';
import FilterScreen from '../screens/search/FilterScreen';

// ── Home Stack ─────────────────────────────────────────────────
export type HomeStackParams = {
  PropertyList: undefined;
  PropertyDetail: { propertyId: string };
};

const HomeStack = createNativeStackNavigator<HomeStackParams>();
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="PropertyList" component={HomeScreen} />
      <HomeStack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </HomeStack.Navigator>
  );
}

// ── Explore Stack ──────────────────────────────────────────────
export type ExploreStackParams = {
  Explore: undefined;
  Filter: undefined;
  PropertyDetail: { propertyId: string };
};

const ExploreStack = createNativeStackNavigator<ExploreStackParams>();
function ExploreStackNavigator() {
  return (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
      <ExploreStack.Screen name="Explore" component={ExploreScreen} />
      <ExploreStack.Screen name="Filter" component={FilterScreen} options={{ presentation: 'modal' }} />
      <ExploreStack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </ExploreStack.Navigator>
  );
}

// ── Tab config ─────────────────────────────────────────────────
export type MainTabParams = {
  HomeTab: undefined;
  ExploreTab: undefined;
  RewardsTab: undefined;
  WishlistTab: undefined;
  ProfileTab: undefined;
};

type TabInfo = {
  name: keyof MainTabParams;
  label: string;
  icon: { active: string; inactive: string };
};

const TAB_CONFIG: TabInfo[] = [
  { name: 'HomeTab',    label: 'Home',    icon: { active: 'home',        inactive: 'home-outline' } },
  { name: 'ExploreTab', label: 'Explore', icon: { active: 'map',         inactive: 'map-outline' } },
  { name: 'RewardsTab', label: 'Rewards', icon: { active: 'ribbon',      inactive: 'ribbon-outline' } },
  { name: 'WishlistTab',label: 'Wishlist',icon: { active: 'heart',       inactive: 'heart-outline' } },
  { name: 'ProfileTab', label: 'Profile', icon: { active: 'person-circle', inactive: 'person-circle-outline' } },
];

// ── Custom Tab Bar ─────────────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[tabStyles.wrapper, { paddingBottom: insets.bottom }]}>
      <View style={tabStyles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const cfg = TAB_CONFIG.find((t) => t.name === route.name);
          const label = cfg?.label ?? route.name;
          const isRewards = route.name === 'RewardsTab';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isRewards) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.85}
                style={tabStyles.rewardsItem}
              >
                <View style={[tabStyles.rewardsFab, isFocused && tabStyles.rewardsFabActive]}>
                  <Ionicons name="ribbon" size={26} color={colors.white} />
                </View>
                <Text style={[tabStyles.label, isFocused && tabStyles.labelActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          }

          const iconName = isFocused ? cfg?.icon.active : cfg?.icon.inactive;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              style={tabStyles.tabItem}
            >
              <View style={[tabStyles.iconWrap, isFocused && tabStyles.iconWrapActive]}>
                <Ionicons
                  name={iconName as any}
                  size={22}
                  color={isFocused ? colors.brand : colors.textMuted}
                />
              </View>
              <Text style={[tabStyles.label, isFocused && tabStyles.labelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    ...shadows.bottomBar,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 64,
    paddingHorizontal: spacing[2],
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing[1],
    gap: 2,
  },
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.brandLight,
  },
  label: {
    ...typography.labelSmall,
    color: colors.textMuted,
    fontSize: 10,
  },
  labelActive: {
    color: colors.brand,
  },
  // Rewards FAB
  rewardsItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing[1],
    gap: 2,
  },
  rewardsFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    marginTop: -20,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  rewardsFabActive: {
    backgroundColor: colors.brandDark,
  },
});

// ── Bottom Tabs ────────────────────────────────────────────────
const Tab = createBottomTabNavigator<MainTabParams>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab"     component={HomeStackNavigator}    options={{ title: 'Home' }} />
      <Tab.Screen name="ExploreTab"  component={ExploreStackNavigator} options={{ title: 'Explore' }} />
      <Tab.Screen name="RewardsTab"  component={RewardsScreen}         options={{ title: 'Rewards' }} />
      <Tab.Screen name="WishlistTab" component={SavedScreen}           options={{ title: 'Wishlist' }} />
      <Tab.Screen name="ProfileTab"  component={ProfileScreen}         options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
