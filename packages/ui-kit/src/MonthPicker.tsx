/**
 * MonthPicker — month + year grid picker.
 *
 * For flows that select a whole month rather than a specific day (reporting
 * periods, monthly filters). Pair with BottomSheet to surface as a modal, or
 * use DatePicker with mode="month" for a ready-made field + sheet.
 *
 * Usage:
 *   const [value, setValue] = useState<{ month: number; year: number } | null>(null);
 *   <MonthPicker value={value} onChange={(month, year) => setValue({ month, year })} />
 */
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontWeight } from './tokens/typography';
import { backChevron, forwardChevron } from './utils/rtl';
import { Feather } from '@expo/vector-icons';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export interface MonthPickerProps extends ViewProps {
  value: { month: number; year: number } | null;
  onChange: (month: number, year: number) => void;
  minYear?: number;
  maxYear?: number;
  /** Overrides the (English-default) month labels — pass localized names. */
  monthNames?: readonly string[];
}

export function MonthPicker({
  value,
  onChange,
  minYear,
  maxYear,
  monthNames = MONTH_NAMES,
  style,
  ...rest
}: MonthPickerProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const [visibleYear, setVisibleYear] = useState(() => value?.year ?? new Date().getFullYear());

  const dynamicStyles = useMemo(
    () => ({
      root: { backgroundColor: colors.surfacePrimary },
      cellPressed: { backgroundColor: colors.surfaceSubtle },
      cellSelected: { backgroundColor: colors.brandSubtle },
      onBrandSubtle: isDark ? palette.brand[100] : colors.brand,
    }),
    [colors, isDark]
  );

  const canGoBack = minYear === undefined || visibleYear > minYear;
  const canGoForward = maxYear === undefined || visibleYear < maxYear;

  return (
    <View {...rest} style={[styles.root, dynamicStyles.root, style]}>
      <View style={styles.header}>
        <NavButton
          direction="back"
          label="Previous year"
          disabled={!canGoBack}
          onPress={() => setVisibleYear((y) => y - 1)}
        />
        <Text variant="subtitle" style={styles.yearLabel}>
          {visibleYear}
        </Text>
        <NavButton
          direction="forward"
          label="Next year"
          disabled={!canGoForward}
          onPress={() => setVisibleYear((y) => y + 1)}
        />
      </View>

      <View style={styles.grid}>
        {monthNames.map((name, index) => {
          const selected = value?.month === index && value?.year === visibleYear;
          return (
            <Pressable
              key={name}
              accessibilityRole="button"
              accessibilityLabel={name}
              accessibilityState={{ selected }}
              onPress={() => onChange(index, visibleYear)}
              android_ripple={{ color: colors.surfaceSubtle }}
              style={({ pressed }) => [
                styles.cell,
                selected && dynamicStyles.cellSelected,
                pressed && !selected && dynamicStyles.cellPressed,
              ]}>
              <Text
                variant="body"
                color={selected ? dynamicStyles.onBrandSubtle : colors.textPrimary}
                style={{
                  fontWeight: selected ? fontWeight.medium : fontWeight.regular,
                }}>
                {name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function NavButton({
  direction,
  label,
  disabled,
  onPress,
}: {
  direction: 'back' | 'forward';
  label: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const icon = direction === 'back' ? backChevron() : forwardChevron();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={spacing[2]}
      onPress={onPress}
      android_ripple={{ color: colors.surfaceSubtle, borderless: true }}
      style={({ pressed }) => [
        styles.navButton,
        disabled && styles.navButtonDisabled,
        pressed && !disabled && { backgroundColor: colors.surfaceSubtle },
      ]}>
      <Feather name={icon} size={20} color={disabled ? colors.textMuted : colors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
  },
  yearLabel: {
    flex: 1,
    textAlign: 'center',
  },
  navButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cell: {
    width: '31%',
    marginBottom: spacing[2],
    paddingVertical: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
});
