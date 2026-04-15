import { useState, useRef, useEffect } from 'react';
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthStackParams } from '../../navigation/AuthNavigator';
import { colors, typography, radius } from '../../theme/theme';
import { verifyOtp } from '../../api/auth';
import { getApiErrorMessage } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

type Nav = NativeStackNavigationProp<AuthStackParams>;
type Route = RouteProp<AuthStackParams, 'Otp'>;

/** OTP screen — aligned with login + design reference */
const LINK_BLUE = '#407899';
const BTN_BLUE = '#8FB1CE';
const TEXT_BLACK = '#000000';
const TEXT_GRAY = '#757575';
const INPUT_BORDER = '#D1D1D1';
const CARD_RADIUS = 32;
const CARD_MARGIN_H = 12;
const CARD_SCROLL_MAX_FRAC = 0.72;
/** Logo vertical inset below safe area (smaller = higher on screen) */
const LOGO_TOP_FRAC = 0.02;

const OTP_LENGTH = 5;
const RESEND_SECONDS = 50;

const { height: SCREEN_H } = Dimensions.get('window');

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
    // alignSelf: 'center',
    marginBottom: "55%",
  },
});

export default function OtpScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const login = useAuthStore((s) => s.login);
  const { mode, phone, email, countryCode = '+91' } = useRoute<Route>().params;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [termsChecked, setTermsChecked] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const maskedContact =
    mode === 'phone'
      ? `${countryCode} •••• ${(phone ?? '').slice(-4)}`
      : (email ?? '').replace(/(.{2}).+(@.+)/, '$1***$2');

  function handleChange(val: string, idx: number) {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    setError('');
    if (digit && idx < OTP_LENGTH - 1) {
      inputs.current[idx + 1]?.focus();
    }
  }

  function handleKeyPress(e: { nativeEvent: { key: string } }, idx: number) {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      const next = [...otp];
      next[idx - 1] = '';
      setOtp(next);
      inputs.current[idx - 1]?.focus();
    }
  }

  async function handleVerify() {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter the complete OTP');
      return;
    }
    if (!termsChecked) {
      setError('Please agree to the Terms & Conditions');
      return;
    }

    if (mode === 'phone') {
      if (!phone) {
        setError('Missing phone number. Go back and try again.');
        return;
      }
      setVerifying(true);
      setError('');
      try {
        const res = await verifyOtp({
          mobile: phone,
          otp: code,
          country_code: countryCode,
        });
        const u = res.data.user;
        await login(
          {
            id: String(u.id),
            name: u.full_name ?? '',
            email: u.email ?? '',
            phone: u.mobile ?? undefined,
          },
          res.data.access_token,
        );
        navigation.navigate('Signup', { phone });
      } catch (e) {
        setError(getApiErrorMessage(e, 'Invalid OTP. Try again.'));
      } finally {
        setVerifying(false);
      }
      return;
    }

    navigation.navigate('Signup', { phone });
  }

  function handleResend() {
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    setSeconds(RESEND_SECONDS);
    inputs.current[0]?.focus();
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const filled = otp.filter(Boolean).length;

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
                <Text style={s.title}>Enter OTP</Text>
                <Text style={s.subtitle}>
                  An OTP has been sent via {mode === 'phone' ? 'SMS' : 'email'} to {maskedContact}
                </Text>

                <View style={s.otpRow}>
                  {otp.map((val, idx) => (
                    <TextInput
                      key={idx}
                      ref={(r) => {
                        inputs.current[idx] = r;
                      }}
                      style={[
                        s.otpBox,
                        val && s.otpBoxFilled,
                        !!error && s.otpBoxError,
                      ]}
                      value={val}
                      onChangeText={(v) => handleChange(v, idx)}
                      onKeyPress={(e) => handleKeyPress(e, idx)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                      selectTextOnFocus
                      placeholder="-"
                      placeholderTextColor="#C8C8C8"
                    />
                  ))}
                </View>

                {error ? (
                  <View style={s.errorRow}>
                    <Ionicons name="close-circle" size={15} color={colors.error} />
                    <Text style={s.errorText}> {error}</Text>
                  </View>
                ) : null}

                <View style={s.resendRow}>
                  {seconds > 0 ? (
                    <Text style={s.resendCountdown}>
                      Resend OTP in{' '}
                      <Text style={s.resendTimer}>
                        00:{pad(seconds)}
                      </Text>
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleResend}>
                      <Text style={s.resendLink}>Resend OTP</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  style={s.termsRow}
                  onPress={() => setTermsChecked(!termsChecked)}
                  activeOpacity={0.8}
                >
                  <View style={[s.checkbox, termsChecked && s.checkboxChecked]}>
                    {termsChecked && (
                      <Ionicons name="checkmark" size={11} color={colors.white} />
                    )}
                  </View>
                  <Text style={s.termsText}>
                    By continuing, you agree to our{' '}
                    <Text style={s.termsLink}>Terms & Conditions</Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    s.primaryBtn,
                    (filled < OTP_LENGTH || verifying) && s.primaryBtnDim,
                  ]}
                  onPress={handleVerify}
                  activeOpacity={0.85}
                  disabled={verifying}
                >
                  {verifying ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={s.primaryBtnText}>Verify OTP</Text>
                  )}
                </TouchableOpacity>

                <Text style={s.supportText}>
                  For any issue/query please email{' '}
                  <Text style={s.supportEmail}>hello@rood.in</Text>
                </Text>
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
    paddingTop: 22,
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
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: TEXT_GRAY,
    marginBottom: 22,
    lineHeight: 22,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    justifyContent: 'center',
  },
  otpBox: {
    flex: 1,
    maxWidth: 56,
    height: 52,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: radius.sm,
    ...typography.h3,
    color: TEXT_BLACK,
    backgroundColor: colors.surface,
  },
  otpBoxFilled: {
    borderColor: LINK_BLUE,
  },
  otpBoxError: {
    borderColor: colors.error,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  resendCountdown: {
    ...typography.body,
    color: TEXT_GRAY,
    textAlign: 'center',
  },
  resendTimer: {
    ...typography.body,
    color: TEXT_BLACK,
    fontFamily: 'Inter_600SemiBold',
  },
  resendLink: {
    ...typography.body,
    color: LINK_BLUE,
    fontFamily: 'Inter_600SemiBold',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 18,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: LINK_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: LINK_BLUE,
    borderColor: LINK_BLUE,
  },
  termsText: {
    ...typography.bodySmall,
    color: TEXT_GRAY,
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: LINK_BLUE,
    fontFamily: 'Inter_600SemiBold',
  },
  primaryBtn: {
    backgroundColor: BTN_BLUE,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryBtnDim: {
    opacity: 0.55,
  },
  primaryBtnText: {
    ...typography.button,
    color: colors.white,
  },
  supportText: {
    ...typography.bodySmall,
    color: TEXT_GRAY,
    textAlign: 'center',
    lineHeight: 20,
  },
  supportEmail: {
    color: LINK_BLUE,
    fontFamily: 'Inter_600SemiBold',
  },
});
