/**
 * Calendar — inline month-view date picker.
 *
 * Supports single, range, and multi selection. Use the BottomSheet to
 * surface this as a modal picker, or render inline on a screen for
 * scheduling / time-off flows.
 *
 * Usage (single):
 *   const [value, setValue] = useState<Date | null>(null);
 *   <Calendar value={value} onChange={setValue} />
 *
 * Usage (range):
 *   const [range, setRange] = useState<CalendarRange>({ start: null, end: null });
 *   <Calendar mode="range" value={range} onChange={setRange} />
 */
import { Feather } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight } from './tokens/typography';
import { backChevron, forwardChevron } from './utils/rtl';

export type CalendarMode = 'single' | 'range' | 'multi' | 'week';

export type CalendarRange = { start: Date | null; end: Date | null };

interface CalendarBaseProps extends ViewProps {
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: readonly Date[];
  /** Initially-visible month. Defaults to today. */
  initialMonth?: Date;
  /** 0 = Sunday (default), 1 = Monday. */
  firstDayOfWeek?: 0 | 1;
  /** Overrides the (English-default) month labels — pass localized names. */
  monthNames?: readonly string[];
  /** Overrides the (English-default) weekday labels — pass localized names, in the same order as `firstDayOfWeek`. */
  weekdayNames?: readonly string[];
  /** Bounds for the header's editable year field. Unbounded if omitted. */
  minYear?: number;
  maxYear?: number;
  /**
   * Per-date disable predicate, checked alongside `minDate`/`maxDate`/`disabledDates`.
   * Use for rules a finite date list can't express (e.g. "every Sunday").
   */
  isDateDisabled?: (date: Date) => boolean;
}

interface CalendarSingleProps extends CalendarBaseProps {
  mode?: 'single';
  value: Date | null;
  onChange: (value: Date) => void;
}

interface CalendarRangeProps extends CalendarBaseProps {
  mode: 'range';
  value: CalendarRange;
  onChange: (value: CalendarRange) => void;
}

interface CalendarMultiProps extends CalendarBaseProps {
  mode: 'multi';
  value: readonly Date[];
  onChange: (value: readonly Date[]) => void;
}

interface CalendarWeekProps extends CalendarBaseProps {
  mode: 'week';
  /** The bounds of the selected week — always 7 days apart. */
  value: CalendarRange;
  onChange: (value: CalendarRange) => void;
}

export type CalendarProps =
  | CalendarSingleProps
  | CalendarRangeProps
  | CalendarMultiProps
  | CalendarWeekProps;

// ─── Date helpers (no external deps) ──────────────────────────────────────────

function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function daysInMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

// ─── Component ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAY_NAMES_SUN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_NAMES_MON = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CELL_SIZE = 40;

export function Calendar(props: CalendarProps) {
  const {
    minDate,
    maxDate,
    disabledDates,
    initialMonth,
    firstDayOfWeek = 0,
    monthNames,
    weekdayNames,
    minYear,
    maxYear,
    isDateDisabled,
  } = props;
  const restViewProps: ViewProps = {
    style: props.style,
    accessibilityLabel: props.accessibilityLabel,
    testID: props.testID,
  };

  const today = useMemo(() => stripTime(new Date()), []);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(initialMonth ?? new Date()),
  );

  const isDisabled = (d: Date): boolean => {
    if (minDate && d < stripTime(minDate)) return true;
    if (maxDate && d > stripTime(maxDate)) return true;
    if (disabledDates && disabledDates.some((dd) => isSameDay(dd, d))) return true;
    if (isDateDisabled?.(d)) return true;
    return false;
  };

  const grid = useMemo(() => {
    const firstWeekday = visibleMonth.getDay();
    const leading = (firstWeekday - firstDayOfWeek + 7) % 7;
    const total = daysInMonth(visibleMonth);
    const cells: (Date | null)[] = [];
    for (let i = 0; i < leading; i++) cells.push(null);
    for (let i = 1; i <= total; i++) {
      cells.push(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), i));
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [visibleMonth, firstDayOfWeek]);

  const isSelected = (d: Date): boolean => {
    if (props.mode === 'range' || props.mode === 'week') {
      const { start, end } = props.value;
      return Boolean(
        (start && isSameDay(d, start)) || (end && isSameDay(d, end)),
      );
    }
    if (props.mode === 'multi') {
      return props.value.some((dd) => isSameDay(dd, d));
    }
    return props.value ? isSameDay(d, props.value) : false;
  };

  const isInRange = (d: Date): boolean => {
    if (props.mode !== 'range' && props.mode !== 'week') return false;
    const { start, end } = props.value;
    if (!start || !end) return false;
    const t = stripTime(d).getTime();
    return t > stripTime(start).getTime() && t < stripTime(end).getTime();
  };

  const handlePress = (d: Date) => {
    if (props.mode === 'week') {
      const dayOfWeek = d.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() + mondayOffset);
      const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
      props.onChange({ start, end });
      return;
    }
    if (props.mode === 'range') {
      const { start, end } = props.value;
      if (!start || (start && end)) {
        props.onChange({ start: d, end: null });
      } else if (d < start) {
        props.onChange({ start: d, end: start });
      } else {
        props.onChange({ start, end: d });
      }
      return;
    }
    if (props.mode === 'multi') {
      const exists = props.value.some((dd) => isSameDay(dd, d));
      const next = exists
        ? props.value.filter((dd) => !isSameDay(dd, d))
        : [...props.value, d];
      props.onChange(next);
      return;
    }
    props.onChange(d);
  };

  const weekdays = weekdayNames ?? (firstDayOfWeek === 0 ? WEEKDAY_NAMES_SUN : WEEKDAY_NAMES_MON);
  const monthName = (monthNames ?? MONTH_NAMES)[visibleMonth.getMonth()];

  return (
    <View {...restViewProps} style={[styles.root, props.style]}>
      <View style={styles.header}>
        <NavButton
          icon={backChevron()}
          label="Previous month"
          onPress={() => setVisibleMonth(addMonths(visibleMonth, -1))}
        />
        <View style={styles.monthYearGroup}>
          <Text variant="subtitle">{monthName}</Text>
          <YearInput
            year={visibleMonth.getFullYear()}
            minYear={minYear}
            maxYear={maxYear}
            onChangeYear={(year) => setVisibleMonth(new Date(year, visibleMonth.getMonth(), 1))}
          />
        </View>
        <NavButton
          icon={forwardChevron()}
          label="Next month"
          onPress={() => setVisibleMonth(addMonths(visibleMonth, 1))}
        />
      </View>

      <View style={styles.weekdays}>
        {weekdays.map((name) => (
          <View key={name} style={styles.weekdayCell}>
            <Text variant="caption" tone="muted">
              {name}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((d, idx) => {
          if (!d) {
            return <View key={`empty-${idx}`} style={styles.cell} />;
          }
          const disabled = isDisabled(d);
          const selected = isSelected(d);
          const inRange = isInRange(d);
          const isToday = isSameDay(d, today);
          return (
            <DayCell
              key={d.toISOString()}
              date={d}
              disabled={disabled}
              selected={selected}
              inRange={inRange}
              isToday={isToday}
              onPress={handlePress}
            />
          );
        })}
      </View>
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function YearInput({
  year,
  minYear,
  maxYear,
  onChangeYear,
}: {
  year: number;
  minYear?: number;
  maxYear?: number;
  onChangeYear: (year: number) => void;
}) {
  const [text, setText] = useState(String(year));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(String(year));
  }, [year, focused]);

  const isInBounds = (n: number) =>
    (minYear === undefined || n >= minYear) && (maxYear === undefined || n <= maxYear);

  return (
    <TextInput
      value={text}
      onChangeText={(raw) => {
        const numeric = raw.replace(/[^0-9]/g, '');
        setText(numeric);
        if (numeric.length === 4) {
          const parsed = parseInt(numeric, 10);
          if (isInBounds(parsed)) onChangeYear(parsed);
        }
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        const parsed = parseInt(text, 10);
        if (text.length !== 4 || Number.isNaN(parsed) || !isInBounds(parsed)) {
          setText(String(year));
        }
      }}
      keyboardType="number-pad"
      maxLength={4}
      selectTextOnFocus
      accessibilityLabel="Year"
      style={styles.yearInput}
    />
  );
}

function NavButton({
  icon,
  label,
  onPress,
}: {
  icon: 'chevron-left' | 'chevron-right';
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={spacing[2]}
      onPress={onPress}
      android_ripple={{ color: lightColors.surfaceSubtle, borderless: true }}
      style={({ pressed }) => [
        styles.navButton,
        pressed && styles.navButtonPressed,
      ]}>
      <Feather name={icon} size={20} color={lightColors.textPrimary} />
    </Pressable>
  );
}

function DayCell({
  date,
  disabled,
  selected,
  inRange,
  isToday,
  onPress,
}: {
  date: Date;
  disabled: boolean;
  selected: boolean;
  inRange: boolean;
  isToday: boolean;
  onPress: (d: Date) => void;
}) {
  const textColor = disabled
    ? lightColors.textMuted
    : selected
      ? lightColors.onBrand
      : lightColors.textPrimary;

  return (
    <View style={styles.cell}>
      {inRange ? <View style={styles.rangeFill} /> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={date.toDateString()}
        accessibilityState={{ selected, disabled }}
        disabled={disabled}
        onPress={() => onPress(date)}
        style={({ pressed }) => [
          styles.dayPress,
          selected && styles.daySelected,
          isToday && !selected && styles.dayToday,
          pressed && !selected && styles.dayPressed,
        ]}>
        <Text
          variant="body"
          style={{
            color: textColor,
            fontWeight: selected ? fontWeight.medium : fontWeight.regular,
          }}>
          {date.getDate()}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: lightColors.surfacePrimary,
    gap: spacing[2],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
  },
  monthYearGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  yearInput: {
    minWidth: 44,
    paddingHorizontal: spacing[1],
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.md,
    color: lightColors.textPrimary,
    textAlign: 'center',
    borderBottomWidth: borders.thin,
    borderBottomColor: lightColors.brand,
  },
  navButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  navButtonPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  weekdays: {
    flexDirection: 'row',
  },
  weekdayCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: spacing[1],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: lightColors.brandSubtle,
  },
  dayPress: {
    width: CELL_SIZE - spacing[1],
    height: CELL_SIZE - spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  dayPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  daySelected: {
    backgroundColor: lightColors.brand,
  },
  dayToday: {
    borderWidth: borders.thin,
    borderColor: lightColors.brand,
  },
});
