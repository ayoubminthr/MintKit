import { useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

export interface BarChartDatum {
  label: string;
  value: number;
}

export interface BarChartProps extends ViewProps {
  data: BarChartDatum[];
  /** Defaults to the highest value in `data`. */
  maxValue?: number;
  /** Smaller sparkline-style rendering — bars only, no axis or labels. */
  compact?: boolean;
}

const TRACK_HEIGHT = 140;
const COMPACT_TRACK_HEIGHT = 40;
const MIN_BAR_HEIGHT = 2;

export function BarChart({ data, maxValue, compact = false, style, ...rest }: BarChartProps) {
  const { colors } = useTheme();

  const resolvedMax = useMemo(() => {
    if (maxValue != null && maxValue > 0) return maxValue;
    const highest = data.reduce((max, item) => Math.max(max, item.value), 0);
    return highest > 0 ? highest : 1;
  }, [data, maxValue]);

  const dynamicStyles = useMemo(
    () => ({
      bar: { backgroundColor: colors.brand },
      track: { borderBottomColor: colors.border },
    }),
    [colors],
  );

  const trackHeight = compact ? COMPACT_TRACK_HEIGHT : TRACK_HEIGHT;

  return (
    <View {...rest} style={[styles.container, style]}>
      <View
        style={[
          styles.track,
          { height: trackHeight, gap: compact ? spacing[1] : spacing[2] },
          !compact && [styles.trackAxis, dynamicStyles.track],
        ]}>
        {data.map((item, index) => {
          const ratio = Math.max(0, item.value) / resolvedMax;
          const pct = `${Math.min(1, ratio) * 100}%` as const;

          return (
            <View key={`${item.label}-${index}`} style={styles.barSlot}>
              <View
                style={[
                  styles.bar,
                  dynamicStyles.bar,
                  item.value > 0
                    ? { height: pct, minHeight: MIN_BAR_HEIGHT }
                    : { height: 0 },
                ]}
              />
            </View>
          );
        })}
      </View>

      {!compact ? (
        <View style={[styles.labelsRow, { gap: spacing[2] }]}>
          {data.map((item, index) => (
            <View key={`${item.label}-label-${index}`} style={styles.barSlot}>
              <Text variant="caption" tone="muted" numberOfLines={1} style={styles.labelText}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing[2],
  },
  track: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  trackAxis: {
    borderBottomWidth: borders.hair,
  },
  barSlot: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    borderTopStartRadius: radius.sm,
    borderTopEndRadius: radius.sm,
  },
  labelsRow: {
    flexDirection: 'row',
  },
  labelText: {
    textAlign: 'center',
  },
});
