import { useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from './Theme';
import { radius } from './tokens/radius';

export type ProgressVariant = 'default' | 'success' | 'warning' | 'danger';

export interface ProgressBarProps extends ViewProps {
  /** 0 to 1, clamped. */
  value: number;
  variant?: ProgressVariant;
  height?: number;
}

export function ProgressBar({
  value,
  variant = 'default',
  height = 6,
  style,
  ...rest
}: ProgressBarProps) {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(1, value));
  const pct = `${clamped * 100}%` as const;

  const variantColors = useMemo<Record<ProgressVariant, string>>(
    () => ({
      default: colors.brand,
      success: colors.success,
      warning: colors.warning,
      danger: colors.danger,
    }),
    [colors]
  );

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(clamped * 100), min: 0, max: 100 }}
      {...rest}
      style={[styles.track, { backgroundColor: colors.border, height, borderRadius: height / 2 }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: pct,
            backgroundColor: variantColors[variant],
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: radius.full,
  },
  fill: {
    height: '100%',
  },
});
