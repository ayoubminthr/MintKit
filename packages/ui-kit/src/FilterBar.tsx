import { Feather } from '@expo/vector-icons';
import { useMemo, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ViewProps } from 'react-native';

import { SearchBar } from './SearchBar';
import { Tag } from './Tag';
import { palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { Text } from './Text';
import { useTheme } from './Theme';

export interface ActiveFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

export interface FilterBarSearch {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Accessibility label for the field's clear button. Override to localise. */
  clearLabel?: string;
}

export interface FilterBarProps extends ViewProps {
  /** Inline free-text search field at the start of the bar. */
  search?: FilterBarSearch;
  /** Filter chips currently applied. Each renders as a removable Tag. */
  filters: readonly ActiveFilter[];
  onClearAll?: () => void;
  /** Slot for trigger buttons that open filter pickers (e.g. a sort menu). */
  trigger?: ReactNode;
  /** Tap to open the main filter picker — typically a BottomSheet of options. */
  onAdd?: () => void;
  /** Result count, rendered as a bare number inside the search field. */
  count?: number | string;
  /** Noun for the count's accessibility label ("128 results"). Never rendered. */
  countLabel?: string;
  /** Text + a11y label for the filter trigger. Override to localise. */
  filterLabel?: string;
  /** Text for the reset action. Override to localise. */
  clearAllLabel?: string;
}

export function FilterBar({
  search,
  filters,
  onClearAll,
  trigger,
  onAdd,
  count,
  countLabel,
  filterLabel = 'Filter',
  clearAllLabel = 'Clear all',
  style,
  ...rest
}: FilterBarProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const hasFilters = filters.length > 0;
  const hasCount = count !== undefined && count !== null && count !== '';

  const dynamicStyles = useMemo(
    () => ({
      addButtonActive: { backgroundColor: colors.brandSubtle },
      addButtonPressed: { backgroundColor: colors.surfaceSubtle },
      addIconActive: isDark ? palette.brand[100] : colors.brand,
    }),
    [colors, isDark]
  );

  const countNode = hasCount ? (
    <Text
      variant="caption"
      tone="secondary"
      style={styles.count}
      accessibilityLabel={countLabel ? `${count} ${countLabel}` : String(count)}>
      {String(count)}
    </Text>
  ) : null;

  return (
    <View {...rest} style={[styles.container, style]}>
      <View style={styles.row}>
        {search ? (
          // SearchBar's own root has no flex, and RN defaults flexShrink to 0 —
          // without this wrapper it refuses to yield width to the count and
          // triggers and the row overflows the screen.
          <View style={styles.searchWrap}>
            <SearchBar
              value={search.value}
              onChangeText={search.onChange}
              placeholder={search.placeholder}
              clearAccessibilityLabel={search.clearLabel}
              trailing={countNode}
            />
          </View>
        ) : (
          <>
            {countNode}
            <View style={styles.spacer} />
          </>
        )}

        {onAdd ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={filterLabel}
            onPress={onAdd}
            style={({ pressed }) => [
              styles.addButton,
              search ? styles.addButtonIconOnly : styles.addButtonWithLabel,
              hasFilters && dynamicStyles.addButtonActive,
              pressed && dynamicStyles.addButtonPressed,
            ]}>
            <Feather
              name="filter"
              size={15}
              color={hasFilters ? dynamicStyles.addIconActive : colors.textMuted}
            />
            {search ? null : (
              <Text variant="caption" style={styles.addLabel} numberOfLines={1}>
                {filterLabel}
              </Text>
            )}
          </Pressable>
        ) : null}
        {trigger ? <View style={styles.triggerWrap}>{trigger}</View> : null}
      </View>

      {hasFilters ? (
        <View style={styles.chipsRow}>
          <View style={styles.chipsScrollWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}>
              {filters.map((f) => (
                <Tag key={f.key} label={f.label} variant="brand" onRemove={f.onRemove} />
              ))}
            </ScrollView>
          </View>
          {onClearAll ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={clearAllLabel}
              onPress={onClearAll}
              hitSlop={6}
              style={styles.clearButton}>
              <Text variant="caption" tone="brand" style={styles.clearLabel}>
                {clearAllLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const TRIGGER_SIZE = 28;

const styles = StyleSheet.create({
  container: {
    // Intentionally unstyled: the bar is a flat layout, not a surface. The
    // SearchBar pill carries the only border so the bar never reads as a
    // box-inside-a-box on top of a page background.
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  // flex + minWidth:0 is what lets the field give up width instead of
  // pushing the triggers off-screen.
  searchWrap: {
    flex: 1,
    minWidth: 0,
  },
  count: {
    fontWeight: '500',
    flexShrink: 0,
    fontVariant: ['tabular-nums'],
    paddingStart: spacing[1],
  },
  spacer: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    height: TRIGGER_SIZE,
    borderRadius: radius.md,
    flexShrink: 0,
  },
  triggerWrap: {
    flexShrink: 0,
  },
  addButtonIconOnly: {
    width: TRIGGER_SIZE,
  },
  addButtonWithLabel: {
    paddingHorizontal: spacing[2],
  },
  addLabel: {
    fontWeight: '500',
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  chipsScrollWrap: {
    flex: 1,
    minWidth: 0,
    overflow: 'visible',
  },
  filtersScroll: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingVertical: 2,
  },
  clearButton: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    marginStart: spacing[1],
    flexShrink: 0,
  },
  clearLabel: {
    fontWeight: '500',
  },
});
