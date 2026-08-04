/**
 * SearchBar — mobile search input with magnifier, clear, and optional Cancel.
 *
 * Usage:
 *   <SearchBar value={q} onChangeText={setQ} placeholder="Search people" />
 *   <SearchBar value={q} onChangeText={setQ} showCancel onCancel={handleCancel} />
 */
import { Feather } from '@expo/vector-icons';
import { useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  Pressable,
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
import { fontFamily, fontSize, fontWeight } from './tokens/typography';
import { isRTL } from './utils/rtl';

export interface SearchBarProps
  extends Omit<TextInputProps, 'style' | 'placeholderTextColor'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** When true, a Cancel button slides in while the input is focused. */
  showCancel?: boolean;
  cancelLabel?: string;
  /** Fires when the user taps Cancel. Defaults to clearing + blurring. */
  onCancel?: () => void;
  disabled?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  showCancel = false,
  cancelLabel = 'Cancel',
  onCancel,
  disabled,
  onFocus,
  onBlur,
  ...rest
}: SearchBarProps) {
  const { colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      fieldWrap: { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
      fieldWrapFocused: { borderColor: colors.brand, backgroundColor: colors.surfacePrimary },
      input: { color: colors.textPrimary },
    }),
    [colors],
  );
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const showCancelButton = showCancel && (focused || value.length > 0);

  function handleCancel() {
    if (onCancel) {
      onCancel();
      return;
    }
    onChangeText('');
    inputRef.current?.blur();
    Keyboard.dismiss();
  }

  function handleClear() {
    onChangeText('');
    inputRef.current?.focus();
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.fieldWrap,
          dynamicStyles.fieldWrap,
          focused && [styles.fieldWrapFocused, dynamicStyles.fieldWrapFocused],
          disabled && styles.fieldWrapDisabled,
        ]}>
        <View style={styles.iconStart}>
          <Feather name="search" size={16} color={colors.textMuted} />
        </View>
        <TextInput
          {...rest}
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          editable={!disabled}
          returnKeyType="search"
          clearButtonMode="never"
          autoCorrect={false}
          autoCapitalize="none"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, dynamicStyles.input, { textAlign: isRTL() ? 'right' : 'left' }]}
        />
        {value.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={handleClear}
            hitSlop={6}
            style={styles.iconEnd}>
            <Feather name="x-circle" size={16} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {showCancelButton ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
          onPress={handleCancel}
          hitSlop={8}
          style={styles.cancelButton}>
          <Text variant="body" tone="brand" style={styles.cancelLabel}>
            {cancelLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const FIELD_HEIGHT = 36;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  fieldWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borders.hair,
    borderRadius: radius.lg,
    height: FIELD_HEIGHT,
    paddingHorizontal: spacing[2],
  },
  fieldWrapFocused: {
    borderWidth: borders.thin,
  },
  fieldWrapDisabled: {
    opacity: 0.5,
  },
  iconStart: {
    paddingEnd: spacing[2],
    paddingStart: spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEnd: {
    paddingStart: spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    padding: 0,
  },
  cancelButton: {
    paddingHorizontal: spacing[1],
    paddingVertical: spacing[1],
  },
  cancelLabel: {
    fontWeight: '500',
  },
});
