import { useMemo } from 'react';
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  Text as RNText,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import { Spinner, type SpinnerSize, type SpinnerTone } from './Spinner';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight } from './tokens/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Shows a spinner in place of the label/icons and blocks presses. */
  loading?: boolean;
}

const spinnerSizeBySize: Record<ButtonSize, SpinnerSize> = {
  sm: 'sm',
  md: 'md',
  lg: 'md',
};

const spinnerToneByVariant: Record<ButtonVariant, SpinnerTone> = {
  primary: 'inverse',
  secondary: 'brand',
  ghost: 'brand',
  danger: 'inverse',
  'danger-ghost': 'brand',
  link: 'brand',
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  loading = false,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const variantStyles = useMemo<Record<ButtonVariant, ViewStyle>>(
    () => ({
      primary: { backgroundColor: colors.brand },
      secondary: {
        backgroundColor: colors.surfacePrimary,
        borderWidth: borders.hair,
        borderColor: colors.border,
      },
      ghost: { backgroundColor: 'transparent' },
      danger: { backgroundColor: colors.danger },
      'danger-ghost': { backgroundColor: 'transparent' },
      link: { backgroundColor: 'transparent', paddingHorizontal: 0 },
    }),
    [colors]
  );

  const pressedStyles = useMemo<Record<ButtonVariant, ViewStyle>>(
    () => ({
      primary: { backgroundColor: colors.brandHover },
      secondary: { backgroundColor: colors.surfaceSubtle },
      ghost: { backgroundColor: colors.surfaceSubtle },
      danger: { backgroundColor: '#B84A24' },
      'danger-ghost': { backgroundColor: colors.dangerSubtle },
      link: { backgroundColor: 'transparent', opacity: 0.7 },
    }),
    [colors]
  );

  const labelVariantStyles = useMemo<Record<ButtonVariant, TextStyle>>(
    () => ({
      primary: { color: colors.onBrand },
      secondary: { color: colors.textPrimary },
      ghost: { color: colors.textPrimary },
      danger: { color: colors.onBrand },
      'danger-ghost': { color: colors.danger },
      link: { color: colors.brand, textDecorationLine: 'underline' },
    }),
    [colors]
  );

  const rippleColor = useMemo<Record<ButtonVariant, string>>(
    () => ({
      primary: colors.brandStrong,
      secondary: colors.surfaceSubtle,
      ghost: colors.surfaceSubtle,
      danger: '#B84A24',
      'danger-ghost': colors.dangerSubtle,
      link: 'transparent',
    }),
    [colors]
  );

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      android_ripple={{ color: rippleColor[variant], borderless: false }}
      style={({ pressed }) => [
        baseStyles.button,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && baseStyles.fullWidth,
        disabled && !loading && baseStyles.disabled,
        pressed && pressedStyles[variant],
      ]}>
      {loading ? (
        <Spinner size={spinnerSizeBySize[size]} tone={spinnerToneByVariant[variant]} />
      ) : (
        <>
          {leftIcon ? <View style={baseStyles.iconSlot}>{leftIcon}</View> : null}
          <RNText style={[baseStyles.label, labelSizeStyles[size], labelVariantStyles[variant]]}>
            {label}
          </RNText>
          {rightIcon ? <View style={baseStyles.iconSlot}>{rightIcon}</View> : null}
        </>
      )}
    </Pressable>
  );
}

const baseStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.5 },
  iconSlot: { alignItems: 'center', justifyContent: 'center' },
  label: {
    fontFamily: fontFamily.sans,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
});

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: { height: 32, paddingHorizontal: spacing[3], gap: spacing[1] },
  md: { height: 38, paddingHorizontal: spacing[4], gap: spacing[2] },
  lg: { height: 44, paddingHorizontal: spacing[4], gap: spacing[2] },
};

const labelSizeStyles = StyleSheet.create({
  sm: { fontSize: fontSize.sm },
  md: { fontSize: fontSize.md },
  lg: { fontSize: fontSize.md },
});
