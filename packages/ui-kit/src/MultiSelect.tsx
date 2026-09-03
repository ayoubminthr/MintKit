/**
 * MultiSelect — searchable multi-select for long lists.
 * Mobile adaptation of the web kit's MultiSelect.
 *
 * Opens a sheet (via the SheetProvider host) with a searchable list of options
 * with checkboxes. Selection commits live on each toggle.
 *
 * Usage:
 *   <MultiSelect
 *     values={selectedIds}
 *     onChange={setSelectedIds}
 *     options={[{ label: 'Option 1', value: '1' }]}
 *     placeholder="Select options"
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Checkbox } from './Checkbox';
import { Input } from './Input';
import { type SheetBodyProps, useSheet } from './SheetHost';
import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize } from './tokens/typography';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  disabled?: boolean;
}

export interface MultiSelectProps {
  values?: string[];
  defaultValues?: string[];
  onChange?: (values: string[]) => void;

  options: MultiSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;

  summaryLabel?: (count: number) => string;

  allowSelectAll?: boolean;
  allowCreate?: boolean;
  onCreate?: (newValue: string) => void;

  maxSelections?: number;

  /** Render selected values as removable chips on the trigger instead of a "N selected" summary. */
  chips?: boolean;

  required?: boolean;
  error?: string;
  disabled?: boolean;
}

// ─── Sheet body ───────────────────────────────────────────────────────────────

interface MultiSelectSheetParams {
  options: MultiSelectOption[];
  initialValues: string[];
  onValuesChange: (next: string[]) => void;
  searchPlaceholder: string;
  emptyMessage: string;
  placeholder: string;
  allowSelectAll: boolean;
  allowCreate: boolean;
  onCreate?: (newValue: string) => void;
  maxSelections?: number;
}

function MultiSelectSheetBody({
  params,
  handleClose = () => {},
}: SheetBodyProps<MultiSelectSheetParams>) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [currentValues, setCurrentValues] = useState<string[]>(params.initialValues);

  const dynamicStyles = useMemo(
    () => ({
      titleWrap: { borderBottomColor: colors.border },
      searchWrap: { borderBottomColor: colors.border },
      optionPressed: { backgroundColor: colors.surfaceSubtle },
      optionSelected: { backgroundColor: colors.brandSubtle },
      onBrandSubtle: isDark ? palette.brand[100] : colors.brand,
      selectAllBorder: { borderBottomColor: colors.border },
      footer: { borderTopColor: colors.border },
    }),
    [colors, isDark]
  );

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

  const availableOptions = params.options.filter((o) => !o.disabled);
  const allSelected =
    availableOptions.length > 0 && currentValues.length === availableOptions.length;
  const someSelected = currentValues.length > 0 && !allSelected;
  const reachedMax = params.maxSelections != null && currentValues.length >= params.maxSelections;

  function commit(next: string[]) {
    setCurrentValues(next);
    params.onValuesChange(next);
  }

  function toggleValue(val: string) {
    if (currentValues.includes(val)) {
      commit(currentValues.filter((v) => v !== val));
    } else {
      if (params.maxSelections != null && currentValues.length >= params.maxSelections) return;
      commit([...currentValues, val]);
    }
  }

  function toggleAll() {
    if (allSelected) {
      commit([]);
    } else {
      const available = availableOptions.map((o) => o.value);
      if (params.maxSelections != null) {
        commit(available.slice(0, params.maxSelections));
      } else {
        commit(available);
      }
    }
  }

  function handleCreate() {
    const val = search.trim();
    if (!val) return;
    params.onCreate?.(val);
    if (!currentValues.includes(val)) {
      commit([...currentValues, val]);
    }
    setSearch('');
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
        {params.allowSelectAll && !search ? (
          <Pressable
            onPress={toggleAll}
            style={({ pressed }) => [
              styles.option,
              pressed && dynamicStyles.optionPressed,
              styles.selectAllBorder,
              dynamicStyles.selectAllBorder,
            ]}>
            <Checkbox
              checked={allSelected ? true : someSelected ? 'indeterminate' : false}
              onChange={toggleAll}
            />
            <Text variant="body" style={{ marginStart: spacing[3], fontWeight: '500' }}>
              {allSelected ? 'Deselect all' : 'Select all'}
            </Text>
          </Pressable>
        ) : null}

        {filteredOptions.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text variant="body" tone="muted">
              {params.emptyMessage}
            </Text>
          </View>
        ) : (
          filteredOptions.map((item) => {
            const isSelected = currentValues.includes(item.value);
            const isDisabled = item.disabled || (reachedMax && !isSelected);

            return (
              <Pressable
                key={item.value}
                disabled={isDisabled}
                onPress={() => toggleValue(item.value)}
                android_ripple={{ color: colors.surfaceSubtle }}
                style={({ pressed }) => [
                  styles.option,
                  pressed && dynamicStyles.optionPressed,
                  isSelected && dynamicStyles.optionSelected,
                  isDisabled && styles.optionDisabled,
                ]}>
                <Checkbox
                  checked={isSelected}
                  onChange={() => toggleValue(item.value)}
                  disabled={isDisabled}
                />
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
                    <Text
                      variant="body"
                      tone="primary"
                      color={isSelected ? dynamicStyles.onBrandSubtle : undefined}>
                      {item.label}
                    </Text>
                    {item.description ? (
                      <Text variant="caption" tone="secondary">
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                </View>
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
              { borderTopWidth: borders.hair, borderTopColor: colors.border },
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

      {(currentValues.length > 0 || params.maxSelections != null) && (
        <View style={[styles.footer, dynamicStyles.footer]}>
          <Text variant="caption" tone="secondary">
            {params.maxSelections != null
              ? `${currentValues.length} of ${params.maxSelections} selected`
              : `${currentValues.length} selected`}
          </Text>
          <Pressable onPress={() => commit([])} hitSlop={8}>
            <Text variant="caption" tone="primary" style={{ fontWeight: '500' }}>
              Clear all
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MultiSelect({
  values,
  defaultValues = [],
  onChange,
  options,
  placeholder = 'Select options',
  searchPlaceholder = 'Search…',
  emptyMessage = 'No options found',
  summaryLabel = (n) => `${n} selected`,
  allowSelectAll = false,
  allowCreate = false,
  onCreate,
  maxSelections,
  chips = false,
  required,
  error,
  disabled,
}: MultiSelectProps) {
  const { colors } = useTheme();
  const sheet = useSheet();
  const [internalValues, setInternalValues] = useState<string[]>(defaultValues);
  const [isOpen, setIsOpen] = useState(false);
  const sheetIdRef = useRef<string | null>(null);

  const dynamicStyles = useMemo(
    () => ({
      chipsTrigger: { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
      chip: { backgroundColor: colors.brandSubtle },
      trigger: { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
      triggerActive: { borderColor: colors.brand },
      triggerDisabled: { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
      triggerError: { borderColor: colors.danger },
    }),
    [colors]
  );

  useEffect(() => {
    if (!sheetIdRef.current) return;
    const stillOpen = sheet.opened.some((s) => s.id === sheetIdRef.current);
    if (!stillOpen) {
      sheetIdRef.current = null;
      setIsOpen(false);
    }
  }, [sheet.opened]);

  const currentValues = values !== undefined ? values : internalValues;

  function commitValues(next: string[]) {
    if (values === undefined) setInternalValues(next);
    onChange?.(next);
  }

  function removeValue(val: string) {
    commitValues(currentValues.filter((v) => v !== val));
  }

  function handleOpen() {
    const handle = sheet.open<MultiSelectSheetParams>({
      isScrollable: true,
      body: MultiSelectSheetBody,
      params: {
        options,
        initialValues: currentValues,
        onValuesChange: commitValues,
        searchPlaceholder,
        emptyMessage,
        placeholder,
        allowSelectAll,
        allowCreate,
        onCreate,
        maxSelections,
      },
    });
    sheetIdRef.current = handle.id;
    setIsOpen(true);
  }

  const triggerText =
    currentValues.length === 0 ? placeholder : summaryLabel(currentValues.length);

  if (chips) {
    return (
      <Pressable
        accessibilityRole="combobox"
        accessibilityState={{ expanded: false, disabled }}
        disabled={disabled}
        onPress={handleOpen}
        style={[
          styles.chipsTrigger,
          dynamicStyles.chipsTrigger,
          isOpen && styles.triggerActive,
          isOpen && dynamicStyles.triggerActive,
          disabled && dynamicStyles.triggerDisabled,
          error ? styles.triggerError : null,
          error ? dynamicStyles.triggerError : null,
        ]}>
        {currentValues.length === 0 ? (
          <Text scaled={false} tone="muted" style={styles.chipsPlaceholder}>
            {placeholder}
          </Text>
        ) : (
          <View style={styles.chipsWrap}>
            {currentValues.map((val) => {
              const option = options.find((o) => o.value === val);
              if (!option) return null;
              return (
                <View key={val} style={[styles.chip, dynamicStyles.chip]}>
                  <Text variant="caption" numberOfLines={1} style={styles.chipText}>
                    {option.label}
                  </Text>
                  {disabled ? null : (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${option.label}`}
                      hitSlop={6}
                      onPress={() => removeValue(val)}>
                      <Feather name="x" size={12} color={colors.textSecondary} />
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>
        )}
        <Feather
          name="chevron-down"
          size={16}
          color={disabled ? colors.textMuted : colors.textSecondary}
          style={styles.chipsChevron}
        />
      </Pressable>
    );
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
        isOpen && styles.triggerActive,
        isOpen && dynamicStyles.triggerActive,
        disabled && dynamicStyles.triggerDisabled,
        error ? styles.triggerError : null,
        error ? dynamicStyles.triggerError : null,
      ]}>
      <Text
        scaled={false}
        tone={currentValues.length > 0 ? (disabled ? 'muted' : 'primary') : 'muted'}
        numberOfLines={1}
        style={styles.value}>
        {triggerText}
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
  chipsTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
    borderWidth: borders.hair,
    gap: spacing[2],
  },
  chipsPlaceholder: {
    flex: 1,
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
  },
  chipsWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
  },
  chipsChevron: {
    marginTop: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 160,
    gap: spacing[1],
    paddingStart: spacing[2],
    paddingEnd: spacing[1],
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  chipText: {
    flexShrink: 1,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: spacing[3],
    borderRadius: radius.md,
    borderWidth: borders.hair,
  },
  triggerActive: {
    borderWidth: borders.thin,
  },
  triggerError: {
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
    marginStart: spacing[3],
  },
  selectAllBorder: {
    borderBottomWidth: borders.hair,
    marginBottom: spacing[1],
  },
  // Mirrors `Input`'s TextInput — see the note in Select.tsx.
  value: {
    flex: 1,
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: borders.hair,
  },
});
