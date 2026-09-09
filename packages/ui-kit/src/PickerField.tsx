/**
 * PickerField — the read-only field that fronts a picker.
 *
 * Same bordered box, floating label and chevron as `Select`, but with no
 * opinion about what the tap opens: a remotely-fetched option sheet, a
 * calendar, a range slider. Use it whenever a value is chosen elsewhere and
 * only summarised here; use `Select` / `MultiSelect` / `DatePicker` when the
 * kit already owns the picker itself.
 */
import { Feather } from '@expo/vector-icons';
import { type ReactNode, useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize } from './tokens/typography';

export interface PickerFieldProps {
  /** Summary of the current selection. Empty renders the placeholder. */
  value?: string | null;
  onPress: () => void;
  /** Floating label — rests inside the empty field, floats once a value is set. */
  label?: string;
  placeholder?: string;
  /** Leading slot — a small icon that identifies the field. */
  leading?: ReactNode;
  /**
   * Highlights the field the way an open picker does, for a filter that is
   * currently narrowing results. Defaults to false.
   */
  active?: boolean;
  disabled?: boolean;
  error?: string;
  /** Accessibility label for the tap target. Defaults to `label`. */
  accessibilityLabel?: string;
}

export function PickerField({
  value,
  onPress,
  label,
  placeholder = '',
  leading,
  active = false,
  disabled,
  error,
  accessibilityLabel,
}: PickerFieldProps) {
  const { colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      floatingLabel: { backgroundColor: colors.surfacePrimary },
      field: { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
      fieldActive: { borderColor: colors.brand },
      fieldError: { borderColor: colors.danger },
      fieldPressed: { backgroundColor: colors.surfaceSubtle },
    }),
    [colors],
  );

  const hasValue = !!value;
  const floated = hasValue || active;
  const showFloating = !!label;
  const animRef = useRef(new Animated.Value(floated ? 1 : 0));

  useEffect(() => {
    if (!showFloating) return;
    Animated.timing(animRef.current, {
      toValue: floated ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [showFloating, floated]);

  const field = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      android_ripple={{ color: colors.surfaceSubtle, borderless: false }}
      style={({ pressed }) => [
        styles.field,
        dynamicStyles.field,
        active && styles.fieldActive,
        active && dynamicStyles.fieldActive,
        error ? styles.fieldError : null,
        error ? dynamicStyles.fieldError : null,
        disabled && styles.fieldDisabled,
        pressed && dynamicStyles.fieldPressed,
      ]}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <Text
        scaled={false}
        tone={hasValue ? 'primary' : 'muted'}
        numberOfLines={1}
        style={styles.value}>
        {hasValue ? value : showFloating ? '' : placeholder}
      </Text>
      <Feather name="chevron-down" size={16} color={colors.textSecondary} />
    </Pressable>
  );

  if (!showFloating) return field;

  return (
    <View style={styles.floatingWrapper}>
      <Animated.Text
        style={[
          styles.floatingLabel,
          dynamicStyles.floatingLabel,
          {
            top: animRef.current.interpolate({ inputRange: [0, 1], outputRange: [11, -8] }),
            color: animRef.current.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.textMuted, colors.brand],
            }),
          },
        ]}>
        {label}
      </Animated.Text>
      {field}
      {error ? (
        <Text variant="caption" tone="danger" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    start: 8,
    zIndex: 999,
    paddingHorizontal: 5,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansMedium,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: spacing[3],
    borderWidth: borders.hair,
    borderRadius: radius.md,
    gap: spacing[2],
  },
  fieldActive: {
    borderWidth: borders.thin,
  },
  fieldError: {
    borderWidth: borders.thin,
  },
  fieldDisabled: {
    opacity: 0.5,
  },
  leading: {
    flexShrink: 0,
  },
  // Mirrors `Select`'s value text, which in turn mirrors `Input`'s TextInput,
  // so a summarised selection reads identically to a typed one in a form.
  value: {
    flex: 1,
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
  },
  error: {
    marginTop: spacing[1],
  },
});
