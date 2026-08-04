import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { borders } from './tokens/borders';
import { palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { Text } from './Text';
import { useTheme } from './Theme';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends ViewProps {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  onClose?: () => void;
}

const iconNameByVariant: Record<AlertVariant, React.ComponentProps<typeof Feather>['name']> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-octagon',
};

export function Alert({
  variant = 'info',
  title,
  description,
  onClose,
  style,
  ...rest
}: AlertProps) {
  const { colors } = useTheme();

  const variantStyles = useMemo<
    Record<
      AlertVariant,
      {
        container: object;
        iconColor: string;
        titleColor: string;
        descColor: string;
      }
    >
  >(
    () => ({
      info: {
        container: { backgroundColor: colors.infoSubtle, borderColor: palette.info[100] },
        iconColor: palette.info[500],
        titleColor: palette.info[900],
        descColor: palette.info[700],
      },
      success: {
        container: { backgroundColor: colors.successSubtle, borderColor: palette.success[100] },
        iconColor: palette.success[500],
        titleColor: palette.success[900],
        descColor: palette.success[700],
      },
      warning: {
        container: { backgroundColor: colors.warningSubtle, borderColor: palette.warning[100] },
        iconColor: palette.warning[500],
        titleColor: palette.warning[900],
        descColor: palette.warning[700],
      },
      danger: {
        container: { backgroundColor: colors.dangerSubtle, borderColor: palette.danger[100] },
        iconColor: palette.danger[500],
        titleColor: palette.danger[900],
        descColor: palette.danger[700],
      },
    }),
    [colors]
  );

  const v = variantStyles[variant];
  return (
    <View {...rest} style={[styles.container, v.container, style]}>
      <Feather
        name={iconNameByVariant[variant]}
        size={16}
        color={v.iconColor}
        style={styles.icon}
      />
      <View style={styles.content}>
        {title ? (
          <Text variant="body" style={[styles.title, { color: v.titleColor }]}>
            {title}
          </Text>
        ) : null}
        {description ? (
          <Text variant="caption" style={{ color: v.descColor }}>
            {description}
          </Text>
        ) : null}
      </View>
      {onClose ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          hitSlop={8}
          onPress={onClose}
          style={styles.closeButton}>
          <Feather name="x" size={14} color={v.iconColor} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    padding: spacing[3],
    borderRadius: radius.md,
    borderWidth: borders.hair,
  },
  icon: {
    marginTop: 1,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '500',
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
});
