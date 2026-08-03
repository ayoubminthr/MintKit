import { Feather } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { type SheetBodyProps, useSheet } from './SheetHost';
import { Text } from './Text';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize } from './tokens/typography';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
}

export interface SelectProps<T extends string = string> {
  options: readonly SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  /** Sheet title shown when the picker opens. */
  title?: string;
  disabled?: boolean;
  error?: string;
  /**
   * Label that animates like `Input`'s floating label: resting inside the
   * field when empty and closed, floating above the border (brand-colored)
   * once a value is selected or the picker sheet is open. Requires `label`.
   */
  floating?: boolean;
  label?: string;
}

interface SelectSheetParams {
  options: readonly SelectOption<string>[];
  value: string | null;
  onChange: (value: string) => void;
  title?: string;
}

function SelectSheetBody({ params, handleClose = () => {} }: SheetBodyProps<SelectSheetParams>) {
  return (
    <View style={sheetStyles.container}>
      {params.title ? (
        <View style={sheetStyles.titleWrap}>
          <Text variant="subtitle">{params.title}</Text>
        </View>
      ) : null}
      {params.options.map((opt, idx) => {
        const isSelected = opt.value === params.value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="button"
            onPress={() => {
              params.onChange(opt.value);
              handleClose();
            }}
            style={({ pressed }) => [
              sheetStyles.option,
              idx > 0 && sheetStyles.optionDivider,
              pressed && sheetStyles.optionPressed,
            ]}>
            <View style={sheetStyles.optionText}>
              <Text variant="body">{opt.label}</Text>
              {opt.description ? (
                <Text variant="caption" tone="muted">
                  {opt.description}
                </Text>
              ) : null}
            </View>
            {isSelected ? (
              <Feather name="check" size={16} color={lightColors.brand} />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export function Select<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  title = 'Choose',
  disabled,
  error,
  floating,
  label,
}: SelectProps<T>) {
  const sheet = useSheet();
  const selected = options.find((o) => o.value === value);
  const hasValue = !!selected;

  const [isOpen, setIsOpen] = useState(false);
  const sheetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sheetIdRef.current) return;
    const stillOpen = sheet.opened.some((s) => s.id === sheetIdRef.current);
    if (!stillOpen) {
      sheetIdRef.current = null;
      setIsOpen(false);
    }
  }, [sheet.opened]);

  const showFloating = floating && !!label;
  const animRef = useRef(new Animated.Value(hasValue ? 1 : 0));

  useEffect(() => {
    if (!showFloating) return;
    Animated.timing(animRef.current, {
      toValue: hasValue || isOpen ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [showFloating, hasValue, isOpen]);

  function handleOpen() {
    const handle = sheet.open<SelectSheetParams>({
      body: SelectSheetBody,
      params: {
        options: options as readonly SelectOption<string>[],
        value: value as string | null,
        onChange: (v) => onChange(v as T),
        title,
      },
    });
    sheetIdRef.current = handle.id;
    setIsOpen(true);
  }

  const field = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={handleOpen}
      style={({ pressed }) => [
        styles.field,
        isOpen && styles.fieldActive,
        error ? styles.fieldError : null,
        disabled && styles.fieldDisabled,
        pressed && styles.fieldPressed,
      ]}>
      <Text
        variant="body"
        tone={selected ? 'primary' : 'muted'}
        numberOfLines={1}
        style={[styles.value, !selected && styles.placeholderText]}>
        {selected ? selected.label : showFloating ? '' : placeholder}
      </Text>
      <Feather name="chevron-down" size={16} color={lightColors.textSecondary} />
    </Pressable>
  );

  if (!showFloating) return field;

  return (
    <View style={styles.floatingWrapper}>
      <Animated.Text
        style={[
          styles.floatingLabel,
          {
            top: animRef.current.interpolate({ inputRange: [0, 1], outputRange: [11, -8] }),
            color: animRef.current.interpolate({
              inputRange: [0, 1],
              outputRange: [lightColors.textMuted, lightColors.brand],
            }),
          },
        ]}>
        {label}
      </Animated.Text>
      {field}
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
    backgroundColor: lightColors.surfacePrimary,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansMedium,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: spacing[3],
    backgroundColor: lightColors.surfacePrimary,
    borderColor: lightColors.border,
    borderWidth: borders.hair,
    borderRadius: radius.md,
    gap: spacing[2],
  },
  fieldActive: {
    borderColor: lightColors.brand,
    borderWidth: borders.thin,
  },
  fieldError: {
    borderColor: lightColors.danger,
    borderWidth: borders.thin,
  },
  fieldDisabled: {
    opacity: 0.5,
  },
  fieldPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  value: {
    flex: 1,
  },
  placeholderText: {
    fontSize: fontSize.sm,
  },
});

const sheetStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
  },
  titleWrap: {
    paddingVertical: spacing[3],
    borderBottomWidth: borders.hair,
    borderBottomColor: lightColors.border,
    marginBottom: spacing[2],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  optionDivider: {
    borderTopWidth: borders.hair,
    borderTopColor: lightColors.border,
  },
  optionPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
});
