import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Avatar, type AvatarSize } from './Avatar';
import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { spacing } from './tokens/spacing';
import { fontFamily, fontWeight } from './tokens/typography';

export interface AvatarGroupItem {
  name: string;
  imageUri?: string;
  /**
   * Render this node instead of the kit `Avatar` — for images the consumer has
   * to fetch itself (signed URLs, auth headers). Size it to match `size`.
   */
  avatar?: ReactNode;
}

export interface AvatarGroupProps extends ViewProps {
  items: readonly AvatarGroupItem[];
  size?: AvatarSize;
  /** Cap visible avatars. Remaining are summarized as "+N". Defaults to 4. */
  max?: number;
}

const overlapMap: Record<AvatarSize, number> = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  '2xl': 18,
};

const sizeBoxMap: Record<AvatarSize, number> = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 48,
  '2xl': 64,
};

export function AvatarGroup({ items, size = 'md', max = 4, style, ...rest }: AvatarGroupProps) {
  const { colors } = useTheme();
  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;
  const overlap = overlapMap[size];
  const box = sizeBoxMap[size];

  const themedStyles = useMemo(
    () => ({
      ring: { backgroundColor: colors.surfacePrimary },
      overflow: { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
    }),
    [colors]
  );

  return (
    <View {...rest} style={[styles.container, style]}>
      {visible.map((item, idx) => (
        <View
          key={`${idx}-${item.name}`}
          style={[styles.ringWrap, idx > 0 && { marginStart: -overlap }]}>
          <View style={[styles.ring, themedStyles.ring, { borderRadius: (box + 2) / 2 }]}>
            {item.avatar ?? <Avatar name={item.name} imageUri={item.imageUri} size={size} />}
          </View>
        </View>
      ))}
      {overflow > 0 ? (
        <View
          style={[
            styles.ringWrap,
            { marginStart: -overlap },
          ]}>
          <View
            style={[
              styles.overflow,
              themedStyles.overflow,
              {
                width: box,
                height: box,
                borderRadius: box / 2,
              },
            ]}>
            <Text
              scaled={false}
              color={colors.textSecondary}
              style={[styles.overflowText, { fontSize: Math.max(10, box * 0.32) }]}
              allowFontScaling={false}>
              +{overflow}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ringWrap: {
    // wrap creates a borderless gutter between avatars; the inner ring carries the white halo
  },
  ring: {
    padding: 1,
  },
  overflow: {
    borderWidth: borders.hair,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[1],
  },
  overflowText: {
    fontFamily: fontFamily.sans,
    fontWeight: fontWeight.medium,
  },
});
