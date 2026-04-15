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
} from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthStackParams } from '../../navigation/AuthNavigator';
import { useAuthStore } from '../../store/authStore';
import { colors, typography, radius } from '../../theme/theme';

type Route = RouteProp<AuthStackParams, 'Signup'>;

/** Match LoginScreen.js */
const PRIMARY_BLUE = '#86A7C3';
const TEXT_BLACK = '#000000';
const TEXT_GRAY = '#717171';
const INPUT_BORDER = '#CCCCCC';
const GUEST_BG = '#EBF2F9';
const CARD_RADIUS = 32;
const CARD_MARGIN_H = 12;
const CARD_SCROLL_MAX_FRAC = 0.7;
const LOGO_TOP_FRAC = 0.02;

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
    alignSelf: 'center',
  },
});

/** Outlined field: label always on top border (Create Profile mock). */
function FloatingInput({
  label,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  editable = true,
  error,
  rightSlot,
}: {
  label: string;
  value: string;
  onChangeText?: (t: string) => void;
  keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType'];
  autoCapitalize?: React.ComponentProps<typeof TextInput>['autoCapitalize'];
  editable?: boolean;
  error?: string;
  rightSlot?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={fi.floatWrap}>
      <View
        style={[
          fi.box,
          focused && !error && fi.boxFocused,
          !!error && fi.boxError,
          !editable && fi.boxDisabled,
        ]}
      >
        <Text
          pointerEvents="none"
          style={[fi.labelOnBorder, focused && fi.labelFocused]}
        >
          {label}
        </Text>
        <View style={fi.inputRow} collapsable={false}>
          <TextInput
            style={fi.input}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize ?? 'words'}
            editable={editable}
            placeholderTextColor="transparent"
            underlineColorAndroid="transparent"
          />
          {rightSlot}
        </View>
      </View>
      {error ? (
        <View style={fi.errorRow}>
          <Ionicons name="close-circle" size={14} color={colors.error} />
          <Text style={fi.errorText}> {error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const fi = StyleSheet.create({
  floatWrap: {
    marginBottom: 4,
    overflow: 'visible',
  },
  box: {
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 12,
    minHeight: 56,
    backgroundColor: colors.surface,
  },
  boxFocused: { borderColor: PRIMARY_BLUE },
  boxError: { borderColor: colors.error },
  boxDisabled: { backgroundColor: colors.surfaceAlt },
  labelOnBorder: {
    position: 'absolute',
    top: -9,
    left: 12,
    ...typography.bodySmall,
    color: TEXT_GRAY,
    backgroundColor: colors.surface,
    paddingHorizontal: 6,
    zIndex: 1,
  },
  labelFocused: { color: PRIMARY_BLUE },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
    zIndex: 2,
  },
  input: {
    flex: 1,
    minHeight: 28,
    paddingVertical: 0,
    ...typography.bodyLarge,
    color: TEXT_BLACK,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
  },
});

function PhoneField({ phone }: { phone: string }) {
  return (
    <View style={fi.floatWrap}>
      <View style={[fi.box, fi.boxDisabled]}>
        <Text pointerEvents="none" style={fi.labelOnBorder}>
          Mobile number
        </Text>
        <View style={[fi.inputRow, { gap: 10 }]}>
          <Text style={{ ...typography.bodyLarge, color: TEXT_BLACK }}>+91</Text>
          <View style={{ width: 1, height: 20, backgroundColor: INPUT_BORDER }} />
          <Text style={{ flex: 1, ...typography.bodyLarge, color: TEXT_BLACK }}>{phone}</Text>
          <Ionicons name="phone-portrait-outline" size={20} color={TEXT_GRAY} />
        </View>
      </View>
    </View>
  );
}

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { phone = '' } = useRoute<Route>().params ?? {};
  const login = useAuthStore((s) => s.login);

  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function clearErr(field: string) {
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!surname.trim()) errs.surname = 'Surname is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleCreate() {
    if (!validate()) return;
    await login(
      { id: Date.now().toString(), name: `${firstName} ${surname}`, email, phone },
      'mock_token',
    );
  }

  async function handleLater() {
    await login(
      { id: Date.now().toString(), name: 'Guest', email: '', phone },
      'mock_token',
    );
  }

  const canSubmit = termsChecked && !!firstName && !!surname && !!email;

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
                <Text style={s.title}>Create Profile</Text>
                <Text style={s.subtitle}>
                  Enter your name and email to Create Profile.
                </Text>

                <View style={s.fields}>
                  <FloatingInput
                    label="First name"
                    value={firstName}
                    onChangeText={(t) => {
                      setFirstName(t);
                      clearErr('firstName');
                    }}
                    error={errors.firstName}
                  />
                  <FloatingInput
                    label="Surname"
                    value={surname}
                    onChangeText={(t) => {
                      setSurname(t);
                      clearErr('surname');
                    }}
                    error={errors.surname}
                  />
                  <FloatingInput
                    label="Email"
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      clearErr('email');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email}
                  />
                  <PhoneField phone={phone} />
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
                  style={[s.primaryBtn, !canSubmit && s.primaryBtnDisabled]}
                  onPress={handleCreate}
                  activeOpacity={0.85}
                  disabled={!canSubmit}
                >
                  <Text style={s.primaryBtnText}>Create Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={s.laterBtn}
                  onPress={handleLater}
                  activeOpacity={0.8}
                >
                  <Text style={s.laterBtnText}>Do it later</Text>
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
    marginBottom: 18,
    lineHeight: 22,
  },
  fields: {
    gap: 14,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    marginBottom: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: PRIMARY_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
  },
  termsText: {
    ...typography.bodySmall,
    color: TEXT_GRAY,
    flex: 1,
  },
  termsLink: {
    color: PRIMARY_BLUE,
    fontFamily: 'Inter_600SemiBold',
  },
  primaryBtn: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnDisabled: {
    opacity: 0.45,
  },
  primaryBtnText: {
    ...typography.button,
    color: colors.white,
  },
  laterBtn: {
    backgroundColor: GUEST_BG,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 8,
  },
  laterBtnText: {
    ...typography.button,
    color: PRIMARY_BLUE,
    fontFamily: 'Urbanist_600SemiBold',
  },
});
