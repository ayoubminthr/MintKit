import { useMemo } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { spacing } from './tokens/spacing';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';
export type DividerVariant = 'solid' | 'dashed';

export interface DividerProps {
  orientation?: DividerOrientation;
  label?: string;
  spacing?: DividerSpacing;
  variant?: DividerVariant;
  /** Escape hatch for one-off margin overrides; prefer the `spacing` preset. */
  style?: StyleProp<ViewStyle>;
}

const spacingMap: Record<DividerSpacing, number> = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
};

export function Divider({
  orientation = 'horizontal',
  label,
  spacing: spaceKey = 'none',
  variant = 'solid',
  style,
}: DividerProps) {
  const { colors } = useTheme();
  const margin = spacingMap[spaceKey];
  const isDashed = variant === 'dashed';

  const dynamicStyles = useMemo(
    () =>
      isDashed
        ? {
            horizontal: {
              height: 0,
              borderBottomWidth: borders.hair,
              borderStyle: 'dashed' as const,
              borderBottomColor: colors.border,
            },
            vertical: {
              width: 0,
              borderStartWidth: borders.hair,
              borderStyle: 'dashed' as const,
              borderStartColor: colors.border,
            },
            line: {
              height: 0,
              borderBottomWidth: borders.hair,
              borderStyle: 'dashed' as const,
              borderBottomColor: colors.border,
            },
          }
        : {
            horizontal: { backgroundColor: colors.border },
            vertical: { backgroundColor: colors.border },
            line: { backgroundColor: colors.border },
          },
    [colors, isDashed],
  );

  if (orientation === 'vertical') {
    return (
      <View
        accessibilityRole="none"
        style={[
          styles.vertical,
          dynamicStyles.vertical,
          { marginHorizontal: margin },
          style,
        ]}
      />
    );
  }

  if (label) {
    return (
      <View
        accessibilityRole="none"
        style={[styles.labelled, { marginVertical: margin }, style]}>
        <View style={[styles.line, dynamicStyles.line]} />
        <Text variant="caption" tone="muted" style={styles.labelText}>
          {label}
        </Text>
        <View style={[styles.line, dynamicStyles.line]} />
      </View>
    );
  }

  return (
    <View
      accessibilityRole="none"
      style={[styles.horizontal, dynamicStyles.horizontal, { marginVertical: margin }, style]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: borders.hair,
    width: '100%',
  },
  vertical: {
    width: borders.hair,
    alignSelf: 'stretch',
  },
  labelled: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: spacing[3],
  },
  line: {
    flex: 1,
    height: borders.hair,
  },
  labelText: {
    flexShrink: 0,
  },
});
