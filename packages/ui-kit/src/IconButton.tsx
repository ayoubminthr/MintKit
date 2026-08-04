import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, type PressableProps, StyleSheet, type ViewStyle } from 'react-native';

import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'tint';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  icon: React.ComponentProps<typeof Feather>['name'];
  /** Required for accessibility — describes the action, not the icon. */
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

const sizeMap: Record<IconButtonSize, { box: number; icon: number }> = {
  sm: { box: 28, icon: 14 },
  md: { box: 36, icon: 16 },
  lg: { box: 44, icon: 18 },
};

export function IconButton({
  icon,
  accessibilityLabel,
  variant = 'secondary',
  size = 'md',
  disabled,
  ...rest
}: IconButtonProps) {
  const { colors } = useTheme();
  const dims = sizeMap[size];

  const variantStyles = useMemo<
    Record<
      IconButtonVariant,
      {
        container: ViewStyle;
        pressed: ViewStyle;
        iconColor: string;
        ripple: string;
      }
    >
  >(
    () => ({
      primary: {
        container: { backgroundColor: colors.brand },
        pressed: { backgroundColor: colors.brandHover },
        iconColor: colors.onBrand,
        ripple: colors.brandStrong,
      },
      secondary: {
        container: {
          backgroundColor: colors.surfacePrimary,
          borderWidth: borders.hair,
          borderColor: colors.border,
        },
        pressed: { backgroundColor: colors.surfaceSubtle },
        iconColor: colors.textPrimary,
        ripple: colors.surfaceSubtle,
      },
      ghost: {
        container: { backgroundColor: 'transparent' },
        pressed: { backgroundColor: colors.surfaceSubtle },
        iconColor: colors.textPrimary,
        ripple: colors.surfaceSubtle,
      },
      danger: {
        container: { backgroundColor: colors.danger },
        pressed: { backgroundColor: '#B84A24' },
        iconColor: colors.onBrand,
        ripple: '#B84A24',
      },
      tint: {
        container: { backgroundColor: colors.brandSubtle },
        pressed: { backgroundColor: colors.brandSubtle },
        iconColor: colors.brand,
        ripple: colors.brand,
      },
    }),
    [colors],
  );
  const v = variantStyles[variant];

  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      android_ripple={{ color: v.ripple, borderless: false }}
      style={({ pressed }) => [
        baseStyles.button,
        { width: dims.box, height: dims.box, borderRadius: radius.md },
        v.container,
        disabled && baseStyles.disabled,
        pressed && v.pressed,
      ]}>
      <Feather name={icon} size={dims.icon} color={v.iconColor} />
    </Pressable>
  );
}

const baseStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
});
