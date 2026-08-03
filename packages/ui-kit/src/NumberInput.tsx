import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight } from './tokens/typography';
import { Text } from './Text';

export interface NumberInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'keyboardType' | 'onChange'> {
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({
  value,
  onChange,
  label,
  hint,
  error,
  min = -Infinity,
  max = Infinity,
  step = 1,
  onFocus,
  onBlur,
  ...rest
}: NumberInputProps) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value !== null;

  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const inc = () => onChange(clamp((value ?? 0) + step));
  const dec = () => onChange(clamp((value ?? 0) - step));

  const incDisabled = value !== null && value >= max;
  const decDisabled = value !== null && value <= min;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text variant="caption" style={[styles.label, isActive && styles.labelActive]}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.fieldWrap,
          focused && styles.fieldWrapFocused,
          error ? styles.fieldWrapError : null,
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Decrement"
          disabled={decDisabled}
          onPress={dec}
          style={({ pressed }) => [
            styles.stepButton,
            pressed && !decDisabled && styles.stepButtonPressed,
            decDisabled && styles.stepButtonDisabled,
          ]}>
          <Feather
            name="minus"
            size={14}
            color={decDisabled ? lightColors.textMuted : lightColors.textPrimary}
          />
        </Pressable>
        <TextInput
          {...rest}
          value={value === null || Number.isNaN(value) ? '' : String(value)}
          onChangeText={(text) => {
            const parsed = text === '' ? null : Number(text);
            if (parsed === null || !Number.isNaN(parsed)) {
              onChange(parsed);
            }
          }}
          keyboardType="number-pad"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={styles.input}
          placeholderTextColor={lightColors.textMuted}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Increment"
          disabled={incDisabled}
          onPress={inc}
          style={({ pressed }) => [
            styles.stepButton,
            pressed && !incDisabled && styles.stepButtonPressed,
            incDisabled && styles.stepButtonDisabled,
          ]}>
          <Feather
            name="plus"
            size={14}
            color={incDisabled ? lightColors.textMuted : lightColors.textPrimary}
          />
        </Pressable>
      </View>
      {error ? (
        <Text variant="caption" tone="danger">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" tone="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const FIELD_HEIGHT = 40;
const STEP_WIDTH = 40;

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing[1],
  },
  label: {
    fontWeight: '500',
    color: lightColors.textMuted,
  },
  labelActive: {
    color: lightColors.brand,
  },
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: FIELD_HEIGHT,
    backgroundColor: lightColors.surfacePrimary,
    borderColor: lightColors.border,
    borderWidth: borders.hair,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  fieldWrapFocused: {
    borderColor: lightColors.brand,
    borderWidth: borders.thin,
  },
  fieldWrapError: {
    borderColor: lightColors.danger,
    borderWidth: borders.thin,
  },
  stepButton: {
    width: STEP_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  stepButtonDisabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing[3],
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    color: lightColors.textPrimary,
    textAlign: 'center',
    borderStartWidth: borders.hair,
    borderEndWidth: borders.hair,
    borderColor: lightColors.border,
  },
});
