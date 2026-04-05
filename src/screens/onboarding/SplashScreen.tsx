import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParams } from '../../navigation/AuthNavigator';

type Nav = NativeStackNavigationProp<AuthStackParams, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const id = setTimeout(() => navigation.replace('Login'), 2500);
    return () => clearTimeout(id);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Full-screen background photo */}
      <Image
        source={require('../../../assets/splash-building.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      {/* Logo */}
      <View style={[styles.logoWrap, { paddingTop: insets.top + 24 }]}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoWrap: {
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 56,
  },
});
