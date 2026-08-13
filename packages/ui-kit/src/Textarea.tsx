import { useMemo, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
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
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const isActive = focused || Boolean(value);

  const dynamicStyles = useMemo(
    () => ({
      input: {
        backgroundColor: colors.surfacePrimary,
        borderColor: colors.border,
        color: colors.textPrimary,
      },
      inputFocused: { borderColor: colors.brand },
      inputError: { borderColor: colors.danger },
    }),
    [colors],
  );

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text scaled={false} color={isActive ? colors.brand : colors.textMuted} style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        {...rest}
        value={value}
        multiline
        textAlignVertical="top"
        placeholderTextColor={colors.textMuted}
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
          { textAlign: isRTL() ? 'right' : 'left' },
          { minHeight: Math.max(rows, 1) * fontSize.sm * lineHeight.normal + spacing[3] * 2 },
          focused && [styles.inputFocused, dynamicStyles.inputFocused],
          error ? [styles.inputError, dynamicStyles.inputError] : null,
          style,
        ]}
      />
      {error ? (
        <Text scaled={false} color={colors.danger} style={styles.error}>
          {error}
        </Text>
      ) : hint ? (
        <Text scaled={false} color={colors.textMuted} style={styles.hint}>
          {hint}
        </Text>
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
  },
  input: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    borderWidth: borders.hair,
    borderRadius: radius.md,
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  inputFocused: {
    borderWidth: borders.thin,
  },
  inputError: {
    borderWidth: borders.thin,
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
