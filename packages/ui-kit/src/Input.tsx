import { Feather } from '@expo/vector-icons';
import { type ReactNode, useMemo, useState } from 'react';
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

import { useTheme } from './Theme';
import { useFloatingLabel } from './hooks/useFloatingLabel';
import { borders } from './tokens/borders';
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
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isEditable = editable !== false && !disabled;
  const hasValue = Boolean(value);
  const isActive = focused || hasValue;

  const showFloating = Boolean(floating) && !!label;
  const floatingLabel = useFloatingLabel(showFloating && isActive);

  const dynamicStyles = useMemo(
    () => ({
      label: {
        backgroundColor: colors.surfacePrimary,
        color: colors.textMuted,
      },
      labelActive: {
        color: colors.brand,
      },
      fieldWrap: {
        backgroundColor: colors.surfacePrimary,
        borderColor: colors.border,
      },
      fieldWrapFocused: {
        borderColor: colors.brand,
      },
      fieldWrapError: {
        borderColor: colors.danger,
      },
      fieldWrapDisabled: {
        backgroundColor: colors.surfaceSubtle,
      },
      input: {
        color: colors.textPrimary,
      },
      inputDisabled: {
        color: colors.textSecondary,
      },
      hint: {
        color: colors.textMuted,
      },
      error: {
        color: colors.danger,
      },
    }),
    [colors],
  );

  const passwordToggle = secureTextEntry ? (
    <Pressable onPress={() => setShowPassword((prev) => !prev)}>
      <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color={colors.textSecondary} />
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
                dynamicStyles.label,
                { top: floatingLabel.top, color: floatingLabel.color },
              ]}>
              {label}
            </Animated.Text>
          ) : (
            <RNText
              style={[
                styles.label,
                dynamicStyles.label,
                { top: -8 },
                isActive && dynamicStyles.labelActive,
              ]}>
              {label}
            </RNText>
          )
        ) : null}
        <View
          style={[
            styles.fieldWrap,
            dynamicStyles.fieldWrap,
            multiline && styles.fieldWrapMultiline,
            focused && styles.fieldWrapFocused,
            focused && dynamicStyles.fieldWrapFocused,
            error ? styles.fieldWrapError : null,
            error ? dynamicStyles.fieldWrapError : null,
            !isEditable && styles.fieldWrapDisabled,
            !isEditable && dynamicStyles.fieldWrapDisabled,
            containerStyle,
          ]}>
          {leftIcon ? <View style={styles.iconStart}>{leftIcon}</View> : null}
          <TextInput
            {...rest}
            value={value}
            multiline={multiline}
            editable={isEditable}
            placeholder={showFloating ? undefined : placeholder}
            placeholderTextColor={placeholderTextColor ?? colors.textMuted}
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
              dynamicStyles.input,
              multiline && styles.inputMultiline,
              { textAlign: isRTL() ? 'right' : 'left' },
              leftIcon ? styles.inputWithLeftIcon : null,
              resolvedRightIcon ? styles.inputWithRightIcon : null,
              !isEditable && dynamicStyles.inputDisabled,
              style,
            ]}
          />
          {resolvedRightIcon ? <View style={styles.iconEnd}>{resolvedRightIcon}</View> : null}
        </View>
      </View>
      {error ? (
        <RNText style={[styles.error, dynamicStyles.error]}>{error}</RNText>
      ) : hint ? (
        <RNText style={[styles.hint, dynamicStyles.hint]}>{hint}</RNText>
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
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borders.hair,
    borderRadius: radius.md,
    height: FIELD_HEIGHT,
  },
  fieldWrapFocused: {
    borderWidth: borders.thin,
  },
  fieldWrapError: {
    borderWidth: borders.thin,
  },
  fieldWrapDisabled: {
    opacity: 0.7,
  },
  fieldWrapMultiline: {
    height: undefined,
    minHeight: MULTILINE_MIN_HEIGHT,
    alignItems: 'flex-start',
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
  },
  error: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
  },
});
