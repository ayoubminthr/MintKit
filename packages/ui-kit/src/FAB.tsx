/**
 * FAB — Floating Action Button.
 * Mobile-idiomatic primary action anchored above the screen, typically
 * bottom-end. Allowed to carry a shadow (Rule 1 exception — it's floating).
 *
 * Usage:
 *   <FAB icon="plus" onPress={...} accessibilityLabel="New item" />
 *   <FAB variant="extended" icon="plus" label="New" onPress={...} />
 */
import { Feather } from '@expo/vector-icons';
import { useMemo, type ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { radius } from './tokens/radius';
import { shadows } from './tokens/shadows';
import { spacing } from './tokens/spacing';
import { Text } from './Text';
import { useTheme } from './Theme';

export type FABVariant = 'regular' | 'mini' | 'extended';
export type FABPosition = 'bottom-end' | 'bottom-start' | 'bottom-center';

export interface FABProps {
  icon: ComponentProps<typeof Feather>['name'];
  /** Required when variant is 'extended', ignored otherwise. */
  label?: string;
  onPress: () => void;
  variant?: FABVariant;
  position?: FABPosition;
  /** Required for icon-only variants. */
  accessibilityLabel?: string;
  disabled?: boolean;
  /** Override the default bottom offset (from screen edge, above safe area). */
  offsetBottom?: number;
}

const REGULAR_SIZE = 56;
const MINI_SIZE = 40;
const EXTENDED_HEIGHT = 48;

export function FAB({
  icon,
  label,
  onPress,
  variant = 'regular',
  position = 'bottom-end',
  accessibilityLabel,
  disabled,
  offsetBottom,
}: FABProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = offsetBottom ?? insets.bottom + spacing[5];

  const dynamicStyles = useMemo(
    () => ({
      base: { backgroundColor: colors.brand },
      pressed: { backgroundColor: colors.brandHover },
    }),
    [colors]
  );

  const sizeStyle =
    variant === 'mini'
      ? styles.mini
      : variant === 'extended'
        ? styles.extended
        : styles.regular;

  const iconSize = variant === 'mini' ? 18 : 20;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.layer,
        position === 'bottom-end' && { end: spacing[5] },
        position === 'bottom-start' && { start: spacing[5] },
        position === 'bottom-center' && styles.layerCenter,
        { bottom: bottomInset },
      ]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: !!disabled }}
        disabled={disabled}
        onPress={onPress}
        android_ripple={{ color: colors.brandStrong, borderless: false }}
        style={({ pressed }) => [
          styles.base,
          dynamicStyles.base,
          sizeStyle,
          shadows.md,
          pressed && dynamicStyles.pressed,
          disabled && styles.disabled,
        ]}>
        <Feather name={icon} size={iconSize} color={colors.onBrand} />
        {variant === 'extended' && label ? (
          <Text
            variant="body"
            color={colors.onBrand}
            style={styles.label}>
            {label}
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    bottom: 0,
  },
  layerCenter: {
    start: 0,
    end: 0,
    alignItems: 'center',
  },
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  regular: {
    width: REGULAR_SIZE,
    height: REGULAR_SIZE,
    borderRadius: REGULAR_SIZE / 2,
  },
  mini: {
    width: MINI_SIZE,
    height: MINI_SIZE,
    borderRadius: MINI_SIZE / 2,
  },
  extended: {
    height: EXTENDED_HEIGHT,
    paddingHorizontal: spacing[4],
    borderRadius: radius.full,
    gap: spacing[2],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: '500',
  },
});
