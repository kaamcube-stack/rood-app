import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParams } from '../../navigation/AuthNavigator';
import { colors } from '../../theme/theme';

type Nav = NativeStackNavigationProp<AuthStackParams, 'Splash'>;

// Real estate photos shown inside the O-shaped pills
// Replace with local assets (e.g. require('../../../assets/splash-city.jpg')) for offline use
const CITY_IMG =
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=300&q=80';
const INTERIOR_IMG =
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80';

const LETTER_SIZE = 52;
const PILL_H = LETTER_SIZE + 4; // slight extra height for visual balance
const PILL_W = Math.round(PILL_H * 1.55);

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    const id = setTimeout(() => navigation.replace('Onboarding'), 2500);
    return () => clearTimeout(id);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* App icon */}
      <View style={styles.iconWrap}>
        <Image
          source={require('../../../assets/icon.png')}
          style={styles.icon}
          contentFit="cover"
        />
      </View>

      {/* R [O-pill] [O-pill] D. */}
      <View style={styles.wordRow}>
        <Text style={styles.letter}>R</Text>

        <View style={styles.pill}>
          <Image source={{ uri: CITY_IMG }} style={styles.pillImg} contentFit="cover" />
        </View>

        <View style={styles.pill}>
          <Image source={{ uri: INTERIOR_IMG }} style={styles.pillImg} contentFit="cover" />
        </View>

        <Text style={styles.letter}>D.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF1F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 28,
  },
  icon: {
    width: 64,
    height: 64,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  letter: {
    fontFamily: 'Inter_900Black',
    fontSize: LETTER_SIZE,
    lineHeight: LETTER_SIZE + 4,
    color: colors.brand,
  },
  pill: {
    width: PILL_W,
    height: PILL_H,
    borderRadius: PILL_H / 2,
    overflow: 'hidden',
  },
  pillImg: {
    width: '100%',
    height: '100%',
  },
});
