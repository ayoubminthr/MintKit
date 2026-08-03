import { useState } from 'react';
import {
  StyleSheet,
  Text as RNText,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight, lineHeight } from './tokens/typography';
import { isRTL } from './utils/rtl';

export interface TextareaProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  rows?: number;
}

export function Textarea({
  label,
  hint,
  error,
  rows = 4,
  onFocus,
  onBlur,
  style,
  value,
  ...rest
}: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || Boolean(value);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <RNText style={[styles.label, isActive && styles.labelActive]}>{label}</RNText>
      ) : null}
      <TextInput
        {...rest}
        value={value}
        multiline
        textAlignVertical="top"
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
          { minHeight: Math.max(rows, 1) * fontSize.sm * lineHeight.normal + spacing[3] * 2 },
          focused && styles.inputFocused,
          error ? styles.inputError : null,
          style,
        ]}
      />
      {error ? (
        <RNText style={styles.error}>{error}</RNText>
      ) : hint ? (
        <RNText style={styles.hint}>{hint}</RNText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing[1],
  },
  label: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: lightColors.textMuted,
  },
  labelActive: {
    color: lightColors.brand,
  },
  input: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    backgroundColor: lightColors.surfacePrimary,
    borderColor: lightColors.border,
    borderWidth: borders.hair,
    borderRadius: radius.md,
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    color: lightColors.textPrimary,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  inputFocused: {
    borderColor: lightColors.brand,
    borderWidth: borders.thin,
  },
  inputError: {
    borderColor: lightColors.danger,
    borderWidth: borders.thin,
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
