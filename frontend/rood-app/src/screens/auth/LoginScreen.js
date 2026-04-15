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
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, radius } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';
import { sendOtp } from '../../api/auth';
import { getApiErrorMessage } from '../../api/client';
import { SvgXml } from 'react-native-svg';
import GoogleIcon from '../../../assets/Google.svg';
import FacebookIcon from '../../../assets/facebook.svg';

const DEFAULT_COUNTRY_CODE = '+91';

/** Design tokens — login screen (Figma reference). */
const PRIMARY_BLUE = '#86A7C3';
const TEXT_BLACK = '#000000';
const TEXT_GRAY = '#717171';
const INPUT_BORDER = '#CCCCCC';
const TOGGLE_TRACK = '#EBF2F9';
const GUEST_BG = '#EBF2F9';
/** Floating panel — inset from screen edges, all corners rounded. */
const CARD_RADIUS = 32;
const CARD_MARGIN_H = 12;
const CARD_SCROLL_MAX_FRAC = 0.7;
const BTN_RADIUS = 20;
/** Logo vertical inset below safe area (smaller = higher on screen) */
const LOGO_TOP_FRAC = 0.02;

function RoodLogo() {
  return (
    <Image
      source={require('../../../assets/logo.png')}
      style={logoStyles.img}
      contentFit="contain"
      accessibilityLabel="Rood"
    />
  );
}

const logoStyles = StyleSheet.create({
  img: {
    width: 162,
    height: 54,
    alignSelf: 'center',
    // marginBottom: "35%",
  },
});

/** Inline phone icon — stroke follows parent tint. */
function phoneIconXml(stroke) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="20" viewBox="0 0 12 18" fill="none">
  <path d="M0.763916 3.6528V14.125C0.763916 15.1361 0.763916 15.6417 0.980402 16.0272C1.17107 16.3675 1.47395 16.6438 1.84833 16.8171C2.27237 17.0139 2.82848 17.0139 3.93871 17.0139H7.51967C8.62991 17.0139 9.18503 17.0139 9.60906 16.8171C9.98328 16.6439 10.2875 16.3674 10.478 16.0272C10.6945 15.6417 10.6945 15.137 10.6945 14.1277V3.6501C10.6945 2.64079 10.6945 2.13524 10.478 1.74975C10.2873 1.40989 9.98312 1.13367 9.60906 0.960722C9.18503 0.763916 8.62892 0.763916 7.51669 0.763916H3.94169C2.82947 0.763916 2.27336 0.763916 1.84833 0.960722C1.47464 1.13382 1.17081 1.41003 0.980402 1.74975C0.763916 2.13614 0.763916 2.64169 0.763916 3.6528Z" stroke="${stroke}" stroke-width="1.52778" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="5.72929" cy="13.9412" r="0.610885" fill="${stroke}"/>
  <circle cx="5.72929" cy="10.8472" r="0.610885" fill="${stroke}"/>
  <circle cx="5.72929" cy="8.78435" r="0.610885" fill="${stroke}"/>
  <circle cx="5.72929" cy="6.72166" r="0.610885" fill="${stroke}"/>
  <circle cx="7.79204" cy="10.8472" r="0.610885" fill="${stroke}"/>
  <circle cx="7.79204" cy="8.78435" r="0.610885" fill="${stroke}"/>
  <circle cx="7.79204" cy="6.72166" r="0.610885" fill="${stroke}"/>
  <circle cx="3.66655" cy="10.8472" r="0.610885" fill="${stroke}"/>
  <circle cx="3.66655" cy="8.78435" r="0.610885" fill="${stroke}"/>
  <circle cx="3.66655" cy="6.72166" r="0.610885" fill="${stroke}"/>
</svg>`;
}

const { height: SCREEN_H } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const browseAsGuest = useAuthStore((s) => s.browseAsGuest);
  const [mode, setMode] = useState('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  async function handleContinue() {
    if (!validate()) return;

    if (mode === 'email') {
      navigation.navigate('Otp', {
        mode,
        email,
      });
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await sendOtp({
        mobile: phone,
        country_code: DEFAULT_COUNTRY_CODE,
      });
      navigation.navigate('Otp', {
        mode: 'phone',
        phone,
        countryCode: DEFAULT_COUNTRY_CODE,
      });
    } catch (e) {
      setError(getApiErrorMessage(e, 'Could not send OTP. Try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(m) {
    setMode(m);
    setError('');
    setPhone('');
    setEmail('');
    setFocused(false);
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Image
        source={require('../../../assets/SignUpbackground.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={[StyleSheet.absoluteFill, s.overlay]} />

      <KeyboardAvoidingView
        style={s.kavRoot}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={s.column}>
          <View
            style={[
              s.hero,
              { paddingTop: insets.top + SCREEN_H * LOGO_TOP_FRAC },
            ]}
          >
            <RoodLogo />
          </View>

          <View
            style={[
              s.sheetOuter,
              { paddingBottom: Math.max(insets.bottom, 14) },
            ]}
          >
            <View style={s.sheetCard}>
              <ScrollView
                style={{ maxHeight: SCREEN_H * CARD_SCROLL_MAX_FRAC }}
                contentContainerStyle={s.sheetInner}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
              <Text style={s.title}>Log in or sign up</Text>
              <Text style={s.subtitle}>
                Enter your {mode === 'phone' ? 'phone number' : 'email address'}. We will send you a
                confirmation code there.
              </Text>

              <View style={s.toggleContainer}>
                <TouchableOpacity
                  style={[s.toggleTab, mode === 'phone' && s.toggleTabActive]}
                  onPress={() => switchMode('phone')}
                  activeOpacity={0.85}
                >

                  <Text style={[s.toggleText, mode === 'phone' && s.toggleTextActive]}>By phone</Text>
                  <SvgXml
                    xml={phoneIconXml(mode === 'phone' ? TEXT_BLACK : TEXT_GRAY)}
                    width={16}
                    height={18}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.toggleTab, mode === 'email' && s.toggleTabActive]}
                  onPress={() => switchMode('email')}
                  activeOpacity={0.85}
                >
                  <Text style={[s.toggleText, mode === 'email' && s.toggleTextActive]}>By email</Text>
                  <Ionicons
                    name="mail-outline"
                    size={17}
                    color={mode === 'email' ? TEXT_BLACK : TEXT_GRAY}
                  />
                </TouchableOpacity>
              </View>

              {mode === 'phone' ? (
                <View style={s.floatWrap}>
                  <View
                    style={[
                      s.inputShell,
                      focused && !error && s.inputShellFocused,
                      !!error && s.inputShellError,
                    ]}
                  >
                    <Text style={[s.floatLabel, focused && s.floatLabelFocus]}>
                      Enter 10-digit mobile number
                    </Text>
                    <View style={s.phoneRow}>
                      <Text style={s.prefix}>{DEFAULT_COUNTRY_CODE}</Text>
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
                        placeholderTextColor="transparent"
                      />
                      <SvgXml
                        xml={phoneIconXml(mode === 'phone' ? TEXT_BLACK : TEXT_GRAY)}
                        width={16}
                        height={18}
                      />
                    </View>
                  </View>
                </View>
              ) : (
                <View style={s.floatWrap}>
                  <View
                    style={[
                      s.inputShell,
                      focused && !error && s.inputShellFocused,
                      !!error && s.inputShellError,
                    ]}
                  >
                    <Text style={[s.floatLabel, focused && s.floatLabelFocus]}>
                      Enter your email address
                    </Text>
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
                      placeholderTextColor="transparent"
                    />
                  </View>
                </View>
              )}

              {error ? (
                <View style={s.errorRow}>
                  <Ionicons name="close-circle" size={15} color={colors.error} />
                  <Text style={s.errorText}> {error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[s.primaryBtn, submitting && s.primaryBtnDisabled]}
                onPress={handleContinue}
                activeOpacity={0.85}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={s.primaryBtnText}>Continue</Text>
                )}
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
                <GoogleIcon width={22} height={23} />
                <Text style={s.socialLabel}>Continue with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.socialBtn} activeOpacity={0.8}>
                <FacebookIcon width={22} height={22} />
                <Text style={s.socialLabel}>Continue with Facebook</Text>
              </TouchableOpacity>

              </ScrollView>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  kavRoot: {
    flex: 1,
  },
  column: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 12,
  },
  sheetOuter: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: CARD_MARGIN_H,
  },
  sheetCard: {
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.surface,
    paddingTop: 20,
    paddingHorizontal: 18,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 12,
  },
  sheetInner: {
    paddingBottom: 12,
  },
  title: {
    ...typography.h1,
    color: TEXT_BLACK,
    marginBottom: 6,
  },
  subtitle: {
    ...typography.body,
    color: TEXT_GRAY,
    marginBottom: 14,
    lineHeight: 22,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: TOGGLE_TRACK,
    borderRadius: radius.full,
    padding: 4,
    marginBottom: 14,
  },
  toggleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: radius.full,
    gap: 6,
  },
  toggleTabActive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    ...typography.buttonSmall,
    color: TEXT_GRAY,
  },
  toggleTextActive: {
    color: TEXT_BLACK,
  },
  floatWrap: {
    marginBottom: 4,
    marginTop: 4,
    overflow: 'visible',
  },
  inputShell: {
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.surface,
  },
  inputShellFocused: {
    borderColor: PRIMARY_BLUE,
  },
  inputShellError: {
    borderColor: colors.error,
  },
  floatLabel: {
    position: 'absolute',
    top: -9,
    left: 12,
    ...typography.bodySmall,
    backgroundColor: colors.surface,
    paddingHorizontal: 6,
    color: TEXT_GRAY,
    zIndex: 1,
  },
  floatLabelFocus: {
    color: PRIMARY_BLUE,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  prefix: {
    ...typography.bodyLarge,
    color: TEXT_BLACK,
  },
  prefixDivider: {
    width: 1,
    height: 20,
    backgroundColor: INPUT_BORDER,
  },
  phoneInput: {
    flex: 1,
    ...typography.bodyLarge,
    color: TEXT_BLACK,
    padding: 0,
  },
  emailInput: {
    ...typography.bodyLarge,
    color: TEXT_BLACK,
    padding: 0,
    marginTop: 8,
    minHeight: 24,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
  },
  primaryBtn: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: BTN_RADIUS,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  primaryBtnText: {
    ...typography.button,
    color: colors.white,
  },
  primaryBtnDisabled: {
    opacity: 0.75,
  },
  guestBtn: {
    backgroundColor: GUEST_BG,
    borderRadius: BTN_RADIUS,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  guestBtnText: {
    ...typography.button,
    color: PRIMARY_BLUE,
    fontFamily: 'Urbanist_600SemiBold',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: INPUT_BORDER,
  },
  orLabel: {
    ...typography.caption,
    color: TEXT_GRAY,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: BTN_RADIUS,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  socialLabel: {
    ...typography.body,
    color: TEXT_BLACK,
  },
});
