/**
 * DatePicker — form input for date selection.
 *
 * Opens a BottomSheet with a Calendar (single/range/week) or MonthPicker
 * (month), matching Select's floating-label + sheet-trigger pattern.
 *
 * Usage:
 *   <DatePicker mode="single" value={date} onChange={setDate} label="Date" floating />
 *   <DatePicker mode="range" value={range} onChange={setRange} label="Period" floating />
 *   <DatePicker mode="week" value={week} onChange={setWeek} label="Week" />
 *   <DatePicker mode="month" value={month} onChange={(m, y) => setMonth({ month: m, year: y })} />
 */
import { Feather } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { Button } from './Button';
import { Calendar, type CalendarRange } from './Calendar';
import { MonthPicker } from './MonthPicker';
import { type SheetBodyProps, useSheet } from './SheetHost';
import { SheetHeader } from './SheetHeader';
import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize } from './tokens/typography';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DatePickerBaseProps {
  label?: string;
  /**
   * Label that animates like `Select`'s floating label: resting inside the
   * field when empty and closed, floating above the border (brand-colored)
   * once a value is selected or the picker sheet is open. Requires `label`.
   */
  floating?: boolean;
  placeholder?: string;
  /** Sheet title shown when the picker opens. */
  title?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: readonly Date[];
  /**
   * Per-date disable predicate, checked alongside `minDate`/`maxDate`/`disabledDates`.
   * Use for rules a finite date list can't express (e.g. "every Sunday"). Ignored in month mode.
   */
  isDateDisabled?: (date: Date) => boolean;
  /** Overrides the (English-default) month/weekday labels — pass localized names. */
  monthNames?: readonly string[];
  weekdayNames?: readonly string[];
  /** 0 = Sunday (default), 1 = Monday. Ignored in month mode. */
  firstDayOfWeek?: 0 | 1;
  /** Bounds for the calendar header's / month grid's editable year field. */
  minYear?: number;
  maxYear?: number;
}

export interface DatePickerSingleProps extends DatePickerBaseProps {
  mode?: 'single';
  value: Date | null;
  onChange: (value: Date | null) => void;
  formatDate?: (date: Date) => string;
}

export interface DatePickerRangeProps extends DatePickerBaseProps {
  mode: 'range';
  value: CalendarRange;
  onChange: (value: CalendarRange) => void;
  formatDate?: (date: Date) => string;
}

export interface DatePickerWeekProps extends DatePickerBaseProps {
  mode: 'week';
  value: CalendarRange;
  onChange: (value: CalendarRange) => void;
  formatDate?: (date: Date) => string;
}

export interface DatePickerMonthProps extends DatePickerBaseProps {
  mode: 'month';
  value: { month: number; year: number } | null;
  onChange: (month: number, year: number) => void;
  formatMonth?: (month: number, year: number) => string;
}

export type DatePickerProps =
  | DatePickerSingleProps
  | DatePickerRangeProps
  | DatePickerWeekProps
  | DatePickerMonthProps;

const DEFAULT_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const defaultFormatDate = (d: Date) => d.toLocaleDateString();
const defaultFormatMonth = (month: number, year: number, names: readonly string[] = DEFAULT_MONTH_NAMES) =>
  `${names[month]} ${year}`;

function hasValueFor(props: DatePickerProps): boolean {
  if (props.mode === 'range' || props.mode === 'week') {
    return Boolean(props.value.start && props.value.end);
  }
  if (props.mode === 'month') {
    return Boolean(props.value);
  }
  return Boolean(props.value);
}

function formatDisplay(props: DatePickerProps): string {
  if (props.mode === 'range' || props.mode === 'week') {
    const { start, end } = props.value;
    const fmt = props.formatDate ?? defaultFormatDate;
    if (start && end) return `${fmt(start)} - ${fmt(end)}`;
    if (start) return fmt(start);
    return '';
  }
  if (props.mode === 'month') {
    if (!props.value) return '';
    const fmt = props.formatMonth ?? ((m: number, y: number) => defaultFormatMonth(m, y, props.monthNames));
    return fmt(props.value.month, props.value.year);
  }
  const fmt = props.formatDate ?? defaultFormatDate;
  return props.value ? fmt(props.value) : '';
}

// ─── Sheet body ───────────────────────────────────────────────────────────────

interface DatePickerSheetParams {
  mode: 'single' | 'range' | 'week' | 'month';
  value: Date | CalendarRange | { month: number; year: number } | null;
  onChange: (...args: any[]) => void;
  title?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: readonly Date[];
  isDateDisabled?: (date: Date) => boolean;
  firstDayOfWeek?: 0 | 1;
  monthNames?: readonly string[];
  weekdayNames?: readonly string[];
  minYear?: number;
  maxYear?: number;
}

function buildSheetParams(props: DatePickerProps): DatePickerSheetParams {
  const fallbackTitle =
    props.mode === 'range'
      ? 'Select a date range'
      : props.mode === 'week'
        ? 'Select a week'
        : props.mode === 'month'
          ? 'Select a month'
          : 'Select a date';
  const shared = {
    title: props.title ?? props.label ?? fallbackTitle,
    minDate: props.minDate,
    maxDate: props.maxDate,
    disabledDates: props.disabledDates,
    isDateDisabled: props.isDateDisabled,
    firstDayOfWeek: props.firstDayOfWeek,
    monthNames: props.monthNames,
    weekdayNames: props.weekdayNames,
    minYear: props.minYear,
    maxYear: props.maxYear,
  };
  if (props.mode === 'range' || props.mode === 'week') {
    return { ...shared, mode: props.mode, value: props.value, onChange: props.onChange };
  }
  if (props.mode === 'month') {
    return { ...shared, mode: 'month', value: props.value, onChange: props.onChange };
  }
  return { ...shared, mode: 'single', value: props.value, onChange: props.onChange };
}

function DatePickerSheetBody({ params, handleClose = () => {} }: SheetBodyProps<DatePickerSheetParams>) {
  const {
    mode,
    title,
    minDate,
    maxDate,
    disabledDates,
    isDateDisabled,
    firstDayOfWeek,
    monthNames,
    weekdayNames,
    minYear,
    maxYear,
  } = params;
  const today = useMemo(() => new Date(), []);

  const [draftDate, setDraftDate] = useState<Date | null>(
    mode === 'single' ? (params.value as Date | null) : null,
  );
  const [draftRange, setDraftRange] = useState<CalendarRange>(
    mode === 'range' || mode === 'week' ? (params.value as CalendarRange) : { start: null, end: null },
  );
  const [draftMonth, setDraftMonth] = useState<{ month: number; year: number } | null>(
    mode === 'month'
      ? (params.value as { month: number; year: number } | null) ?? { month: today.getMonth(), year: today.getFullYear() }
      : null,
  );

  function handleReset() {
    if (mode === 'single') setDraftDate(null);
    else if (mode === 'range' || mode === 'week') setDraftRange({ start: null, end: null });
    else setDraftMonth({ month: today.getMonth(), year: today.getFullYear() });
  }

  function handleApply() {
    if (mode === 'single') params.onChange(draftDate);
    else if (mode === 'range' || mode === 'week') params.onChange(draftRange);
    else if (draftMonth) params.onChange(draftMonth.month, draftMonth.year);
    handleClose();
  }

  const applyDisabled = mode === 'range' && Boolean(draftRange.start) && !draftRange.end;

  return (
    <View style={sheetStyles.container}>
      <View style={sheetStyles.titleWrap}>
        <SheetHeader title={title} onClose={handleClose} />
      </View>

      {mode === 'month' ? (
        <MonthPicker
          value={draftMonth}
          onChange={(month, year) => setDraftMonth({ month, year })}
          monthNames={monthNames}
          minYear={minYear}
          maxYear={maxYear}
        />
      ) : mode === 'single' ? (
        <Calendar
          mode="single"
          value={draftDate}
          onChange={setDraftDate}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          isDateDisabled={isDateDisabled}
          monthNames={monthNames}
          weekdayNames={weekdayNames}
          firstDayOfWeek={firstDayOfWeek}
          minYear={minYear}
          maxYear={maxYear}
        />
      ) : mode === 'week' ? (
        <Calendar
          mode="week"
          value={draftRange}
          onChange={setDraftRange}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          isDateDisabled={isDateDisabled}
          monthNames={monthNames}
          weekdayNames={weekdayNames}
          firstDayOfWeek={firstDayOfWeek}
          minYear={minYear}
          maxYear={maxYear}
        />
      ) : (
        <Calendar
          mode="range"
          value={draftRange}
          onChange={setDraftRange}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          isDateDisabled={isDateDisabled}
          monthNames={monthNames}
          weekdayNames={weekdayNames}
          firstDayOfWeek={firstDayOfWeek}
          minYear={minYear}
          maxYear={maxYear}
        />
      )}

      <View style={sheetStyles.footer}>
        <View style={sheetStyles.footerButton}>
          <Button variant="secondary" label="Reset" onPress={handleReset} fullWidth />
        </View>
        <View style={sheetStyles.footerButton}>
          <Button variant="primary" label="Apply" onPress={handleApply} disabled={applyDisabled} fullWidth />
        </View>
      </View>
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DatePicker(props: DatePickerProps) {
  const { label, floating, placeholder = 'Select a date', title, disabled, error, hint } = props;

  const { colors } = useTheme();
  const sheet = useSheet();
  const [isOpen, setIsOpen] = useState(false);
  const sheetIdRef = useRef<string | null>(null);

  const dynamicStyles = useMemo(
    () => ({
      floatingLabel: { backgroundColor: colors.surfacePrimary },
      field: { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
      fieldActive: { borderColor: colors.brand },
      fieldError: { borderColor: colors.danger },
      fieldPressed: { backgroundColor: colors.surfaceSubtle },
    }),
    [colors],
  );

  useEffect(() => {
    if (!sheetIdRef.current) return;
    const stillOpen = sheet.opened.some((s) => s.id === sheetIdRef.current);
    if (!stillOpen) {
      sheetIdRef.current = null;
      setIsOpen(false);
    }
  }, [sheet.opened]);

  const hasValue = hasValueFor(props);
  const displayText = formatDisplay(props);

  const showFloating = floating && !!label;
  const animRef = useRef(new Animated.Value(hasValue ? 1 : 0));

  useEffect(() => {
    if (!showFloating) return;
    Animated.timing(animRef.current, {
      toValue: hasValue || isOpen ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [showFloating, hasValue, isOpen]);

  function handleOpen() {
    const handle = sheet.open<DatePickerSheetParams>({
      body: DatePickerSheetBody,
      params: buildSheetParams(props),
    });
    sheetIdRef.current = handle.id;
    setIsOpen(true);
  }

  const field = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title ?? label ?? placeholder}
      disabled={disabled}
      onPress={handleOpen}
      style={({ pressed }) => [
        styles.field,
        dynamicStyles.field,
        isOpen && styles.fieldActive,
        isOpen && dynamicStyles.fieldActive,
        error ? styles.fieldError : null,
        error ? dynamicStyles.fieldError : null,
        disabled && styles.fieldDisabled,
        pressed && dynamicStyles.fieldPressed,
      ]}>
      <Text
        scaled={false}
        tone={hasValue ? (disabled ? 'muted' : 'primary') : 'muted'}
        numberOfLines={1}
        style={styles.value}>
        {hasValue ? displayText : showFloating ? '' : placeholder}
      </Text>
      <Feather
        name="calendar"
        size={16}
        color={disabled ? colors.textMuted : colors.textSecondary}
      />
    </Pressable>
  );

  return (
    <View style={styles.wrapper}>
      {!showFloating && label ? (
        <Text variant="caption" tone={hasValue || isOpen ? 'brand' : 'muted'} style={styles.label}>
          {label}
        </Text>
      ) : null}

      {showFloating ? (
        <View style={styles.floatingWrapper}>
          <Animated.Text
            style={[
              styles.floatingLabel,
              dynamicStyles.floatingLabel,
              {
                top: animRef.current.interpolate({ inputRange: [0, 1], outputRange: [11, -8] }),
                color: animRef.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.textMuted, colors.brand],
                }),
              },
            ]}>
            {label}
          </Animated.Text>
          {field}
        </View>
      ) : (
        field
      )}

      {error ? (
        <Text variant="caption" tone="danger">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" tone="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing[1],
  },
  label: {
    fontWeight: '500',
  },
  floatingWrapper: {
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    start: 8,
    zIndex: 999,
    paddingHorizontal: 5,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansMedium,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: spacing[3],
    borderWidth: borders.hair,
    borderRadius: radius.md,
    gap: spacing[2],
  },
  fieldActive: {
    borderWidth: borders.thin,
  },
  fieldError: {
    borderWidth: borders.thin,
  },
  fieldDisabled: {
    opacity: 0.5,
  },
  // Mirrors `Input`'s TextInput — see the note in Select.tsx.
  value: {
    flex: 1,
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
  },
});

const sheetStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
  },
  titleWrap: {
    marginBottom: spacing[4],
  },
  footer: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[16],
  },
  footerButton: {
    flex: 1,
  },
});
