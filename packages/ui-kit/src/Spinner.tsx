/**
 * Spinner — circular loading indicator.
 *
 * Wraps RN's ActivityIndicator with kit token colors and a discrete
 * size scale. For determinate / linear progress, use ProgressBar instead.
 */
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { spacing } from './tokens/spacing';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerTone = 'brand' | 'neutral' | 'inverse';

export interface SpinnerProps extends ViewProps {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  /** Optional label rendered below the spinner. */
  label?: string;
}

const scaleBySize: Record<SpinnerSize, number> = {
  sm: 0.75,
  md: 1,
  lg: 1.4,
};

export function Spinner({
  size = 'md',
  tone = 'brand',
  label,
  style,
  ...rest
}: SpinnerProps) {
  const { colors } = useTheme();

  const colorByTone = useMemo<Record<SpinnerTone, string>>(
    () => ({
      brand: colors.brand,
      neutral: colors.textMuted,
      inverse: colors.textInverse,
    }),
    [colors]
  );

  return (
    <View {...rest} style={[styles.root, style]}>
      <ActivityIndicator
        size="small"
        color={colorByTone[tone]}
        style={{ transform: [{ scale: scaleBySize[size] }] }}
      />
      {label ? (
        <Text variant="caption" tone="secondary">
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
});
