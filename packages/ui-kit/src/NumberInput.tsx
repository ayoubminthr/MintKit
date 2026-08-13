import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { useTheme } from './Theme';
import { borders } from './tokens/borders';
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
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const isActive = focused || value !== null;

  const dynamicStyles = useMemo(
    () => ({
      fieldWrap: { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
      fieldWrapFocused: { borderColor: colors.brand },
      fieldWrapError: { borderColor: colors.danger },
      stepButtonPressed: { backgroundColor: colors.surfaceSubtle },
      input: { color: colors.textPrimary, borderColor: colors.border },
    }),
    [colors]
  );

  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const inc = () => onChange(clamp((value ?? 0) + step));
  const dec = () => onChange(clamp((value ?? 0) - step));

  const incDisabled = value !== null && value >= max;
  const decDisabled = value !== null && value <= min;

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
      <View
        style={[
          styles.fieldWrap,
          dynamicStyles.fieldWrap,
          focused && styles.fieldWrapFocused,
          focused && dynamicStyles.fieldWrapFocused,
          error ? styles.fieldWrapError : null,
          error ? dynamicStyles.fieldWrapError : null,
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Decrement"
          disabled={decDisabled}
          onPress={dec}
          style={({ pressed }) => [
            styles.stepButton,
            pressed && !decDisabled && dynamicStyles.stepButtonPressed,
            decDisabled && styles.stepButtonDisabled,
          ]}>
          <Feather
            name="minus"
            size={14}
            color={decDisabled ? colors.textMuted : colors.textPrimary}
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
          style={[styles.input, dynamicStyles.input]}
          placeholderTextColor={colors.textMuted}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Increment"
          disabled={incDisabled}
          onPress={inc}
          style={({ pressed }) => [
            styles.stepButton,
            pressed && !incDisabled && dynamicStyles.stepButtonPressed,
            incDisabled && styles.stepButtonDisabled,
          ]}>
          <Feather
            name="plus"
            size={14}
            color={incDisabled ? colors.textMuted : colors.textPrimary}
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
  },
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: FIELD_HEIGHT,
    borderWidth: borders.hair,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  fieldWrapFocused: {
    borderWidth: borders.thin,
  },
  fieldWrapError: {
    borderWidth: borders.thin,
  },
  stepButton: {
    width: STEP_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
    borderStartWidth: borders.hair,
    borderEndWidth: borders.hair,
  },
});
