// ================================================================
// theme.ts — Rood Design (Cleaned from Figma extraction)
// ================================================================

export const colors = {
  // ── Brand ────────────────────────────────────────────────────
  brand: '#356FA1',          // ROOD logo, nav active, primary blue
  brandDark: '#062335',      // Login/signup dark navy background
  brandLight: '#EBF1F6',     // Light blue tinted backgrounds

  // ── Actions ──────────────────────────────────────────────────
  primary: '#235DFF',        // CTA buttons, splash accent
  primaryLight: '#6093F9',   // Disabled/hover button state
  primaryFaded: '#E5F0FF',   // Button background tint

  // ── Backgrounds ──────────────────────────────────────────────
  background: '#F7F7F7',     // Main app background
  surface: '#FFFFFF',        // Cards, modals, sheets
  surfaceAlt: '#F5F7F8',     // Input fields, secondary surfaces

  // ── Text ─────────────────────────────────────────────────────
  textPrimary: '#0F172A',    // Main headings, property titles
  textBody: '#1E293B',       // Body text, descriptions
  textSecondary: '#475569',  // Sub-labels, meta info
  textMuted: '#8790A9',      // Placeholder, helper text
  textInverse: '#FFFFFF',    // Text on dark backgrounds

  // ── Borders & Dividers ────────────────────────────────────────
  border: '#E2E8F0',         // Card borders, input borders
  borderStrong: '#CDCDCD',   // Active input borders
  divider: '#F1F5F9',        // Section dividers

  // ── Status ───────────────────────────────────────────────────
  success: '#16A34A',        // Rood Verified badge
  successBg: '#DCFCE7',      // Success background
  error: '#DC2626',          // Error text, validation
  errorBg: '#FEF2F2',        // Error background
  warning: '#F59E0B',        // Warning badge
  warningBg: '#FEF3C7',      // Warning background
  info: '#2563EB',           // Top Rated badge
  infoBg: '#DBEAFE',         // Info background

  // ── Property Badges (from badge variants in Figma) ────────────
  badgeNew: '#235DFF',       // New listing
  badgeVerified: '#16A34A',  // Rood Verified
  badgeFeatured: '#F59E0B',  // Featured
  badgePremium: '#DB2777',   // Premium
  badgeSold: '#DC2626',      // Sold out

  // ── Stars / Rating ────────────────────────────────────────────
  star: '#FBBF24',

  // ── Misc ─────────────────────────────────────────────────────
  overlay: 'rgba(6, 35, 53, 0.6)',   // Dark overlay on images
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#0F172A',
} as const;

// ── Typography ───────────────────────────────────────────────────
// Primary fonts found in actual screen content:
// - Urbanist → Onboarding, Auth screens (headings + body)
// - Inter    → Property screens (prices, labels, details)
// - Roboto   → System/base font (buttons, inputs)

export const typography = {
  // Display — Onboarding hero text
  displayLarge: {
    fontFamily: 'Urbanist_700Bold',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
  },
  displayMedium: {
    fontFamily: 'Urbanist_700Bold',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },

  // Headings — Screen titles
  h1: {
    fontFamily: 'Urbanist_700Bold',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  h2: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
  h3: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: 0,
  },
  h4: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },

  // Body — Content text
  bodyLarge: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },

  // Labels — Badges, tags, chips
  labelLarge: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  labelSmall: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
  },

  // Price — Property pricing (prominent)
  price: {
    fontFamily: 'Inter_900Black',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
  priceLarge: {
    fontFamily: 'Inter_900Black',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },

  // Buttons
  button: {
    fontFamily: 'Urbanist_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  buttonSmall: {
    fontFamily: 'Urbanist_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
  },

  // Caption / Meta
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
  overline: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 1,
  },
} as const;

// ── Spacing (4pt grid) ───────────────────────────────────────────
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
} as const;

// ── Border Radius ────────────────────────────────────────────────
export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

// ── Shadows ──────────────────────────────────────────────────────
export const shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHover: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  button: {
    shadowColor: '#235DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  bottomBar: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
} as const;

// ── Layout constants ─────────────────────────────────────────────
export const layout = {
  screenPadding: 16,
  cardPadding: 16,
  sectionGap: 24,
  headerHeight: 56,
  tabBarHeight: 64,
  bottomSafeArea: 34,  // iPhone notch safe area
} as const;

const theme = { colors, typography, spacing, radius, shadows, layout };
export default theme;
