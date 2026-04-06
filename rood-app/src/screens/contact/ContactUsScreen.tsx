// src/screens/contact/ContactUsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, radius, shadows } from '../../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Time slot data
const TIME_SLOTS = {
  morning: [
    { time: '10:00 - 10:30', available: true },
    { time: '10:30 - 11:00', available: true },
    { time: '11:00 - 11:30', available: true },
    { time: '11:30 - 12:00', available: true },
    { time: '12:00 - 12:30', available: true },
    { time: '12:30 - 01:00', available: true },
  ],
  afternoon: [
    { time: '01:00 - 01:30', available: false },
    { time: '01:30 - 02:00', available: true },
    { time: '02:00 - 02:30', available: true },
    { time: '02:30 - 03:00', available: true },
    { time: '03:00 - 03:30', available: true },
    { time: '03:30 - 04:00', available: true },
  ],
  evening: [
    { time: '04:00 - 04:30', available: true },
    { time: '04:30 - 05:00', available: true },
    { time: '05:00 - 05:30', available: false },
    { time: '05:30 - 06:00', available: true },
  ],
};

export default function ContactUsScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDateSelect = (day: number) => {
    const dateStr = `${day}th Nov`;
    setSelectedDate(dateStr);
    setShowCalendar(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowTimeSlots(false);
  };

  const navigateMonth = (direction: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Background overlay */}
      <View style={styles.overlay} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>
            Choose a date and time, someone from our team will get in touch with you.
          </Text>

          {/* Date Input */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Choose date</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <TouchableOpacity 
              style={styles.inputWrapper}
              onPress={() => setShowCalendar(true)}
            >
              <Text style={[styles.inputText, !selectedDate && styles.placeholderText]}>
                {selectedDate || 'dd/mm/yy'}
              </Text>
              <View style={styles.inputIcons}>
                <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
                <Feather name="chevron-down" size={20} color={colors.textMuted} style={styles.chevron} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Time Input */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Choose time</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <TouchableOpacity 
              style={styles.inputWrapper}
              onPress={() => setShowTimeSlots(true)}
            >
              <Text style={[styles.inputText, !selectedTime && styles.placeholderText]}>
                {selectedTime || '-- : --'}
              </Text>
              <View style={styles.inputIcons}>
                <Ionicons name="time-outline" size={20} color={colors.textMuted} />
                <Feather name="chevron-down" size={20} color={colors.textMuted} style={styles.chevron} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Mobile Number Input */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Enter 10 digit mobile number</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.mobileInput}
                placeholder="9437386432"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                maxLength={10}
                value={mobileNumber}
                onChangeText={setMobileNumber}
              />
              <View style={styles.inputIcons}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
                <Feather name="clipboard" size={18} color={colors.textMuted} style={styles.clipboardIcon} />
              </View>
            </View>
          </View>

          {/* Schedule Call Button */}
          <TouchableOpacity style={styles.scheduleButton}>
            <Text style={styles.scheduleButtonText}>Schedule Call</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => navigateMonth(-1)}>
                <Feather name="chevron-left" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.calendarMonth}>
                {monthNames[currentMonth.getMonth()]}
              </Text>
              <TouchableOpacity onPress={() => navigateMonth(1)}>
                <Feather name="chevron-right" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Week Days */}
            <View style={styles.weekDaysRow}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <Text key={index} style={styles.weekDay}>{day}</Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    day === 4 && styles.selectedDay,
                  ]}
                  onPress={() => day && handleDateSelect(day)}
                  disabled={!day}
                >
                  {day && (
                    <Text style={[styles.calendarDayText, day === 4 && styles.selectedDayText]}>
                      {day}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Confirm Button */}
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Slots Modal */}
      <Modal
        visible={showTimeSlots}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimeSlots(false)}
      >
        <View style={styles.timeSlotOverlay}>
          <View style={styles.timeSlotContainer}>
            {/* Handle bar */}
            <View style={styles.handleBar} />
            
            {/* Header */}
            <Text style={styles.timeSlotTitle}>Select a Time Slot</Text>
            <Text style={styles.timeSlotSubtitle}>
              We are available between 10:00 am to 7:00 pm.
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Morning Slots */}
              <View style={styles.timeSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="sunny-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.sectionTitle}>Morning</Text>
                </View>
                <View style={styles.timeGrid}>
                  {TIME_SLOTS.morning.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeButton,
                        selectedTime === slot.time && styles.timeButtonSelected,
                        !slot.available && styles.timeButtonDisabled,
                      ]}
                      onPress={() => slot.available && handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                    >
                      <Text style={[
                        styles.timeButtonText,
                        selectedTime === slot.time && styles.timeButtonTextSelected,
                        !slot.available && styles.timeButtonTextDisabled,
                      ]}>
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Afternoon Slots */}
              <View style={styles.timeSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="sunny" size={16} color={colors.textSecondary} />
                  <Text style={styles.sectionTitle}>Afternoon</Text>
                </View>
                <View style={styles.timeGrid}>
                  {TIME_SLOTS.afternoon.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeButton,
                        selectedTime === slot.time && styles.timeButtonSelected,
                        !slot.available && styles.timeButtonDisabled,
                      ]}
                      onPress={() => slot.available && handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                    >
                      <Text style={[
                        styles.timeButtonText,
                        selectedTime === slot.time && styles.timeButtonTextSelected,
                        !slot.available && styles.timeButtonTextDisabled,
                      ]}>
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Evening Slots */}
              <View style={styles.timeSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="moon-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.sectionTitle}>Evening</Text>
                </View>
                <View style={styles.timeGrid}>
                  {TIME_SLOTS.evening.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeButton,
                        selectedTime === slot.time && styles.timeButtonSelected,
                        !slot.available && styles.timeButtonDisabled,
                      ]}
                      onPress={() => slot.available && handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                    >
                      <Text style={[
                        styles.timeButtonText,
                        selectedTime === slot.time && styles.timeButtonTextSelected,
                        !slot.available && styles.timeButtonTextDisabled,
                      ]}>
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Selected Time Display */}
            {selectedTime && (
              <View style={styles.selectedTimeContainer}>
                <Text style={styles.selectedTimeLabel}>{selectedTime}</Text>
                <Ionicons name="time-outline" size={20} color={colors.textMuted} />
              </View>
            )}

            {/* Confirm Button */}
            <TouchableOpacity 
              style={styles.timeConfirmButton}
              onPress={() => setShowTimeSlots(false)}
            >
              <Text style={styles.timeConfirmButtonText}>Confirm</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B7280', // Gray background as shown in image
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.xl,
    paddingBottom: spacing['4xl'],
    marginTop: spacing.m,
    minHeight: 600,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.l,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
  },
  required: {
    color: colors.error,
    marginLeft: spacing.xs,
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.m,
    height: 48,
    backgroundColor: colors.surface,
  },
  inputText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  placeholderText: {
    color: colors.textMuted,
  },
  inputIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  chevron: {
    marginLeft: spacing.xs,
  },
  countryCode: {
    ...typography.body,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  mobileInput: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    paddingVertical: 0,
  },
  clipboardIcon: {
    marginLeft: spacing.s,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: radius.md,
    marginTop: spacing.xl,
    gap: spacing.s,
  },
  scheduleButtonText: {
    ...typography.button,
    color: colors.white,
  },
  // Calendar Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  calendarContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.l,
    width: SCREEN_WIDTH - spacing['4xl'],
    ...shadows.card,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  calendarMonth: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.m,
  },
  weekDay: {
    ...typography.bodySmall,
    color: colors.textMuted,
    width: 36,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  calendarDay: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  selectedDay: {
    backgroundColor: colors.brand,
  },
  calendarDayText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  selectedDayText: {
    color: colors.white,
  },
  confirmButton: {
    backgroundColor: colors.brand,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.l,
  },
  confirmButtonText: {
    ...typography.button,
    color: colors.white,
  },
  // Time Slot Modal Styles
  timeSlotOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  timeSlotContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: spacing['4xl'],
    maxHeight: '85%',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    alignSelf: 'center',
    marginBottom: spacing.m,
  },
  timeSlotTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  timeSlotSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  timeSection: {
    marginBottom: spacing.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.labelLarge,
    color: colors.textSecondary,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  timeButton: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minWidth: 85,
    alignItems: 'center',
  },
  timeButtonSelected: {
    backgroundColor: colors.primaryFaded,
    borderColor: colors.primary,
  },
  timeButtonDisabled: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
  },
  timeButtonText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  timeButtonTextSelected: {
    color: colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  timeButtonTextDisabled: {
    color: colors.textMuted,
  },
  selectedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s,
    paddingVertical: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    marginTop: spacing.s,
  },
  selectedTimeLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  timeConfirmButton: {
    backgroundColor: colors.brand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: radius.md,
    marginTop: spacing.m,
    gap: spacing.s,
  },
  timeConfirmButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
