import { Feather } from '@expo/vector-icons';
import { useMemo, type ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ViewProps } from 'react-native';

import { borders } from './tokens/borders';
import { spacing } from './tokens/spacing';
import { Text } from './Text';
import { useTheme } from './Theme';

export interface TabOption<T extends string = string> {
  value: T;
  /** Optional when `icon` is set, so a tab can be icon-only. */
  label?: string;
  /** Feather icon name, rendered before the label and tinted to match it. */
  icon?: ComponentProps<typeof Feather>['name'];
  /** Dims the tab and blocks selection. */
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> extends ViewProps {
  options: readonly TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Wrap many tabs into a horizontal scroller. Defaults to true. Ignored when `fullWidth` is set. */
  scrollable?: boolean;
  /** Stretch tabs to fill the available width, evenly spaced and centered. Disables scrolling. */
  fullWidth?: boolean;
}

export function Tabs<T extends string = string>({
  options,
  value,
  onChange,
  scrollable = true,
  fullWidth = false,
  style,
  ...rest
}: TabsProps<T>) {
  const { colors } = useTheme();

  const dynamicStyles = useMemo(
    () => ({
      baseline: { backgroundColor: colors.border },
      tabSelected: { borderBottomColor: colors.brand },
    }),
    [colors]
  );

  const inner = (
    <View style={[styles.row, fullWidth && styles.rowFullWidth]}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled: opt.disabled }}
            disabled={opt.disabled}
            onPress={() => onChange(opt.value)}
            style={[
              styles.tab,
              fullWidth && styles.tabFullWidth,
              selected && dynamicStyles.tabSelected,
              opt.disabled && styles.tabDisabled,
            ]}>
            <View style={styles.tabInner}>
              {opt.icon ? (
                <Feather
                  name={opt.icon}
                  size={16}
                  color={selected ? colors.textPrimary : colors.textSecondary}
                />
              ) : null}
              {opt.label ? (
                <Text
                  variant="body"
                  tone={selected ? 'primary' : 'secondary'}
                  style={[fullWidth && styles.labelCentered, selected && styles.labelSelected]}>
                  {opt.label}
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View {...rest} style={[styles.container, style]}>
      {scrollable && !fullWidth ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
      <View style={[styles.baseline, dynamicStyles.baseline]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  rowFullWidth: {
    width: '100%',
  },
  baseline: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    height: borders.hair,
  },
  tab: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabFullWidth: {
    flex: 1,
    alignItems: 'center',
  },
  tabDisabled: {
    opacity: 0.5,
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  labelCentered: {
    textAlign: 'center',
  },
  labelSelected: {
    fontWeight: '500',
  },
});
