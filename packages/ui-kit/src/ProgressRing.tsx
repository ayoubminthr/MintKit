/**
 * ProgressRing — circular 0-1 progress indicator.
 *
 * Draws two concentric circles with `react-native-svg`: a full background
 * ring in `colors.border` and a foreground ring in `colors.brand` whose
 * `strokeDashoffset` is derived from `value`. The whole `<Svg>` is rotated
 * -90deg so the foreground ring starts at 12 o'clock and sweeps clockwise.
 * For linear progress, use `ProgressBar` instead.
 */
import { useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { Circle, Svg } from 'react-native-svg';

import { Text } from './Text';
import { useTheme } from './Theme';

export interface ProgressRingProps extends ViewProps {
  /** 0 to 1, clamped. */
  value: number;
  size?: number;
  strokeWidth?: number;
  /** Optional text centered inside the ring, e.g. a percentage. */
  label?: string;
}

export function ProgressRing({
  value,
  size = 64,
  strokeWidth = 6,
  label,
  style,
  ...rest
}: ProgressRingProps) {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(1, value));

  const ringColors = useMemo(
    () => ({
      track: colors.border,
      fill: colors.brand,
    }),
    [colors]
  );

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - clamped);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(clamped * 100), min: 0, max: 100 }}
      {...rest}
      style={[styles.root, { width: size, height: size }, style]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColors.track}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColors.fill}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashoffset}
        />
      </Svg>
      {label ? (
        <View style={styles.labelSlot}>
          <Text variant="subtitle" tone="primary" numberOfLines={1}>
            {label}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  labelSlot: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
