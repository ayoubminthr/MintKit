import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight } from './tokens/typography';
import { Text } from './Text';

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Number of digits — typically 4 or 6. */
  length?: number;
  label?: string;
  error?: string;
  autoFocus?: boolean;
  onComplete?: (value: string) => void;
}

const CELL_SIZE = 44;

export function OtpInput({
  value,
  onChange,
  length = 6,
  label,
  error,
  autoFocus,
  onComplete,
}: OtpInputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const ref = useRef<TextInput>(null);
  const isActive = focused || value.length > 0;

  const dynamicStyles = useMemo(
    () => ({
      cell: { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
      cellActive: { borderColor: colors.brand },
      cellError: { borderColor: colors.danger },
    }),
    [colors]
  );

  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, length);
    onChange(digits);
  };

  const cells = Array.from({ length }, (_, i) => value[i] ?? '');

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text
          variant="caption"
          color={isActive ? colors.brand : colors.textMuted}
          style={styles.label}>
          {label}
        </Text>
      ) : null}
      <Pressable
        accessibilityRole="text"
        accessibilityLabel="Verification code"
        onPress={() => ref.current?.focus()}
        style={styles.cellsRow}>
        {cells.map((char, idx) => {
          const isActive = focused && idx === Math.min(value.length, length - 1);
          return (
            <View
              key={idx}
              style={[
                styles.cell,
                dynamicStyles.cell,
                isActive && styles.cellActive,
                isActive && dynamicStyles.cellActive,
                error ? styles.cellError : null,
                error ? dynamicStyles.cellError : null,
              ]}>
              <Text variant="body" style={styles.cellText}>
                {char}
              </Text>
            </View>
          );
        })}
        <TextInput
          ref={ref}
          value={value}
          onChangeText={handleChange}
          autoFocus={autoFocus}
          keyboardType="number-pad"
          maxLength={length}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.hiddenInput}
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          caretHidden
        />
      </Pressable>
      {error ? (
        <Text variant="caption" tone="danger">
          {error}
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
    fontWeight: '500',
  },
  cellsRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borders.hair,
    borderRadius: radius.md,
  },
  cellActive: {
    borderWidth: borders.thin,
  },
  cellError: {
    borderWidth: borders.thin,
  },
  cellText: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
