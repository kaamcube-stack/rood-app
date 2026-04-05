import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../../theme/theme';

const SCREEN_W = Dimensions.get('window').width;

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_LABELS = ['M','T','W','T','F','S','S'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Returns the weekday index (0=Mon … 6=Sun) of the 1st of the month
function getFirstDayOffset(year: number, month: number) {
  const day = new Date(year, month, 1).getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1;
}

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

// ── Time slot data ────────────────────────────────────────────────────────────

const TIME_SECTIONS = [
  {
    label: 'Morning',
    icon: '🌅',
    slots: [
      '10:00 - 10:30','10:30 - 11:00','11:00 - 11:30',
      '11:30 - 12:00','12:00 - 12:30','12:30 - 01:00',
    ],
  },
  {
    label: 'Afternoon',
    icon: '☀️',
    slots: [
      '01:00 - 01:30','01:30 - 02:00','02:00 - 02:30',
      '02:30 - 03:00','03:00 - 03:30','03:30 - 04:00',
    ],
  },
  {
    label: 'Evening',
    icon: '🌙',
    slots: [
      '04:00 - 04:30','04:30 - 05:00','05:00 - 05:30',
      '05:30 - 06:00','06:00 - 06:30','06:30 - 07:00',
    ],
  },
];

// ── Floating label field ──────────────────────────────────────────────────────

function FloatingField({
  label,
  value,
  placeholder,
  rightIcon,
  onPress,
  filled,
  prefix,
  prefixRight,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  rightIcon: React.ReactNode;
  onPress: () => void;
  filled: boolean;
  prefix?: React.ReactNode;
  prefixRight?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.field, filled && styles.fieldFilled]}
    >
      <Text style={[styles.fieldLabel, filled && styles.fieldLabelFilled]}>{label} *</Text>
      <View style={styles.fieldRow}>
        {prefix}
        <Text style={[styles.fieldValue, !value && styles.fieldPlaceholder]} numberOfLines={1}>
          {value ?? placeholder ?? ''}
        </Text>
        <View style={styles.fieldIcons}>
          {prefixRight}
          {rightIcon}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Calendar Modal ────────────────────────────────────────────────────────────

function CalendarModal({
  visible,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState<number | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const offset = getFirstDayOffset(year, month);
  const cells = Array.from({ length: offset + daysInMonth }, (_, i) =>
    i < offset ? null : i - offset + 1,
  );
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelected(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelected(null);
  };

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(new Date(year, month, selected));
    setSelected(null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.calendarSheet}>
          {/* Header */}
          <View style={styles.calHeader}>
            <TouchableOpacity onPress={prevMonth} style={styles.calArrow}>
              <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.calMonthLabel}>{MONTHS[month]}</Text>
            <TouchableOpacity onPress={nextMonth} style={styles.calArrow}>
              <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Day labels */}
          <View style={styles.calDayRow}>
            {DAY_LABELS.map((d, i) => (
              <Text key={i} style={styles.calDayLabel}>{d}</Text>
            ))}
          </View>

          {/* Date grid */}
          <View style={styles.calGrid}>
            {cells.map((day, i) => {
              const isSelected = day !== null && day === selected;
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.calCell}
                  activeOpacity={day ? 0.7 : 1}
                  onPress={() => day && setSelected(day)}
                >
                  {day ? (
                    <View style={[styles.calDayWrap, isSelected && styles.calDaySelected]}>
                      <Text style={[styles.calDayText, isSelected && styles.calDayTextSelected]}>
                        {day}
                      </Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.confirmBtn, selected && styles.confirmBtnActive]}
            activeOpacity={selected ? 0.85 : 1}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmBtnText}>Confirm</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Time Slot Modal ───────────────────────────────────────────────────────────

function TimeSlotModal({
  visible,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (slot: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
    setSelected(null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.timeSheet}>
          <Text style={styles.timeSheetTitle}>Select a Time Slot</Text>
          <Text style={styles.timeSheetSub}>
            We are available between{' '}
            <Text style={styles.timeSheetSubBold}>10:00 am</Text> to{' '}
            <Text style={styles.timeSheetSubBold}>7:00 pm.</Text>
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.timeScrollArea}>
            {TIME_SECTIONS.map((section) => (
              <View key={section.label} style={styles.timeSection}>
                <Text style={styles.timeSectionLabel}>
                  {section.icon}  {section.label}
                </Text>
                <View style={styles.slotGrid}>
                  {section.slots.map((slot) => {
                    const isSelected = slot === selected;
                    return (
                      <TouchableOpacity
                        key={slot}
                        onPress={() => setSelected(slot)}
                        activeOpacity={0.75}
                        style={[styles.slotChip, isSelected && styles.slotChipSelected]}
                      >
                        <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>
                          {slot}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.confirmBtn, selected && styles.confirmBtnActive]}
            activeOpacity={selected ? 0.85 : 1}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmBtnText}>Confirm</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Contact Us Sheet ──────────────────────────────────────────────────────────
// Rendered as a self-contained RN Modal so the tab bar stays fully interactive.

const PRE_FILLED_PHONE = '9437368432';

export default function ContactUsSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const dateLabel = selectedDate
    ? `${ordinal(selectedDate.getDate())} ${MONTHS[selectedDate.getMonth()].slice(0, 3)}`
    : undefined;

  const isReady = !!selectedDate && !!selectedTime;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Dim backdrop — tap to dismiss */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.l }]}>
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Title */}
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.subtitle}>
          Choose a date and time, someone from our team will get in touch with you.
        </Text>

        {/* Date field */}
        <FloatingField
          label="Choose date"
          value={dateLabel}
          filled={!!selectedDate}
          onPress={() => setShowCalendar(true)}
          rightIcon={
            <Ionicons
              name="calendar-outline"
              size={20}
              color={selectedDate ? colors.brand : colors.textMuted}
            />
          }
        />

        {/* Time field */}
        <FloatingField
          label="Choose time"
          value={selectedTime ?? undefined}
          filled={!!selectedTime}
          onPress={() => setShowTime(true)}
          rightIcon={
            <Ionicons
              name="time-outline"
              size={20}
              color={selectedTime ? colors.brand : colors.textMuted}
            />
          }
        />

        {/* Phone field — pre-filled */}
        <FloatingField
          label="Enter 10-digit mobile number"
          value={PRE_FILLED_PHONE}
          filled
          onPress={() => {}}
          prefix={
            <View style={styles.phonePrefix}>
              <Text style={styles.phonePrefixText}>+91</Text>
              <View style={styles.phoneDivider} />
            </View>
          }
          prefixRight={
            <TouchableOpacity style={styles.phoneIcon}>
              <Ionicons name="pencil-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          }
          rightIcon={
            <TouchableOpacity style={styles.phoneIcon}>
              <MaterialCommunityIcons name="cellphone" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          }
        />

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaBtn, isReady && styles.ctaBtnActive]}
          activeOpacity={isReady ? 0.85 : 0.6}
          onPress={() => { if (isReady) onClose(); }}
        >
          <Text style={styles.ctaText}>SCHEDULE CALL</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </TouchableOpacity>

        {/* Calendar picker */}
        <CalendarModal
          visible={showCalendar}
          onClose={() => setShowCalendar(false)}
          onConfirm={(date) => { setSelectedDate(date); setShowCalendar(false); }}
        />

        {/* Time slot picker */}
        <TimeSlotModal
          visible={showTime}
          onClose={() => setShowTime(false)}
          onConfirm={(slot) => { setSelectedTime(slot); setShowTime(false); }}
        />
      </View>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const FIELD_RADIUS = radius.md;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.m,
    gap: spacing.l,
  },

  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    marginBottom: spacing.xs,
  },

  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: -spacing.s,
    lineHeight: 22,
  },

  // Floating label field
  field: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: FIELD_RADIUS,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
    paddingBottom: spacing.m,
    position: 'relative',
  },
  fieldFilled: {
    borderColor: colors.brand,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.textMuted,
    position: 'absolute',
    top: -9,
    left: spacing.m,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xs,
    letterSpacing: 0,
  },
  fieldLabelFilled: {
    color: colors.brand,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldValue: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  fieldPlaceholder: {
    color: colors.transparent,
  },
  fieldIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },

  // Phone prefix
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.s,
  },
  phonePrefixText: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginRight: spacing.s,
  },
  phoneDivider: {
    width: 1,
    height: 18,
    backgroundColor: colors.border,
  },
  phoneIcon: {
    padding: 2,
  },

  // CTA button
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: '#7FAEC8',
    marginTop: spacing.xs,
  },
  ctaBtnActive: {
    backgroundColor: colors.brand,
    ...shadows.button,
  },
  ctaText: {
    ...typography.button,
    color: colors.white,
    letterSpacing: 1,
  },

  // Overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },

  // Calendar sheet
  calendarSheet: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.m,
  },
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  calArrow: {
    padding: spacing.xs,
  },
  calMonthLabel: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  calDayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xs,
  },
  calDayLabel: {
    ...typography.labelLarge,
    color: colors.textSecondary,
    width: 36,
    textAlign: 'center',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDaySelected: {
    backgroundColor: colors.brand,
  },
  calDayText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  calDayTextSelected: {
    color: colors.white,
    fontFamily: 'Roboto_500Medium',
  },

  // Time slot sheet
  timeSheet: {
    width: '100%',
    maxHeight: Dimensions.get('window').height * 0.78,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.m,
  },
  timeSheetTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  timeSheetSub: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: -spacing.s,
  },
  timeSheetSubBold: {
    fontFamily: 'Roboto_700Bold',
    color: colors.textBody,
  },
  timeScrollArea: {
    flexGrow: 0,
  },
  timeSection: {
    gap: spacing.s,
    marginBottom: spacing.m,
  },
  timeSectionLabel: {
    ...typography.labelLarge,
    color: colors.textBody,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  slotChip: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  slotChipSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.surface,
  },
  slotText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  slotTextSelected: {
    color: colors.brand,
    fontFamily: 'Roboto_500Medium',
  },

  // Shared confirm button
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: '#7FAEC8',
    marginTop: spacing.xs,
  },
  confirmBtnActive: {
    backgroundColor: colors.brand,
  },
  confirmBtnText: {
    ...typography.button,
    color: colors.white,
  },
});
