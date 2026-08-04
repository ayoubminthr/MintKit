import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { spacing } from './tokens/spacing';

const RING_SIZE = 18;
const DOT_SIZE = 8;

interface RadioGroupContextValue {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  direction?: 'vertical' | 'horizontal';
  children: ReactNode;
}

export function RadioGroup({
  value,
  onChange,
  disabled,
  direction = 'vertical',
  children,
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onChange, disabled }}>
      <View
        style={[
          styles.group,
          direction === 'horizontal' ? styles.groupHorizontal : styles.groupVertical,
        ]}>
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

export interface RadioProps {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Radio({ value, label, description, disabled: localDisabled }: RadioProps) {
  const { colors } = useTheme();
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error('Radio must be used inside a RadioGroup.');
  }
  const selected = ctx.value === value;
  const disabled = localDisabled || ctx.disabled;

  const dynamicStyles = useMemo(
    () => ({
      ringEmpty: { backgroundColor: colors.surfacePrimary, borderColor: colors.borderStrong },
      ringSelected: { backgroundColor: colors.surfacePrimary, borderColor: colors.brand },
      dot: { backgroundColor: colors.brand },
    }),
    [colors],
  );

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      onPress={() => {
        if (disabled) return;
        ctx.onChange(value);
      }}
      style={[styles.row, disabled && styles.rowDisabled]}>
      <View
        style={[
          styles.ring,
          selected ? styles.ringSelected : styles.ringEmpty,
          selected ? dynamicStyles.ringSelected : dynamicStyles.ringEmpty,
        ]}>
        {selected ? <View style={[styles.dot, dynamicStyles.dot]} /> : null}
      </View>
      {label || description ? (
        <View style={styles.textBlock}>
          {label ? <Text variant="body">{label}</Text> : null}
          {description ? (
            <Text variant="caption" tone="muted">
              {description}
            </Text>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing[3],
  },
  groupVertical: {
    flexDirection: 'column',
  },
  groupHorizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  rowDisabled: {
    opacity: 0.5,
  },
  ring: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  ringEmpty: {
    borderWidth: borders.thin,
  },
  ringSelected: {
    borderWidth: borders.thin,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  textBlock: {
    flexShrink: 1,
    gap: 2,
  },
});
