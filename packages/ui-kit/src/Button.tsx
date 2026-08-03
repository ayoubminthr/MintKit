import {
  Pressable,
  type PressableProps,
  StyleSheet,
  Text as RNText,
  View,
  type ViewStyle,
} from 'react-native';

import { Spinner, type SpinnerSize, type SpinnerTone } from './Spinner';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
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
  const isDisabled = disabled || loading;

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

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: lightColors.brand },
  secondary: {
    backgroundColor: lightColors.surfacePrimary,
    borderWidth: borders.hair,
    borderColor: lightColors.border,
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: lightColors.danger },
  'danger-ghost': { backgroundColor: 'transparent' },
  link: { backgroundColor: 'transparent', paddingHorizontal: 0 },
};

const pressedStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: lightColors.brandHover },
  secondary: { backgroundColor: lightColors.surfaceSubtle },
  ghost: { backgroundColor: lightColors.surfaceSubtle },
  danger: { backgroundColor: '#B84A24' },
  'danger-ghost': { backgroundColor: lightColors.dangerSubtle },
  link: { backgroundColor: 'transparent', opacity: 0.7 },
};

const labelVariantStyles = StyleSheet.create({
  primary: { color: lightColors.onBrand },
  secondary: { color: lightColors.textPrimary },
  ghost: { color: lightColors.textPrimary },
  danger: { color: lightColors.onBrand },
  'danger-ghost': { color: lightColors.danger },
  link: { color: lightColors.brand, textDecorationLine: 'underline' },
});

const rippleColor: Record<ButtonVariant, string> = {
  primary: lightColors.brandStrong,
  secondary: lightColors.surfaceSubtle,
  ghost: lightColors.surfaceSubtle,
  danger: '#B84A24',
  'danger-ghost': lightColors.dangerSubtle,
  link: 'transparent',
};
