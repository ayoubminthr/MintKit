/**
 * TimePicker — form input for time selection.
 *
 * Opens a BottomSheet with scrollable hour/minute columns (single mode) or
 * the same columns plus a start/end toggle (range mode), matching Select's
 * and DatePicker's floating-label + sheet-trigger pattern.
 *
 * Usage:
 *   <TimePicker mode="single" value={time} onChange={setTime} label="Time" floating />
 *   <TimePicker mode="range" value={range} onChange={setRange} label="Working hours" floating />
 */
import { Feather } from '@expo/vector-icons';
import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from './Button';
import { type SheetBodyProps, useSheet } from './SheetHost';
import { SheetHeader } from './SheetHeader';
import { Tabs } from './Tabs';
import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize } from './tokens/typography';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimeRange {
  start: Date | null;
  end: Date | null;
}

interface TimePickerBaseProps {
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
  /** Minute increment shown in the minute column. Defaults to 5. */
  minuteStep?: number;
}

export interface TimePickerSingleProps extends TimePickerBaseProps {
  mode?: 'single';
  value: Date | null;
  onChange: (value: Date | null) => void;
  formatTime?: (date: Date) => string;
}

export interface TimePickerRangeProps extends TimePickerBaseProps {
  mode: 'range';
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  formatTime?: (date: Date) => string;
}

export type TimePickerProps = TimePickerSingleProps | TimePickerRangeProps;

const defaultFormatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function hasValueFor(props: TimePickerProps): boolean {
  if (props.mode === 'range') return Boolean(props.value.start && props.value.end);
  return Boolean(props.value);
}

function formatDisplay(props: TimePickerProps): string {
  const fmt = props.formatTime ?? defaultFormatTime;
  if (props.mode === 'range') {
    const { start, end } = props.value;
    if (start && end) return `${fmt(start)} - ${fmt(end)}`;
    if (start) return fmt(start);
    return '';
  }
  return props.value ? fmt(props.value) : '';
}

function withTime(base: Date | null, hour: number, minute: number): Date {
  const d = base ? new Date(base) : new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

// ─── Sheet body ───────────────────────────────────────────────────────────────

interface TimePickerSheetParams {
  mode: 'single' | 'range';
  value: Date | TimeRange | null;
  onChange: (value: any) => void;
  title?: string;
  minuteStep: number;
}

function buildSheetParams(props: TimePickerProps): TimePickerSheetParams {
  const fallbackTitle = props.mode === 'range' ? 'Select a time range' : 'Select a time';
  return {
    mode: props.mode ?? 'single',
    value: props.value,
    onChange: props.onChange as (value: any) => void,
    title: props.title ?? props.label ?? fallbackTitle,
    minuteStep: props.minuteStep ?? 5,
  };
}

const ROW_HEIGHT = 44;
const COLUMN_HEIGHT = 200;

function TimePickerSheetBody({ params, handleClose = () => {} }: SheetBodyProps<TimePickerSheetParams>) {
  const { mode, title, minuteStep } = params;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);

  const singleValue = mode === 'single' ? (params.value as Date | null) : null;
  const rangeValue = mode === 'range' ? (params.value as TimeRange) : { start: null, end: null };

  const [draftHour, setDraftHour] = useState(singleValue?.getHours() ?? 8);
  const [draftMinute, setDraftMinute] = useState(singleValue?.getMinutes() ?? 0);

  const [startHour, setStartHour] = useState(rangeValue.start?.getHours() ?? 8);
  const [startMinute, setStartMinute] = useState(rangeValue.start?.getMinutes() ?? 0);
  const [endHour, setEndHour] = useState(rangeValue.end?.getHours() ?? 17);
  const [endMinute, setEndMinute] = useState(rangeValue.end?.getMinutes() ?? 0);
  const [activeSide, setActiveSide] = useState<'start' | 'end'>('start');

  const hour = mode === 'range' ? (activeSide === 'start' ? startHour : endHour) : draftHour;
  const minute = mode === 'range' ? (activeSide === 'start' ? startMinute : endMinute) : draftMinute;

  function setHour(h: number) {
    if (mode === 'single') setDraftHour(h);
    else if (activeSide === 'start') setStartHour(h);
    else setEndHour(h);
  }

  function setMinute(m: number) {
    if (mode === 'single') setDraftMinute(m);
    else if (activeSide === 'start') setStartMinute(m);
    else setEndMinute(m);
  }

  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const hourIndex = hours.indexOf(hour);
    const minuteIndex = minutes.indexOf(minute);
    const timer = setTimeout(() => {
      hourScrollRef.current?.scrollTo({ y: Math.max(0, hourIndex * ROW_HEIGHT - ROW_HEIGHT * 2), animated: true });
      minuteScrollRef.current?.scrollTo({ y: Math.max(0, minuteIndex * ROW_HEIGHT - ROW_HEIGHT * 2), animated: true });
    }, 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute, activeSide]);

  function handleApply() {
    if (mode === 'single') {
      params.onChange(withTime(singleValue, draftHour, draftMinute));
    } else {
      params.onChange({
        start: withTime(rangeValue.start, startHour, startMinute),
        end: withTime(rangeValue.end, endHour, endMinute),
      });
    }
    handleClose();
  }

  return (
    <View style={sheetStyles.container}>
      <View style={sheetStyles.titleWrap}>
        <SheetHeader title={title} onClose={handleClose} />
      </View>

      {mode === 'range' ? (
        <Tabs
          options={[
            { value: 'start', label: 'Start' },
            { value: 'end', label: 'End' },
          ]}
          value={activeSide}
          onChange={setActiveSide}
          fullWidth
        />
      ) : null}

      <View style={sheetStyles.columns}>
        <TimeColumn
          scrollRef={hourScrollRef}
          values={hours}
          selected={hour}
          onSelect={setHour}
          formatValue={(v) => String(v).padStart(2, '0')}
          label="Hour"
        />
        <TimeColumn
          scrollRef={minuteScrollRef}
          values={minutes}
          selected={minute}
          onSelect={setMinute}
          formatValue={(v) => String(v).padStart(2, '0')}
          label="Minute"
        />
      </View>

      <View style={sheetStyles.footer}>
        <Button variant="primary" label="Apply" onPress={handleApply} fullWidth />
      </View>
    </View>
  );
}

function TimeColumn({
  scrollRef,
  values,
  selected,
  onSelect,
  formatValue,
  label,
}: {
  scrollRef: RefObject<ScrollView | null>;
  values: readonly number[];
  selected: number;
  onSelect: (value: number) => void;
  formatValue: (value: number) => string;
  label: string;
}) {
  const { colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      columnScrollWrap: { backgroundColor: colors.surfaceSubtle },
      rowPressed: { backgroundColor: colors.surfacePrimary },
      rowSelected: { backgroundColor: colors.brand },
    }),
    [colors],
  );

  return (
    <View style={sheetStyles.column}>
      <Text variant="caption" tone="muted" style={sheetStyles.columnLabel}>
        {label}
      </Text>
      <View style={[sheetStyles.columnScrollWrap, dynamicStyles.columnScrollWrap]}>
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
          {values.map((v) => {
            const isSelected = v === selected;
            return (
              <Pressable
                key={v}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => onSelect(v)}
                android_ripple={{ color: colors.surfaceSubtle }}
                style={({ pressed }) => [
                  sheetStyles.row,
                  isSelected && dynamicStyles.rowSelected,
                  pressed && !isSelected && dynamicStyles.rowPressed,
                ]}>
                <Text
                  variant="body"
                  style={{ color: isSelected ? colors.onBrand : colors.textPrimary }}>
                  {formatValue(v)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TimePicker(props: TimePickerProps) {
  const { label, floating, placeholder = 'Select a time', title, disabled, error, hint } = props;

  const { colors } = useTheme();
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

  const sheet = useSheet();
  const [isOpen, setIsOpen] = useState(false);
  const sheetIdRef = useRef<string | null>(null);

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
    const handle = sheet.open<TimePickerSheetParams>({
      body: TimePickerSheetBody,
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
        variant="body"
        tone={hasValue ? (disabled ? 'muted' : 'primary') : 'muted'}
        numberOfLines={1}
        style={[styles.value, !hasValue && styles.placeholderText]}>
        {hasValue ? displayText : showFloating ? '' : placeholder}
      </Text>
      <Feather
        name="clock"
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
  value: {
    flex: 1,
  },
  placeholderText: {
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
  columns: {
    flexDirection: 'row',
    gap: spacing[4],
    marginTop: spacing[4],
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  columnLabel: {
    marginBottom: spacing[2],
  },
  columnScrollWrap: {
    height: COLUMN_HEIGHT,
    width: '100%',
    borderRadius: radius.md,
  },
  row: {
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing[2],
    marginVertical: 2,
    borderRadius: radius.md,
  },
  footer: {
    // Same fixed buffer as DatePicker's sheet footer, for visual consistency
    // across the kit's sheet-based pickers.
    marginTop: spacing[16],
  },
});
