/**
 * Rating — a row of star icons representing a 0..max score.
 *
 * Supports fractional values (e.g. `3.7`): the partially-covered star is
 * rendered with a clipped, percentage-width overlay on top of an empty star,
 * the same width-percentage + `overflow: hidden` trick `ProgressBar` uses for
 * its fill bar.
 */
import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from './Theme';
import { spacing } from './tokens/spacing';

export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps extends ViewProps {
  /** Current rating, 0 to `max`. Fractional values partially fill a star. */
  value: number;
  /** Number of stars rendered. Defaults to 5. */
  max?: number;
  size?: RatingSize;
  /**
   * Disables tap-to-rate. Defaults to `false` — but the row only ever becomes
   * interactive when `onChange` is also supplied, so passing `value` alone
   * always renders a static, read-only display regardless of this prop.
   */
  readonly?: boolean;
  /** Called with the whole-star value (`1`..`max`) tapped. */
  onChange?: (value: number) => void;
}

const sizeConfig: Record<RatingSize, { icon: number; gap: number }> = {
  sm: { icon: 16, gap: spacing[1] },
  md: { icon: 20, gap: spacing[2] },
  lg: { icon: 28, gap: spacing[2] },
};

export function Rating({
  value,
  max = 5,
  size = 'md',
  readonly = false,
  onChange,
  style,
  ...rest
}: RatingProps) {
  const { colors } = useTheme();
  const interactive = !readonly && typeof onChange === 'function';
  const clamped = Math.max(0, Math.min(max, value));
  const { icon: iconSize, gap } = sizeConfig[size];

  const dynamicStyles = useMemo(
    () => ({
      emptyColor: colors.border,
      filledColor: colors.warning,
    }),
    [colors],
  );

  return (
    <View
      accessibilityRole={interactive ? 'adjustable' : 'image'}
      accessibilityLabel={`Rating: ${clamped} out of ${max}`}
      {...rest}
      style={[styles.row, { gap }, style]}>
      {Array.from({ length: max }).map((_, index) => {
        const fillFraction = Math.max(0, Math.min(1, clamped - index));
        const fillPct = `${fillFraction * 100}%` as const;
        const star = (
          <View style={{ width: iconSize, height: iconSize }}>
            <Feather name="star" size={iconSize} color={dynamicStyles.emptyColor} />
            {fillFraction > 0 ? (
              <View style={[styles.fillClip, { width: fillPct }]}>
                <Feather name="star" size={iconSize} color={dynamicStyles.filledColor} />
              </View>
            ) : null}
          </View>
        );

        if (!interactive) {
          return <View key={index}>{star}</View>;
        }

        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${index + 1} out of ${max}`}
            hitSlop={6}
            onPress={() => onChange?.(index + 1)}>
            {star}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fillClip: {
    position: 'absolute',
    start: 0,
    top: 0,
    height: '100%',
    overflow: 'hidden',
  },
});
