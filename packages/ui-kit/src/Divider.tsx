import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { spacing } from './tokens/spacing';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';

export interface DividerProps {
  orientation?: DividerOrientation;
  label?: string;
  spacing?: DividerSpacing;
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
}: DividerProps) {
  const { colors } = useTheme();
  const margin = spacingMap[spaceKey];

  const dynamicStyles = useMemo(
    () => ({
      horizontal: { backgroundColor: colors.border },
      vertical: { backgroundColor: colors.border },
      line: { backgroundColor: colors.border },
    }),
    [colors],
  );

  if (orientation === 'vertical') {
    return (
      <View
        accessibilityRole="none"
        style={[
          styles.vertical,
          dynamicStyles.vertical,
          { marginHorizontal: margin },
        ]}
      />
    );
  }

  if (label) {
    return (
      <View
        accessibilityRole="none"
        style={[styles.labelled, { marginVertical: margin }]}>
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
      style={[styles.horizontal, dynamicStyles.horizontal, { marginVertical: margin }]}
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
