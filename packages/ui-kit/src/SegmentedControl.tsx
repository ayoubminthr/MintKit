import { Feather } from '@expo/vector-icons';
import { useMemo, type ComponentProps } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

export interface SegmentedOption<T extends string = string> {
  value: T;
  /** Optional when `icon` is set, so a segment can be icon-only. */
  label?: string;
  /** Feather icon name, rendered before the label and tinted to match it. */
  icon?: ComponentProps<typeof Feather>['name'];
  /** Dims the segment and blocks selection. */
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> extends ViewProps {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  disabled,
  fullWidth = true,
  style,
  ...rest
}: SegmentedControlProps<T>) {
  const { colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      track: { backgroundColor: colors.surfaceSubtle },
      segmentSelected: { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
    }),
    [colors],
  );

  return (
    <View
      {...rest}
      style={[styles.track, dynamicStyles.track, fullWidth && styles.fullWidth, disabled && styles.disabled, style]}>
      {options.map((opt) => {
        const selected = opt.value === value;
        const segmentDisabled = disabled || opt.disabled;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="button"
            accessibilityState={{ selected, disabled: segmentDisabled }}
            disabled={segmentDisabled}
            onPress={() => onChange(opt.value)}
            style={[
              styles.segment,
              fullWidth && styles.segmentFlex,
              selected && styles.segmentSelected,
              selected && dynamicStyles.segmentSelected,
              !disabled && opt.disabled && styles.disabled,
            ]}>
            <View style={styles.segmentInner}>
              {opt.icon ? (
                <Feather
                  name={opt.icon}
                  size={14}
                  color={selected ? colors.textPrimary : colors.textSecondary}
                />
              ) : null}
              {opt.label ? (
                <Text
                  variant="caption"
                  tone={selected ? 'primary' : 'secondary'}
                  style={selected ? styles.labelSelected : undefined}>
                  {opt.label}
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: radius.md,
    padding: 2,
    gap: 2,
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.5,
  },
  segment: {
    paddingVertical: spacing[1] + 2,
    paddingHorizontal: spacing[3],
    borderRadius: radius.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentFlex: {
    flex: 1,
  },
  segmentInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  segmentSelected: {
    borderWidth: borders.hair,
  },
  labelSelected: {
    fontWeight: '500',
  },
});
