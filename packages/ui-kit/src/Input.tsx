import { type ReactNode, useState } from 'react';
import {
  StyleSheet,
  Text as RNText,
  TextInput,
  type TextInputProps,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight } from './tokens/typography';
import { isRTL } from './utils/rtl';

export interface InputProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  /** Slot rendered inside the field on the start (leading) edge. */
  leftIcon?: ReactNode;
  /** Slot rendered inside the field on the end (trailing) edge. */
  rightIcon?: ReactNode;
  /** Style override for the bordered field box (the element that owns focus/error/disabled styling) — `style` targets the inner text input instead. */
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  hint,
  error,
  disabled,
  editable,
  leftIcon,
  rightIcon,
  onFocus,
  onBlur,
  style,
  containerStyle,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const isEditable = editable !== false && !disabled;

  return (
    <View style={styles.wrapper}>
      {label ? <RNText style={styles.label}>{label}</RNText> : null}
      <View
        style={[
          styles.fieldWrap,
          focused && styles.fieldWrapFocused,
          error ? styles.fieldWrapError : null,
          !isEditable && styles.fieldWrapDisabled,
          containerStyle,
        ]}>
        {leftIcon ? <View style={styles.iconStart}>{leftIcon}</View> : null}
        <TextInput
          {...rest}
          editable={isEditable}
          placeholderTextColor={lightColors.textMuted}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            { textAlign: isRTL() ? 'right' : 'left' },
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            !isEditable && styles.inputDisabled,
            style,
          ]}
        />
        {rightIcon ? <View style={styles.iconEnd}>{rightIcon}</View> : null}
      </View>
      {error ? (
        <RNText style={styles.error}>{error}</RNText>
      ) : hint ? (
        <RNText style={styles.hint}>{hint}</RNText>
      ) : null}
    </View>
  );
}

const FIELD_HEIGHT = 40;

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing[1],
  },
  label: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: lightColors.textSecondary,
  },
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightColors.surfacePrimary,
    borderColor: lightColors.border,
    borderWidth: borders.hair,
    borderRadius: radius.md,
    height: FIELD_HEIGHT,
  },
  fieldWrapFocused: {
    borderColor: lightColors.brand,
    borderWidth: borders.thin,
  },
  fieldWrapError: {
    borderColor: lightColors.danger,
    borderWidth: borders.thin,
  },
  fieldWrapDisabled: {
    backgroundColor: lightColors.surfaceSubtle,
    opacity: 0.7,
  },
  inputDisabled: {
    color: lightColors.textSecondary,
  },
  iconStart: {
    paddingStart: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEnd: {
    paddingEnd: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing[3],
    fontFamily: fontFamily.sans,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    color: lightColors.textPrimary,
  },
  inputWithLeftIcon: {
    paddingStart: spacing[2],
  },
  inputWithRightIcon: {
    paddingEnd: spacing[2],
  },
  hint: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    color: lightColors.textMuted,
  },
  error: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    color: lightColors.danger,
  },
});
