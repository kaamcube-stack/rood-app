import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParams } from '../../navigation/AuthNavigator';
import { colors, typography, radius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';
import RoodLogo from '../../components/RoodLogo';

const BUILDING_IMG = require('../../../assets/splash-building.png');

type Nav = NativeStackNavigationProp<AuthStackParams>;
type Mode = 'phone' | 'email';

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const browseAsGuest = useAuthStore((s) => s.browseAsGuest);
  const [mode, setMode] = useState<Mode>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  function validate() {
    if (mode === 'phone') {
      if (!/^\d{10}$/.test(phone)) {
        setError('Please enter a valid phone number');
        return false;
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email');
        return false;
      }
    }
    setError('');
    return true;
  }

  function handleContinue() {
    if (validate()) {
      navigation.navigate('Otp', {
        mode,
        phone: mode === 'phone' ? phone : undefined,
        email: mode === 'email' ? email : undefined,
      });
    }
  }

  function switchMode(m: Mode) {
    setMode(m);
    setError('');
    setPhone('');
    setEmail('');
  }

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={BUILDING_IMG}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={[StyleSheet.absoluteFill, s.overlay]} />

      {/* Header branding */}
      <View style={s.header}>
        <RoodLogo width={110} variant="light" />
      </View>

      {/* Bottom sheet */}
      <KeyboardAvoidingView
        style={s.kavWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={s.sheet}>
          <ScrollView
            contentContainerStyle={s.sheetInner}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={s.title}>Log in or sign up</Text>
            <Text style={s.subtitle}>
              Enter your {mode === 'phone' ? 'phone number' : 'email address'}. We will send you a
              confirmation code there.
            </Text>

            {/* Mode toggle */}
            <View style={s.toggleContainer}>
              <TouchableOpacity
                style={[s.toggleTab, mode === 'phone' && s.toggleTabActive]}
                onPress={() => switchMode('phone')}
                activeOpacity={0.8}
              >
                <Image
                  source={require('../../../assets/icon-mobile.png')}
                  style={[s.toggleIcon, { tintColor: mode === 'phone' ? colors.textPrimary : colors.textMuted }]}
                  contentFit="contain"
                />
                <Text style={[s.toggleText, mode === 'phone' && s.toggleTextActive]}>
                  By phone
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.toggleTab, mode === 'email' && s.toggleTabActive]}
                onPress={() => switchMode('email')}
                activeOpacity={0.8}
              >
                <Image
                  source={require('../../../assets/icon-mail.png')}
                  style={[s.toggleIcon, { tintColor: mode === 'email' ? colors.textPrimary : colors.textMuted }]}
                  contentFit="contain"
                />
                <Text style={[s.toggleText, mode === 'email' && s.toggleTextActive]}>
                  By email
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input field */}
            <View
              style={[
                s.inputBox,
                focused && !error && s.inputBoxFocused,
                !!error && s.inputBoxError,
              ]}
            >
              <Text style={s.inputLabel}>
                {mode === 'phone' ? 'Enter 10-digit mobile number' : 'Enter your email address'}
              </Text>
              {mode === 'phone' ? (
                <View style={s.phoneRow}>
                  <Text style={s.prefix}>+91</Text>
                  <View style={s.prefixDivider} />
                  <TextInput
                    style={s.phoneInput}
                    value={phone}
                    onChangeText={(t) => {
                      setPhone(t.replace(/\D/g, ''));
                      setError('');
                    }}
                    keyboardType="phone-pad"
                    maxLength={10}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                  />
                  <Ionicons name="phone-portrait-outline" size={20} color={colors.textMuted} />
                </View>
              ) : (
                <TextInput
                  style={s.emailInput}
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              )}
            </View>

            {error ? (
              <View style={s.errorRow}>
                <Ionicons name="close-circle" size={15} color={colors.error} />
                <Text style={s.errorText}> {error}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={s.primaryBtn} onPress={handleContinue} activeOpacity={0.85}>
              <Text style={s.primaryBtnText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.primaryBtn} onPress={() => navigation.navigate('Signup', {})} activeOpacity={0.85}>
              <Text style={s.primaryBtnText}>Create Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.guestBtn} onPress={browseAsGuest} activeOpacity={0.8}>
              <Text style={s.guestBtnText}>Browse as Guest</Text>
            </TouchableOpacity>

            <View style={s.orRow}>
              <View style={s.orLine} />
              <Text style={s.orLabel}>or</Text>
              <View style={s.orLine} />
            </View>

            <TouchableOpacity style={s.socialBtn} activeOpacity={0.8}>
              <AntDesign name="google" size={22} color="#EA4335" />
              <Text style={s.socialLabel}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.socialBtn} activeOpacity={0.8}>
              <FontAwesome name="facebook" size={22} color="#1877F2" />
              <Text style={s.socialLabel}>Continue with Facebook</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 72,
    gap: 10,
  },
  kavWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 8 : 24,
  },
  sheetInner: {
    paddingBottom: 16,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    padding: 4,
    marginBottom: 20,
  },
  toggleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: radius.full,
  },
  toggleTabActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleIcon: {
    width: 16,
    height: 16,
  },
  toggleText: {
    ...typography.labelLarge,
    color: colors.textMuted,
  },
  toggleTextActive: {
    color: colors.textPrimary,
    fontFamily: 'Roboto_500Medium',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 4,
  },
  inputBoxFocused: {
    borderColor: colors.brand,
  },
  inputBoxError: {
    borderColor: colors.error,
  },
  inputLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: 6,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prefix: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
  },
  prefixDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
  },
  phoneInput: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.textPrimary,
    padding: 0,
  },
  emailInput: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    padding: 0,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
  },
  primaryBtn: {
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  primaryBtnText: {
    ...typography.button,
    color: colors.white,
  },
  guestBtn: {
    backgroundColor: colors.brandLight,
    borderRadius: radius.sm,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 16,
  },
  guestBtnText: {
    ...typography.button,
    color: colors.brand,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  socialLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
