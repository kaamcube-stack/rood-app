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
import { Ionicons } from '@expo/vector-icons';

const BUILDING_IMG =
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParams } from '../../navigation/AuthNavigator';
import { useAuthStore } from '../../store/authStore';
import { colors, typography, radius } from '../../theme/theme';

type Nav = NativeStackNavigationProp<AuthStackParams>;
type Route = RouteProp<AuthStackParams, 'Signup'>;

// ── Floating label input ──────────────────────────────────────────
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
  const floated = focused || value.length > 0;

  return (
    <View>
      <View
        style={[
          fi.box,
          focused && fi.boxFocused,
          !!error && fi.boxError,
          !editable && fi.boxDisabled,
        ]}
      >
        <Text style={[fi.label, floated && fi.labelFloated, focused && fi.labelFocusedColor]}>
          {label}
        </Text>
        <View style={fi.inputRow}>
          <TextInput
            style={fi.input}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize ?? 'words'}
            editable={editable}
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
  box: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 10,
    minHeight: 60,
    justifyContent: 'flex-end',
  },
  boxFocused: { borderColor: colors.brand },
  boxError: { borderColor: colors.error },
  boxDisabled: { backgroundColor: colors.surfaceAlt },
  label: {
    position: 'absolute',
    left: 14,
    top: 18,
    ...typography.bodyLarge,
    color: colors.textMuted,
  },
  labelFloated: {
    top: 8,
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  labelFocusedColor: { color: colors.brand },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.textPrimary,
    padding: 0,
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

// ── Phone field (read-only, pre-filled) ──────────────────────────
function PhoneField({ phone }: { phone: string }) {
  return (
    <View style={[fi.box, fi.boxDisabled]}>
      <Text style={[fi.label, fi.labelFloated]}>Mobile number</Text>
      <View style={[fi.inputRow, { gap: 10 }]}>
        <Text style={{ ...typography.bodyLarge, color: colors.textPrimary }}>+91</Text>
        <View style={{ width: 1, height: 20, backgroundColor: colors.border }} />
        <Text style={{ flex: 1, ...typography.bodyLarge, color: colors.textPrimary }}>{phone}</Text>
        <Ionicons name="phone-portrait-outline" size={20} color={colors.textMuted} />
      </View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────
export default function SignupScreen() {
  const navigation = useNavigation<Nav>();
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
      <Image
        source={{ uri: BUILDING_IMG }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={[StyleSheet.absoluteFill, s.overlay]} />

      {/* Header branding */}
      <View style={s.header}>
        <Text style={s.logoText}>ROOD.</Text>
        <View style={s.logoIconBox}>
          <Ionicons name="home" size={20} color={colors.white} />
        </View>
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
            <Text style={s.title}>Create Profile</Text>
            <Text style={s.subtitle}>Enter your name and email to Create Profile.</Text>

            <View style={{ gap: 12 }}>
              <FloatingInput
                label="First name"
                value={firstName}
                onChangeText={(t) => { setFirstName(t); clearErr('firstName'); }}
                error={errors.firstName}
              />
              <FloatingInput
                label="Surname"
                value={surname}
                onChangeText={(t) => { setSurname(t); clearErr('surname'); }}
                error={errors.surname}
              />
              <FloatingInput
                label="Email"
                value={email}
                onChangeText={(t) => { setEmail(t); clearErr('email'); }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />
              <PhoneField phone={phone} />
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
              style={[s.primaryBtn, !canSubmit && s.primaryBtnDisabled]}
              onPress={handleCreate}
              activeOpacity={0.85}
              disabled={!canSubmit}
            >
              <Text style={s.primaryBtnText}>Create Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.laterBtn} onPress={handleLater} activeOpacity={0.7}>
              <Text style={s.laterBtnText}>Do it later</Text>
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
  logoText: {
    fontFamily: 'Urbanist_700Bold',
    fontSize: 28,
    color: colors.white,
    letterSpacing: 1,
  },
  logoIconBox: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
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
    fontFamily: 'Inter_600SemiBold',
  },
  primaryBtn: {
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnDisabled: {
    backgroundColor: colors.primaryLight,
  },
  primaryBtnText: {
    ...typography.button,
    color: colors.white,
  },
  laterBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  laterBtnText: {
    ...typography.button,
    color: colors.brand,
  },
});
