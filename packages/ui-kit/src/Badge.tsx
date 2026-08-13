import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight } from './tokens/typography';

export type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends ViewProps {
  label: string;
  variant?: BadgeVariant;
  /** Show a colored dot before the label. */
  dot?: boolean;
  /** Show an icon before the label. Pass any Feather icon name. */
  icon?: React.ComponentProps<typeof Feather>['name'];
}

export function Badge({ label, variant = 'neutral', dot, icon, style, ...rest }: BadgeProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const variantStyles = useMemo<Record<BadgeVariant, { container: object; label: { color: string } }>>(
    () => ({
      neutral: {
        container: { backgroundColor: colors.surfaceSubtle },
        label: { color: colors.textSecondary },
      },
      brand: {
        container: { backgroundColor: colors.brandSubtle },
        label: { color: isDark ? palette.brand[100] : palette.brand[700] },
      },
      success: {
        container: { backgroundColor: colors.successSubtle },
        label: { color: isDark ? palette.success[100] : palette.success[700] },
      },
      warning: {
        container: { backgroundColor: colors.warningSubtle },
        label: { color: isDark ? palette.warning[100] : palette.warning[700] },
      },
      danger: {
        container: { backgroundColor: colors.dangerSubtle },
        label: { color: isDark ? palette.danger[100] : palette.danger[700] },
      },
      info: {
        container: { backgroundColor: colors.infoSubtle },
        label: { color: isDark ? palette.info[100] : palette.info[700] },
      },
    }),
    [colors, isDark]
  );

  const v = variantStyles[variant];
  return (
    <View {...rest} style={[styles.badge, v.container, style]}>
      {dot ? <View style={[styles.dot, { backgroundColor: v.label.color }]} /> : null}
      {icon ? <Feather name={icon} size={11} color={v.label.color} /> : null}
      <Text scaled={false} color={v.label.color} style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  label: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
