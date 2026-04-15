import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ViewToken,
} from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParams } from '../../navigation/AuthNavigator';
import { colors, typography, radius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';

type Nav = NativeStackNavigationProp<AuthStackParams, 'Onboarding'>;

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    title: 'Find Your\nDream Home',
    subtitle: 'Browse thousands of verified properties — apartments, villas, and plots — all in one place.',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    title: 'Smart Search\n& Filters',
    subtitle: 'Filter by location, budget, BHK type, and more to find exactly what you\'re looking for.',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    title: 'Every Listing\nVerified',
    subtitle: 'Our team verifies every property so you can browse and connect with complete confidence.',
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const browseAsGuest = useAuthStore((s) => s.browseAsGuest);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  function handleNext() {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      navigation.replace('Login');
    }
  }

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={{ uri: item.image }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
            <View style={styles.overlay} />
            <View style={styles.textBlock}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      {/* Bottom controls */}
      <View style={styles.controls}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>{isLast ? 'Get Started' : 'Next'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={browseAsGuest} activeOpacity={0.7}>
          <Text style={styles.skipText}>Browse as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brandDark,
  },
  slide: {
    width,
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6,35,53,0.52)',
  },
  textBlock: {
    position: 'absolute',
    bottom: 220,
    left: 28,
    right: 28,
  },
  title: {
    ...typography.displayLarge,
    color: colors.white,
    marginBottom: 14,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.80)',
    lineHeight: 22,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 20,
    backgroundColor: 'rgba(6,35,53,0.72)',
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.white,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: {
    ...typography.button,
    color: colors.white,
  },
  skipBtn: {
    paddingVertical: 8,
  },
  skipText: {
    ...typography.body,
    color: 'rgba(255,255,255,0.60)',
  },
});
