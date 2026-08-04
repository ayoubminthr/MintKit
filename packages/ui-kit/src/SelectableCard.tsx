/**
 * SelectableCard — card-shaped selectable option.
 *
 * Common mobile pattern for "pick a plan", "choose payment method",
 * "select role" flows where the entire card surface is the tap target,
 * not a 16px circle. Indicator can be radio (single-select intent) or
 * checkbox (multi-select intent).
 */
import { Feather } from '@expo/vector-icons';
import { type ReactNode, useMemo } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

export type SelectableCardVariant = 'radio' | 'checkbox';

export interface SelectableCardProps extends Omit<ViewProps, 'children'> {
  selected: boolean;
  onPress: () => void;
  /** Indicator shape. Defaults to 'radio'. */
  variant?: SelectableCardVariant;
  disabled?: boolean;
  children: ReactNode;
}

const INDICATOR_SIZE = 22;

export function SelectableCard({
  selected,
  onPress,
  variant = 'radio',
  disabled,
  children,
  style,
  ...rest
}: SelectableCardProps) {
  const { colors } = useTheme();

  const dynamicStyles = useMemo(
    () => ({
      card: { backgroundColor: colors.surfacePrimary },
      cardUnselected: { borderColor: colors.border },
      cardSelected: { borderColor: colors.brand, backgroundColor: colors.brandSubtle },
      cardPressed: { backgroundColor: colors.surfaceSubtle },
    }),
    [colors]
  );

  return (
    <Pressable
      {...rest}
      accessibilityRole={variant === 'radio' ? 'radio' : 'checkbox'}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      android_ripple={{ color: colors.surfaceSubtle, borderless: false }}
      style={({ pressed }) => [
        styles.card,
        dynamicStyles.card,
        selected ? dynamicStyles.cardSelected : dynamicStyles.cardUnselected,
        pressed && !selected && dynamicStyles.cardPressed,
        disabled && styles.cardDisabled,
        style,
      ]}>
      <View style={styles.content}>{children}</View>
      <Indicator variant={variant} selected={selected} />
    </Pressable>
  );
}

function Indicator({
  variant,
  selected,
}: {
  variant: SelectableCardVariant;
  selected: boolean;
}) {
  const { colors } = useTheme();

  const dynamicStyles = useMemo(
    () => ({
      indicatorUnselected: { backgroundColor: colors.surfacePrimary, borderColor: colors.borderStrong },
      indicatorSelected: { backgroundColor: colors.brand, borderColor: colors.brand },
      radioDot: { backgroundColor: colors.onBrand },
    }),
    [colors]
  );

  if (variant === 'radio') {
    return (
      <View
        style={[
          styles.indicator,
          styles.indicatorRound,
          selected ? styles.indicatorSelected : styles.indicatorUnselected,
          selected ? dynamicStyles.indicatorSelected : dynamicStyles.indicatorUnselected,
        ]}>
        {selected ? <View style={[styles.radioDot, dynamicStyles.radioDot]} /> : null}
      </View>
    );
  }
  return (
    <View
      style={[
        styles.indicator,
        styles.indicatorSquare,
        selected ? styles.indicatorSelected : styles.indicatorUnselected,
        selected ? dynamicStyles.indicatorSelected : dynamicStyles.indicatorUnselected,
      ]}>
      {selected ? <Feather name="check" size={14} color={colors.onBrand} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: borders.thin,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
  },
  indicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  indicatorRound: {
    borderRadius: INDICATOR_SIZE / 2,
  },
  indicatorSquare: {
    borderRadius: radius.sm,
  },
  indicatorUnselected: {
    borderWidth: borders.thin,
  },
  indicatorSelected: {
    borderWidth: borders.thin,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
