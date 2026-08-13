/**
 * Banner — persistent app-level status strip.
 *
 * Full-width, semantic-tinted, no radius (sits flush against the top
 * app bar or beneath it). Different from Toast (ephemeral) and Alert
 * (content-area card).
 *
 * Usage:
 *   <Banner
 *     variant="warning"
 *     message="You're offline. Changes will sync when you reconnect."
 *     actionLabel="Retry"
 *     onAction={retry}
 *     onDismiss={dismissBanner}
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { type ComponentProps, useMemo } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { palette } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { fontWeight } from './tokens/typography';

export type BannerVariant = 'info' | 'success' | 'warning' | 'danger';

export interface BannerProps extends ViewProps {
  variant?: BannerVariant;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const iconByVariant: Record<BannerVariant, ComponentProps<typeof Feather>['name']> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-octagon',
};

interface BannerTheme {
  background: string;
  border: string;
  icon: string;
  text: string;
  action: string;
}

export function Banner({
  variant = 'info',
  message,
  actionLabel,
  onAction,
  onDismiss,
  style,
  ...rest
}: BannerProps) {
  const { colors, theme: themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const themeByVariant = useMemo<Record<BannerVariant, BannerTheme>>(
    () => ({
      info: {
        background: colors.infoSubtle,
        border: isDark ? palette.info[700] : palette.info[100],
        icon: palette.info[500],
        text: isDark ? palette.info[50] : palette.info[900],
        action: isDark ? palette.info[100] : palette.info[700],
      },
      success: {
        background: colors.successSubtle,
        border: isDark ? palette.success[700] : palette.success[100],
        icon: palette.success[500],
        text: isDark ? palette.success[50] : palette.success[900],
        action: isDark ? palette.success[100] : palette.success[700],
      },
      warning: {
        background: colors.warningSubtle,
        border: isDark ? palette.warning[700] : palette.warning[100],
        icon: palette.warning[500],
        text: isDark ? palette.warning[50] : palette.warning[900],
        action: isDark ? palette.warning[100] : palette.warning[700],
      },
      danger: {
        background: colors.dangerSubtle,
        border: isDark ? palette.danger[700] : palette.danger[100],
        icon: palette.danger[500],
        text: isDark ? palette.danger[50] : palette.danger[900],
        action: isDark ? palette.danger[100] : palette.danger[700],
      },
    }),
    [colors, isDark]
  );
  const theme = themeByVariant[variant];

  return (
    <View
      {...rest}
      accessibilityLiveRegion="polite"
      style={[
        styles.container,
        { backgroundColor: theme.background, borderBottomColor: theme.border },
        style,
      ]}>
      <Feather name={iconByVariant[variant]} size={16} color={theme.icon} style={styles.icon} />
      <Text variant="body" color={theme.text} style={styles.message} numberOfLines={3}>
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={spacing[2]}
          onPress={onAction}
          style={styles.actionButton}>
          <Text
            variant="body"
            color={theme.action}
            style={{ fontWeight: fontWeight.medium }}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
      {onDismiss ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          hitSlop={spacing[2]}
          onPress={onDismiss}
          style={styles.dismissButton}>
          <Feather name="x" size={16} color={theme.icon} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: borders.hair,
  },
  icon: {
    flexShrink: 0,
  },
  message: {
    flex: 1,
  },
  actionButton: {
    flexShrink: 0,
  },
  dismissButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
