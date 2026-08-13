/**
 * StatCard — dashboard metric tile.
 *
 * Shape: icon bubble (leading) + label (caption, muted) as a header row,
 * then the value (large) below, with an optional up/down trend indicator
 * underneath. Built on the kit's `Card` (hair border, no shadow) and `Text`.
 */
import { Feather } from '@expo/vector-icons';
import { type ReactNode, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from './Card';
import { Text } from './Text';
import { useTheme } from './Theme';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

export type StatCardTone = 'brand' | 'neutral';

export interface StatCardTrend {
  direction: 'up' | 'down';
  value: string;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  /** Rendered inside the leading icon bubble. Caller controls the icon's own color. */
  icon?: ReactNode;
  trend?: StatCardTrend;
  /** Icon bubble background. Defaults to a neutral surface tint. */
  tone?: StatCardTone;
}

export function StatCard({ label, value, icon, trend, tone = 'neutral' }: StatCardProps) {
  const { colors } = useTheme();

  const dynamicStyles = useMemo(
    () => ({
      iconBubble: {
        backgroundColor: tone === 'brand' ? colors.brandSubtle : colors.surfaceSubtle,
      },
      trendColor: trend?.direction === 'down' ? colors.danger : colors.success,
    }),
    [colors, tone, trend?.direction],
  );

  return (
    <Card>
      <View style={styles.header}>
        {icon ? <View style={[styles.iconBubble, dynamicStyles.iconBubble]}>{icon}</View> : null}
        <Text variant="caption" tone="muted" numberOfLines={1} style={styles.label}>
          {label}
        </Text>
      </View>

      <Text variant="title" numberOfLines={1}>
        {value}
      </Text>

      {trend ? (
        <View style={styles.trend}>
          <Feather
            name={trend.direction === 'down' ? 'trending-down' : 'trending-up'}
            size={14}
            color={dynamicStyles.trendColor}
          />
          <Text variant="caption" numberOfLines={1} color={dynamicStyles.trendColor}>
            {trend.value}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  iconBubble: {
    width: spacing[10],
    height: spacing[10],
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flexShrink: 1,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[2],
  },
});
