// src/navigation/MainNavigator.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme/theme';
import { NotchedTabBarBackground } from './NotchedTabBarBackground';
import HomeIcon from '../../assets/Home.svg';
import ProfileIcon from '../../assets/Profile.svg';
import RewardsIcon from '../../assets/Rewards.svg';

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
  Filter: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParams>();
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="PropertyList" component={HomeScreen} />
      <HomeStack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
      <HomeStack.Screen name="Filter" component={FilterScreen} />
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
      <ExploreStack.Screen name="Filter" component={FilterScreen} />
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
  icon: { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap };
};

const TAB_CONFIG: TabInfo[] = [
  { name: 'HomeTab', label: 'Home', icon: { active: 'home', inactive: 'home-outline' } },
  { name: 'ExploreTab', label: 'Explore', icon: { active: 'map', inactive: 'map-outline' } },
  { name: 'RewardsTab', label: 'Rewards', icon: { active: 'ribbon', inactive: 'ribbon-outline' } },
  { name: 'WishlistTab', label: 'Wishlist', icon: { active: 'heart', inactive: 'heart-outline' } },
  {
    name: 'ProfileTab',
    label: 'Profile',
    icon: { active: 'person-circle', inactive: 'person-circle-outline' },
  },
];

const BAR_H = 76;
const H_PAD = 16;
const FAB_SIZE = 60;
const FAB_TOP = -30;
/** Inactive tab icon/label — slate gray */
const TAB_ICON_GRAY = '#64748B';

/** Frosted glass pill — matches reference: light tint, content visible underneath */
const TAB_BAR_FILL = 'rgba(255, 255, 255, 0.58)';

// ── Custom Tab Bar (notched white bar + center Rewards FAB) ────
function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const barW = screenW - H_PAD * 2;

  return (
    <View
      pointerEvents="box-none"
      style={[
        tabStyles.screenPad,
        {
          paddingBottom: Math.max(insets.bottom, 8),
          paddingHorizontal: H_PAD,
        },
      ]}
    >
      <View style={tabStyles.barSlot} pointerEvents="box-none">
        <View style={[tabStyles.barBox, { width: barW, height: BAR_H }]}>
          <NotchedTabBarBackground
            width={barW}
            height={BAR_H}
            fill={TAB_BAR_FILL}
            topCornerRadius={38}
            bottomCornerRadius={26}
            notchDepth={30}
            notchHalfWidth={54}
          />

          <View style={tabStyles.tabsRow} pointerEvents="box-none">
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
                  <View key={route.key} style={tabStyles.tabItem} pointerEvents="box-none">
                    <View style={tabStyles.rewardsIconSpacer} />
                    <Text
                      style={[tabStyles.tabLabel, isFocused && tabStyles.tabLabelActive]}
                      numberOfLines={1}
                    >
                      {label}
                    </Text>
                  </View>
                );
              }

              const iconName = isFocused ? cfg?.icon.active : cfg?.icon.inactive;
              const isHome = route.name === 'HomeTab';
              const isProfile = route.name === 'ProfileTab';
              const tabIconColor = isFocused ? colors.brand : TAB_ICON_GRAY;

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  activeOpacity={0.75}
                  style={tabStyles.tabItem}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  accessibilityState={{ selected: isFocused }}
                >
                  <View
                    style={[tabStyles.iconPill, isFocused && tabStyles.iconPillActive]}
                  >
                    {isHome ? (
                      <HomeIcon width={22} height={22} color={tabIconColor} />
                    ) : isProfile ? (
                      <ProfileIcon width={22} height={22} color={tabIconColor} />
                    ) : (
                      <Ionicons
                        name={iconName!}
                        size={22}
                        color={tabIconColor}
                      />
                    )}
                  </View>
                  <Text
                    style={[tabStyles.tabLabel, isFocused && tabStyles.tabLabelActive]}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[
              tabStyles.rewardsFabFloat,
              {
                width: FAB_SIZE,
                height: FAB_SIZE,
                borderRadius: FAB_SIZE / 2,
                top: FAB_TOP,
                marginLeft: -FAB_SIZE / 2,
              },
            ]}
            onPress={() => {
              const route = state.routes.find((r) => r.name === 'RewardsTab');
              if (!route) return;
              const idx = state.routes.indexOf(route);
              const isFocused = state.index === idx;
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name as keyof MainTabParams);
              }
            }}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Rewards"
          >
            <RewardsIcon width={28} height={28} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  /** Transparent so home / explore scroll area is visible behind the pill */
  screenPad: {
    backgroundColor: 'transparent',
  },
  barSlot: {
    alignItems: 'center',
    // paddingTop: 30,
  },
  barBox: {
    position: 'relative',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 22,
  },
  tabsRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: spacing[2],
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
    gap: 5,
    minWidth: 0,
  },
  /** Light pill behind icon when tab is selected (Explore mock) */
  iconPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 22,
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPillActive: {
    backgroundColor: colors.brandLight,
  },
  tabLabel: {
    ...typography.labelSmall,
    color: TAB_ICON_GRAY,
    fontSize: 10,
    lineHeight: 13,
  },
  tabLabelActive: {
    color: colors.brand,
    fontFamily: 'Inter_600SemiBold',
  },
  rewardsIconSpacer: {
    height: 30,
  },
  rewardsFabFloat: {
    position: 'absolute',
    left: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    zIndex: 20,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
  },
});

// ── Bottom Tabs ────────────────────────────────────────────────
const Tab = createBottomTabNavigator<MainTabParams>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        /** Let screens scroll behind the floating pill so cards show through the glass bar */
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="ExploreTab" component={ExploreStackNavigator} options={{ title: 'Explore' }} />
      <Tab.Screen name="RewardsTab" component={RewardsScreen} options={{ title: 'Rewards' }} />
      <Tab.Screen name="WishlistTab" component={SavedScreen} options={{ title: 'Wishlist' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
