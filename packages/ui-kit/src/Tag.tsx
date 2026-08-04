import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text as RNText, View, type ViewProps } from 'react-native';

import { useTheme } from './Theme';
import { palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight } from './tokens/typography';

export type TagVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export interface TagProps extends ViewProps {
  label: string;
  variant?: TagVariant;
  onRemove?: () => void;
}

export function Tag({ label, variant = 'neutral', onRemove, style, ...rest }: TagProps) {
  const { colors } = useTheme();

  const variantStyles = useMemo<Record<TagVariant, { container: object; label: { color: string } }>>(
    () => ({
      neutral: {
        container: { backgroundColor: colors.surfaceSubtle },
        label: { color: colors.textSecondary },
      },
      brand: {
        container: { backgroundColor: colors.brandSubtle },
        label: { color: palette.brand[700] },
      },
      success: {
        container: { backgroundColor: colors.successSubtle },
        label: { color: palette.success[700] },
      },
      warning: {
        container: { backgroundColor: colors.warningSubtle },
        label: { color: palette.warning[700] },
      },
      danger: {
        container: { backgroundColor: colors.dangerSubtle },
        label: { color: palette.danger[700] },
      },
      info: {
        container: { backgroundColor: colors.infoSubtle },
        label: { color: palette.info[700] },
      },
    }),
    [colors]
  );

  const v = variantStyles[variant];

  return (
    <View {...rest} style={[styles.container, v.container, style]}>
      <RNText style={[styles.label, v.label]} numberOfLines={1}>
        {label}
      </RNText>
      {onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          hitSlop={8}
          onPress={onRemove}
          style={styles.removeButton}>
          <Feather name="x" size={12} color={v.label.color} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
  },
  label: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 2,
  },
});
