/**
 * Combobox — searchable single-select for long lists.
 * Mobile adaptation of the web kit's Combobox.
 *
 * Opens a sheet (via the SheetProvider host) with a searchable list of options.
 *
 * Usage:
 *   <Combobox
 *     value={selectedId}
 *     onChange={setSelectedId}
 *     options={[{ label: 'Option 1', value: '1' }]}
 *     placeholder="Select an option"
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Input } from './Input';
import { type SheetBodyProps, useSheet } from './SheetHost';
import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontSize } from './tokens/typography';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  disabled?: boolean;
  group?: string;
}

export interface ComboboxProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;

  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;

  allowCreate?: boolean;
  onCreate?: (newValue: string) => void;

  required?: boolean;
  error?: string;
  disabled?: boolean;
}

// ─── Sheet body ───────────────────────────────────────────────────────────────

interface ComboboxSheetParams {
  options: ComboboxOption[];
  currentValue: string;
  onSelect: (value: string) => void;
  searchPlaceholder: string;
  emptyMessage: string;
  allowCreate: boolean;
  onCreate?: (newValue: string) => void;
  placeholder: string;
}

function ComboboxSheetBody({
  params,
  handleClose = () => {},
}: SheetBodyProps<ComboboxSheetParams>) {
  const { colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      titleWrap: { borderBottomColor: colors.border },
      searchWrap: { borderBottomColor: colors.border },
      optionPressed: { backgroundColor: colors.surfaceSubtle },
      optionSelected: { backgroundColor: colors.brandSubtle },
    }),
    [colors],
  );

  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    if (!search) return params.options;
    const q = search.toLowerCase();
    return params.options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.description?.toLowerCase().includes(q) ?? false),
    );
  }, [params.options, search]);

  const exactMatch = params.options.some(
    (o) => o.label.toLowerCase() === search.trim().toLowerCase(),
  );
  const showCreate = params.allowCreate && search.trim().length > 0 && !exactMatch;

  function handleSelect(val: string) {
    params.onSelect(val);
    handleClose();
  }

  function handleCreate() {
    const val = search.trim();
    if (!val) return;
    params.onCreate?.(val);
    params.onSelect(val);
    handleClose();
  }

  return (
    <View style={styles.sheetContent}>
      <View style={[styles.titleWrap, dynamicStyles.titleWrap]}>
        <Text variant="subtitle">{params.placeholder}</Text>
      </View>
      <View style={[styles.searchWrap, dynamicStyles.searchWrap]}>
        <Input
          placeholder={params.searchPlaceholder}
          value={search}
          onChangeText={setSearch}
          autoFocus
          leftIcon={<Feather name="search" size={16} color={colors.textSecondary} />}
        />
      </View>

      <View style={styles.list}>
        {filteredOptions.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text variant="body" tone="muted">
              {params.emptyMessage}
            </Text>
          </View>
        ) : (
          filteredOptions.map((item) => {
            const isSelected = item.value === params.currentValue;
            return (
              <Pressable
                key={item.value}
                disabled={item.disabled}
                onPress={() => handleSelect(item.value)}
                android_ripple={{ color: colors.surfaceSubtle }}
                style={({ pressed }) => [
                  styles.option,
                  pressed && dynamicStyles.optionPressed,
                  isSelected && dynamicStyles.optionSelected,
                  item.disabled && styles.optionDisabled,
                ]}>
                <View style={styles.optionBody}>
                  {item.icon ? (
                    <Feather
                      name={item.icon}
                      size={16}
                      color={colors.textSecondary}
                      style={{ marginEnd: spacing[2] }}
                    />
                  ) : null}
                  <View style={{ flex: 1 }}>
                    <Text variant="body" tone={isSelected ? 'brand' : 'primary'}>
                      {item.label}
                    </Text>
                    {item.description ? (
                      <Text variant="caption" tone="secondary">
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                </View>
                {isSelected ? (
                  <Feather name="check" size={16} color={colors.brand} />
                ) : null}
              </Pressable>
            );
          })
        )}

        {showCreate ? (
          <Pressable
            onPress={handleCreate}
            style={({ pressed }) => [
              styles.option,
              pressed && dynamicStyles.optionPressed,
            ]}>
            <Feather
              name="plus"
              size={16}
              color={colors.brand}
              style={{ marginEnd: spacing[2] }}
            />
            <Text variant="body" tone="brand">
              Create &quot;{search.trim()}&quot;
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Combobox({
  value,
  defaultValue,
  onChange,
  options,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search…',
  emptyMessage = 'No options found',
  allowCreate = false,
  onCreate,
  required,
  error,
  disabled,
}: ComboboxProps) {
  const { colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      trigger: { backgroundColor: colors.surfacePrimary, borderColor: colors.borderStrong },
      triggerDisabled: { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
      triggerError: { borderColor: colors.danger },
    }),
    [colors],
  );

  const sheet = useSheet();
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');

  const currentValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((o) => o.value === currentValue);

  function handleOpen() {
    sheet.open<ComboboxSheetParams>({
      isScrollable: true,
      body: ComboboxSheetBody,
      params: {
        options,
        currentValue,
        onSelect: (val: string) => {
          if (value === undefined) setInternalValue(val);
          onChange?.(val);
        },
        searchPlaceholder,
        emptyMessage,
        allowCreate,
        onCreate,
        placeholder,
      },
    });
  }

  return (
    <Pressable
      accessibilityRole="combobox"
      accessibilityState={{ expanded: false, disabled }}
      disabled={disabled}
      onPress={handleOpen}
      style={[
        styles.trigger,
        dynamicStyles.trigger,
        disabled && dynamicStyles.triggerDisabled,
        error ? dynamicStyles.triggerError : null,
      ]}>
      <Text
        variant="body"
        tone={selectedOption ? (disabled ? 'muted' : 'primary') : 'muted'}
        numberOfLines={1}
        style={selectedOption ? styles.value : [styles.value, styles.placeholderText]}>
        {selectedOption ? selectedOption.label : placeholder}
      </Text>
      <Feather
        name="chevron-down"
        size={16}
        color={disabled ? colors.textMuted : colors.textSecondary}
      />
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: spacing[3],
    borderRadius: radius.md,
    borderWidth: borders.thin,
  },
  sheetContent: {
    flex: 1,
  },
  titleWrap: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    borderBottomWidth: borders.hair,
  },
  searchWrap: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: borders.hair,
  },
  list: {
    paddingVertical: spacing[2],
  },
  emptyWrap: {
    paddingVertical: spacing[8],
    alignItems: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionBody: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  value: {
    flex: 1,
  },
  placeholderText: {
    fontSize: fontSize.sm,
  },
});
