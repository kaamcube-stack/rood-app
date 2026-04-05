import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

const BUILDING_IMG =
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParams } from '../../navigation/AuthNavigator';
import { colors, typography, radius } from '../../theme/theme';
import RoodLogo from '../../components/RoodLogo';

type Nav = NativeStackNavigationProp<AuthStackParams>;
type Route = RouteProp<AuthStackParams, 'Otp'>;

const OTP_LENGTH = 5;
const RESEND_SECONDS = 50;

export default function OtpScreen() {
  const navigation = useNavigation<Nav>();
  const { mode, phone, email } = useRoute<Route>().params;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [termsChecked, setTermsChecked] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const maskedContact =
    mode === 'phone'
      ? `+91 91****${(phone ?? '').slice(-4)}`
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

  function handleVerify() {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter the complete OTP');
      return;
    }
    // TODO: verify OTP via API — navigate to Create Profile
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
      <Image
        source={{ uri: BUILDING_IMG }}
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
          <Text style={s.title}>Enter OTP</Text>
          <Text style={s.subtitle}>
            An OTP has been sent via {mode === 'phone' ? 'SMS' : 'email'} to {maskedContact}
          </Text>

          {/* OTP boxes */}
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
              />
            ))}
          </View>

          {error ? (
            <View style={s.errorRow}>
              <Ionicons name="close-circle" size={15} color={colors.error} />
              <Text style={s.errorText}> {error}</Text>
            </View>
          ) : null}

          {/* Resend countdown */}
          <View style={s.resendRow}>
            {seconds > 0 ? (
              <Text style={s.resendCountdown}>
                Resend OTP in{' '}
                <Text style={s.resendTimer}>00:{pad(seconds)}</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text style={s.resendLink}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Terms */}
          <TouchableOpacity
            style={s.termsRow}
            onPress={() => setTermsChecked(!termsChecked)}
            activeOpacity={0.8}
          >
            <View style={[s.checkbox, termsChecked && s.checkboxChecked]}>
              {termsChecked && <Ionicons name="checkmark" size={11} color={colors.white} />}
            </View>
            <Text style={s.termsText}>
              By continuing, you agree to our{' '}
              <Text style={s.termsLink}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.primaryBtn, filled < OTP_LENGTH && s.primaryBtnDim]}
            onPress={handleVerify}
            activeOpacity={0.85}
          >
            <Text style={s.primaryBtnText}>Verify OTP</Text>
          </TouchableOpacity>

          <Text style={s.supportText}>
            For any issue/query please email{' '}
            <Text style={s.supportEmail}>hello@rood.in</Text>
          </Text>
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
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 12 : 28,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 28,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  otpBox: {
    flex: 1,
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    ...typography.h3,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  otpBoxFilled: {
    borderColor: colors.brand,
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
    marginVertical: 16,
  },
  resendCountdown: {
    ...typography.body,
    color: colors.textSecondary,
  },
  resendTimer: {
    ...typography.body,
    color: colors.textPrimary,
    fontFamily: 'Roboto_500Medium',
  },
  resendLink: {
    ...typography.body,
    color: colors.brand,
    fontFamily: 'Roboto_500Medium',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  termsText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  termsLink: {
    color: colors.brand,
    fontFamily: 'Roboto_500Medium',
  },
  primaryBtn: {
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryBtnDim: {
    backgroundColor: colors.primaryLight,
  },
  primaryBtnText: {
    ...typography.button,
    color: colors.white,
  },
  supportText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
  supportEmail: {
    color: colors.brand,
  },
});
