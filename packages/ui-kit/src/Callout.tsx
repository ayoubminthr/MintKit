import { type ReactNode, useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

export type CalloutAccent = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';

const ACCENT_WIDTH = 3;

export interface CalloutProps extends ViewProps {
  accent?: CalloutAccent;
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function Callout({
  accent = 'neutral',
  title,
  description,
  children,
  style,
  ...rest
}: CalloutProps) {
  const { colors } = useTheme();
  const accentColors: Record<CalloutAccent, string> = useMemo(
    () => ({
      neutral: palette.gray[400],
      brand: colors.brand,
      info: colors.info,
      success: colors.success,
      warning: colors.warning,
      danger: colors.danger,
    }),
    [colors],
  );
  const dynamicStyles = useMemo(
    () => ({
      container: { backgroundColor: colors.surfaceSubtle },
    }),
    [colors],
  );

  return (
    <View {...rest} style={[styles.container, dynamicStyles.container, style]}>
      <View style={[styles.accent, { backgroundColor: accentColors[accent] }]} />
      <View style={styles.content}>
        {title ? (
          <Text variant="body" style={styles.title}>
            {title}
          </Text>
        ) : null}
        {description ? (
          <Text variant="caption" tone="secondary">
            {description}
          </Text>
        ) : null}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  accent: {
    width: ACCENT_WIDTH,
  },
  content: {
    flex: 1,
    padding: spacing[3],
    gap: 2,
  },
  title: {
    fontWeight: '500',
  },
});
