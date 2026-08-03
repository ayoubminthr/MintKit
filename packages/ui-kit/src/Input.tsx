import { Feather } from '@expo/vector-icons';
import { type ReactNode, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text as RNText,
  TextInput,
  type TextInputProps,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useFloatingLabel } from './hooks/useFloatingLabel';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight } from './tokens/typography';
import { isRTL } from './utils/rtl';

export interface InputProps extends TextInputProps {
  label?: string;
  /**
   * Animates `label` between a resting position inside the field (like a
   * placeholder) and a notch above the border, based on focus/value —
   * matching Select/DatePicker/TimePicker's floating label. Requires
   * `label`. When false (default), `label` still renders as a notch but
   * stays pinned there, and `placeholder` remains visible inside the field.
   */
  floating?: boolean;
  hint?: string;
  error?: string;
  disabled?: boolean;
  /** Slot rendered inside the field on the start (leading) edge. */
  leftIcon?: ReactNode;
  /** Slot rendered inside the field on the end (trailing) edge. Ignored when `secureTextEntry` is true — the built-in show/hide toggle takes that slot instead. */
  rightIcon?: ReactNode;
  /** Style override for the bordered field box (the element that owns focus/error/disabled styling) — `style` targets the inner text input instead. */
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  floating,
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
  multiline,
  placeholder,
  placeholderTextColor,
  secureTextEntry,
  value,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isEditable = editable !== false && !disabled;
  const hasValue = Boolean(value);
  const isActive = focused || hasValue;

  const showFloating = Boolean(floating) && !!label;
  const floatingLabel = useFloatingLabel(showFloating && isActive);

  const passwordToggle = secureTextEntry ? (
    <Pressable onPress={() => setShowPassword((prev) => !prev)}>
      <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color={lightColors.textSecondary} />
    </Pressable>
  ) : null;
  const resolvedRightIcon = secureTextEntry ? passwordToggle : rightIcon;

  return (
    <View style={styles.wrapper}>
      <View style={styles.fieldContainer}>
        {label ? (
          showFloating ? (
            <Animated.Text
              style={[
                styles.label,
                { top: floatingLabel.top, color: floatingLabel.color },
              ]}>
              {label}
            </Animated.Text>
          ) : (
            <RNText style={[styles.label, { top: -8 }, isActive && styles.labelActive]}>
              {label}
            </RNText>
          )
        ) : null}
        <View
          style={[
            styles.fieldWrap,
            multiline && styles.fieldWrapMultiline,
            focused && styles.fieldWrapFocused,
            error ? styles.fieldWrapError : null,
            !isEditable && styles.fieldWrapDisabled,
            containerStyle,
          ]}>
          {leftIcon ? <View style={styles.iconStart}>{leftIcon}</View> : null}
          <TextInput
            {...rest}
            value={value}
            multiline={multiline}
            editable={isEditable}
            placeholder={showFloating ? undefined : placeholder}
            placeholderTextColor={placeholderTextColor ?? lightColors.textMuted}
            secureTextEntry={Boolean(secureTextEntry) && !showPassword}
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
              multiline && styles.inputMultiline,
              { textAlign: isRTL() ? 'right' : 'left' },
              leftIcon ? styles.inputWithLeftIcon : null,
              resolvedRightIcon ? styles.inputWithRightIcon : null,
              !isEditable && styles.inputDisabled,
              style,
            ]}
          />
          {resolvedRightIcon ? <View style={styles.iconEnd}>{resolvedRightIcon}</View> : null}
        </View>
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
const MULTILINE_MIN_HEIGHT = 96;

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing[1],
  },
  fieldContainer: {
    position: 'relative',
  },
  label: {
    position: 'absolute',
    start: 8,
    zIndex: 999,
    paddingHorizontal: 5,
    backgroundColor: lightColors.surfacePrimary,
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: lightColors.textMuted,
  },
  labelActive: {
    color: lightColors.brand,
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
  fieldWrapMultiline: {
    height: undefined,
    minHeight: MULTILINE_MIN_HEIGHT,
    alignItems: 'flex-start',
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
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    color: lightColors.textPrimary,
  },
  inputWithLeftIcon: {
    paddingStart: spacing[2],
  },
  inputWithRightIcon: {
    paddingEnd: spacing[2],
  },
  inputMultiline: {
    height: undefined,
    paddingVertical: spacing[2],
    textAlignVertical: 'top',
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
