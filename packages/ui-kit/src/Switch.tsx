import { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { palette } from './tokens/colors';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight } from './tokens/typography';
import { rtlSign } from './utils/rtl';
import { Text } from './Text';
import { useTheme } from './Theme';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}

// Control geometry — raw values are allowed for size specs / animation offsets.
const TRACK_WIDTH = 40;
const TRACK_HEIGHT = 23;
const THUMB_SIZE = 16;
const TRACK_PADDING = 3;
// How far the thumb travels from the start edge to the end edge.
const TRAVEL = TRACK_WIDTH - 2 * borders.thin - 2 * TRACK_PADDING - THUMB_SIZE;

export function Switch({ value, onValueChange, disabled, label, description }: SwitchProps) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const dynamicStyles = useMemo(
    () => ({
      track: { borderColor: colors.brandSubtle },
      thumbOn: { backgroundColor: colors.brand },
      thumbOff: { backgroundColor: colors.borderStrong },
    }),
    [colors]
  );

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [anim, value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    // Multiply by rtlSign so the thumb slides toward the logical end edge in RTL.
    outputRange: [0, TRAVEL * rtlSign()],
  });

  const control = (
    <Pressable
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      hitSlop={{ top: 11, bottom: 11, left: 2, right: 2 }}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: !!disabled }}
      accessibilityLabel={label}
      style={[
        styles.track,
        dynamicStyles.track,
        disabled && !label && !description && styles.disabled,
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          { transform: [{ translateX }] },
          value ? dynamicStyles.thumbOn : dynamicStyles.thumbOff,
        ]}
      />
    </Pressable>
  );

  if (!label && !description) {
    return control;
  }

  return (
    <View style={[styles.row, disabled && styles.disabled]}>
      <View style={styles.textBlock}>
        {label ? (
          <Text variant="body" style={styles.label}>
            {label}
          </Text>
        ) : null}
        {description ? (
          <Text variant="caption" tone="muted">
            {description}
          </Text>
        ) : null}
      </View>
      {control}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: radius.full,
    paddingHorizontal: TRACK_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    // gray[100] = the documented "secondary surface" track fill (same token SegmentedControl uses).
    backgroundColor: palette.gray[100],
    borderWidth: borders.thin,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.full,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  disabled: {
    opacity: 0.5,
  },
  textBlock: {
    flexShrink: 1,
    gap: 2,
  },
  label: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
});
