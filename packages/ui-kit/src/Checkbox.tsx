import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

export type CheckboxState = 'checked' | 'unchecked' | 'indeterminate';

export interface CheckboxProps {
  checked: boolean | 'indeterminate';
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}

const BOX_SIZE = 18;

export function Checkbox({ checked, onChange, disabled, label, description }: CheckboxProps) {
  const { colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      boxEmpty: { backgroundColor: colors.surfacePrimary, borderColor: colors.borderStrong },
      boxFilled: { backgroundColor: colors.brand, borderColor: colors.brand },
    }),
    [colors],
  );

  const state: CheckboxState =
    checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked';
  const filled = state !== 'unchecked';

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: state === 'indeterminate' ? 'mixed' : state === 'checked', disabled }}
      onPress={() => {
        if (disabled) return;
        onChange(state === 'checked' ? false : true);
      }}
      style={[styles.row, disabled && styles.rowDisabled]}>
      <View
        style={[
          styles.box,
          filled ? dynamicStyles.boxFilled : dynamicStyles.boxEmpty,
        ]}>
        {state === 'checked' ? (
          <Feather name="check" size={14} color={colors.onBrand} />
        ) : state === 'indeterminate' ? (
          <Feather name="minus" size={14} color={colors.onBrand} />
        ) : null}
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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  rowDisabled: {
    opacity: 0.5,
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    borderWidth: borders.thin,
  },
  textBlock: {
    flexShrink: 1,
    gap: 2,
  },
});
