import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { spacing } from './tokens/spacing';
import { Text } from './Text';
import { useTheme } from './Theme';

export interface FormFieldProps extends ViewProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

/**
 * Wraps any kit control (Switch, Checkbox, Radio, custom Pressable rows, …)
 * with the same label + helper/error layout used by `Input` / `Textarea`.
 *
 * Use `Input` / `Textarea` directly when you only need a text field — they
 * already implement this layout internally. Use `FormField` only when you
 * need a labelled wrapper around a non-text control.
 */
export function FormField({
  label,
  hint,
  error,
  required,
  children,
  style,
  ...rest
}: FormFieldProps) {
  const { colors } = useTheme();

  return (
    <View {...rest} style={[styles.wrapper, style]}>
      {label ? (
        <View style={styles.labelRow}>
          <Text variant="caption" color={colors.textMuted} style={styles.label}>
            {label}
          </Text>
          {required ? (
            <Text variant="caption" tone="danger">
              required
            </Text>
          ) : null}
        </View>
      ) : null}
      {children}
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

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing[1],
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: '500',
  },
});
