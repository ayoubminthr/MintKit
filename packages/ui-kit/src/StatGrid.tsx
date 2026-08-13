/**
 * StatGrid — a wrapping grid of compact metric tiles for dashboard overviews.
 *
 * Where `StatCard` is one metric per `Card`, `StatGrid` packs several related
 * metrics into a single surface: each tile is a tinted block (tone-subtle
 * background, no border — the tint carries the separation) holding a value and
 * a label, optionally pressable to drill into the underlying list.
 *
 * Tiles wrap on a `columns`-wide basis so long labels stay readable in any
 * locale, and `loading` swaps in skeleton tiles of the same footprint.
 */
import { Feather } from '@expo/vector-icons';
import { type ComponentProps, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Skeleton } from './Skeleton';
import { Text } from './Text';
import { useTheme } from './Theme';
import { type SemanticColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontWeight } from './tokens/typography';

export type StatGridTone = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatGridItem {
  /** Stable identity for the tile. Falls back to `label`. */
  key?: string;
  label: string;
  value: string | number;
  /** Tints the tile background and the value/icon. Defaults to `neutral`. */
  tone?: StatGridTone;
  icon?: ComponentProps<typeof Feather>['name'];
  /** Makes the tile a drill-in target. */
  onPress?: () => void;
}

export type StatGridDensity = 'default' | 'compact';

export interface StatGridProps {
  items: readonly StatGridItem[];
  /** Tiles per row before wrapping. Default 2. */
  columns?: 2 | 3;
  /**
   * `compact` tightens padding, gaps and the value size for a glanceable
   * overview strip. Labels still wrap to two lines in both densities — they
   * carry the meaning, so they are never truncated to save height.
   */
  density?: StatGridDensity;
  /** Render same-footprint skeleton tiles instead of values. */
  loading?: boolean;
}

function toneColors(colors: SemanticColors, tone: StatGridTone) {
  switch (tone) {
    case 'brand':
      return { background: colors.brandSubtle, foreground: colors.brand };
    case 'success':
      return { background: colors.successSubtle, foreground: colors.success };
    case 'warning':
      return { background: colors.warningSubtle, foreground: colors.warning };
    case 'danger':
      return { background: colors.dangerSubtle, foreground: colors.danger };
    case 'info':
      return { background: colors.infoSubtle, foreground: colors.info };
    default:
      return { background: colors.surfaceSubtle, foreground: colors.textPrimary };
  }
}

export function StatGrid({
  items,
  columns = 2,
  density = 'default',
  loading = false,
}: StatGridProps) {
  const { colors } = useTheme();

  const basis = useMemo(() => columnStyles[columns], [columns]);
  const scale = densityScale[density];

  return (
    <View style={[styles.grid, gridStyles[density]]}>
      {items.map((item, index) => {
        const tone = toneColors(colors, item.tone ?? 'neutral');
        const tile = (
          <>
            <View style={[styles.valueRow, valueRowStyles[density]]}>
              {item.icon ? (
                <Feather name={item.icon} size={scale.iconSize} color={tone.foreground} />
              ) : null}
              {loading ? (
                <Skeleton width={scale.skeletonWidth} height={scale.skeletonHeight} radius={radius.sm} />
              ) : (
                <Text
                  variant={scale.valueVariant}
                  numberOfLines={1}
                  color={tone.foreground}
                  style={styles.value}>
                  {item.value}
                </Text>
              )}
            </View>
            <Text variant="caption" tone="secondary" numberOfLines={2} style={styles.label}>
              {item.label}
            </Text>
          </>
        );

        const tileStyle = [
          styles.tile,
          tileStyles[density],
          basis,
          { backgroundColor: tone.background },
        ];

        return item.onPress && !loading ? (
          <Pressable
            key={item.key ?? `${item.label}-${index}`}
            accessibilityRole="button"
            accessibilityLabel={`${item.label}: ${item.value}`}
            onPress={item.onPress}
            style={({ pressed }) => [...tileStyle, pressed && styles.pressed]}>
            {tile}
          </Pressable>
        ) : (
          <View key={item.key ?? `${item.label}-${index}`} style={tileStyle}>
            {tile}
          </View>
        );
      })}
    </View>
  );
}

const densityScale = {
  default: {
    iconSize: 14,
    skeletonWidth: 28,
    skeletonHeight: 18,
    valueVariant: 'subtitle' as const,
  },
  compact: {
    iconSize: 12,
    skeletonWidth: 20,
    skeletonHeight: 14,
    valueVariant: 'body' as const,
  },
} as const;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    flexGrow: 1,
    borderRadius: radius.lg,
  },
  pressed: {
    opacity: 0.7,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  value: {
    fontWeight: fontWeight.medium,
  },
  label: {
    flexShrink: 1,
  },
});

const gridStyles = StyleSheet.create({
  default: { gap: spacing[2] },
  compact: { gap: spacing[1] },
});

const tileStyles = StyleSheet.create({
  default: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    gap: spacing[1],
  },
  compact: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
  },
});

const valueRowStyles = StyleSheet.create({
  default: { minHeight: spacing[5] },
  compact: { minHeight: spacing[4] },
});

const columnStyles = StyleSheet.create({
  2: { flexBasis: '47%' },
  3: { flexBasis: '30%' },
});
