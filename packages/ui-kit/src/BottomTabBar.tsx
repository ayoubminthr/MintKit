/**
 * BottomTabBar — kit-styled bottom navigation bar.
 * Persistent screen chrome. Use as a custom `tabBar` for
 * @react-navigation/bottom-tabs, or wire up manually with local state.
 *
 * Items can be marked `kind: 'primary'` to render a brand-filled circular
 * action that sits inline in the row — typically the center "add" affordance
 * in 5-tab layouts. It reads as the primary action through its brand fill
 * alone; it is not lifted above the bar — no shadow (Rule 1).
 *
 * Usage:
 *   const [active, setActive] = useState<'home' | 'add' | 'profile'>('home');
 *
 *   <BottomTabBar
 *     variant="compact"
 *     active={active}
 *     onChange={setActive}
 *     items={[
 *       { key: 'home', label: 'Home', icon: 'home' },
 *       { key: 'team', label: 'Team', icon: 'users' },
 *       { key: 'add', label: 'Add', icon: 'plus', kind: 'primary' },
 *       { key: 'inbox', label: 'Inbox', icon: 'message-square', badge: 2 },
 *       { key: 'help', label: 'Help', icon: 'help-circle' },
 *     ]}
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from './Text';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontSize, fontWeight } from './tokens/typography';

export type BottomTabBarVariant = 'default' | 'compact';
export type BottomTabBarItemKind = 'default' | 'primary';

export interface BottomTabBarItem<T extends string = string> {
  key: T;
  label: string;
  icon: ComponentProps<typeof Feather>['name'];
  /** number renders a count badge; true renders a dot; undefined renders nothing. */
  badge?: number | boolean;
  disabled?: boolean;
  /** 'primary' renders a brand-filled circular action (FAB-style). Defaults to 'default'. */
  kind?: BottomTabBarItemKind;
}

export interface BottomTabBarProps<T extends string = string> {
  items: readonly BottomTabBarItem<T>[];
  active: T;
  onChange: (key: T) => void;
  /** 'compact' hides labels (icon-only). Defaults to 'default'. */
  variant?: BottomTabBarVariant;
}

/** Default row (icon + label). Compact is icon-only, so it sits shorter. */
const ROW_HEIGHT = 60;
const COMPACT_ROW_HEIGHT = 56;
const ICON_SIZE = 24;
/** Centered square around each icon — a comfortable tap target and even breathing room. */
const ICON_HIT = spacing[10];
/** Inline brand-filled action — slightly larger than ICON_HIT so it reads as primary. */
const PRIMARY_SIZE = 44;
const PRIMARY_ICON_SIZE = 24;

export function BottomTabBar<T extends string = string>({
  items,
  active,
  onChange,
  variant = 'default',
}: BottomTabBarProps<T>) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom }]}
      accessibilityRole="tablist">
      <View style={[styles.row, variant === 'compact' && styles.rowCompact]}>
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <BottomTabBarItemView
              key={item.key}
              item={item}
              active={isActive}
              variant={variant}
              onPress={() => !item.disabled && onChange(item.key)}
            />
          );
        })}
      </View>
    </View>
  );
}

interface BottomTabBarItemViewProps<T extends string> {
  item: BottomTabBarItem<T>;
  active: boolean;
  variant: BottomTabBarVariant;
  onPress: () => void;
}

export function BottomTabBarItemView<T extends string>({
  item,
  active,
  variant,
  onPress,
}: BottomTabBarItemViewProps<T>) {
  const isPrimary = item.kind === 'primary';
  const tint = active ? lightColors.brand : lightColors.textSecondary;
  const hasNumericBadge = typeof item.badge === 'number' && item.badge > 0;
  const hasDotBadge = item.badge === true;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: active, disabled: !!item.disabled }}
      disabled={item.disabled}
      onPress={onPress}
      android_ripple={
        isPrimary
          ? { color: lightColors.brandStrong, borderless: true }
          : { color: lightColors.surfaceSubtle, borderless: true }
      }
      style={({ pressed }) => [
        styles.tab,
        pressed && !isPrimary && styles.tabPressed,
        item.disabled && styles.tabDisabled,
      ]}>
      {({ pressed }) =>
        isPrimary ? (
          <View style={styles.primaryWrap}>
            <View
              style={[
                styles.primaryCircle,
                pressed && styles.primaryCirclePressed,
              ]}>
              <Feather
                name={item.icon}
                size={PRIMARY_ICON_SIZE}
                color={lightColors.onBrand}
              />
            </View>
            {hasNumericBadge ? (
              <View style={styles.primaryBadgeCount}>
                <Text style={styles.badgeCountLabel} numberOfLines={1}>
                  {(item.badge as number) > 99 ? '99+' : String(item.badge)}
                </Text>
              </View>
            ) : null}
            {hasDotBadge ? <View style={styles.primaryBadgeDot} /> : null}
          </View>
        ) : (
          <>
            <View style={styles.iconWrap}>
              <Feather name={item.icon} size={ICON_SIZE} color={tint} />
              {hasNumericBadge ? (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountLabel} numberOfLines={1}>
                    {(item.badge as number) > 99 ? '99+' : String(item.badge)}
                  </Text>
                </View>
              ) : null}
              {hasDotBadge ? <View style={styles.badgeDot} /> : null}
            </View>
            {variant === 'default' ? (
              <Text
                variant="caption"
                numberOfLines={1}
                style={[
                  styles.label,
                  { color: tint },
                  active && styles.labelActive,
                ]}>
                {item.label}
              </Text>
            ) : null}
          </>
        )
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: lightColors.surfacePrimary,
    borderTopWidth: borders.hair,
    borderTopColor: lightColors.border,
  },
  row: {
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  rowCompact: {
    height: COMPACT_ROW_HEIGHT,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    paddingVertical: spacing[1],
  },
  tabPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  tabDisabled: {
    opacity: 0.4,
  },
  iconWrap: {
    width: ICON_HIT,
    height: ICON_HIT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
  },
  labelActive: {
    fontWeight: fontWeight.medium,
  },
  primaryWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCircle: {
    width: PRIMARY_SIZE,
    height: PRIMARY_SIZE,
    borderRadius: PRIMARY_SIZE / 2,
    backgroundColor: lightColors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCirclePressed: {
    backgroundColor: lightColors.brandHover,
  },
  badgeCount: {
    position: 'absolute',
    top: spacing[1],
    end: spacing[1],
    minWidth: 18,
    height: 18,
    paddingHorizontal: spacing[1],
    borderRadius: radius.full,
    backgroundColor: lightColors.danger,
    borderWidth: borders.thick,
    borderColor: lightColors.surfacePrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCountLabel: {
    color: lightColors.onBrand,
    fontSize: 10,
    fontWeight: fontWeight.medium,
    lineHeight: 12,
  },
  badgeDot: {
    position: 'absolute',
    top: spacing[1],
    end: spacing[2],
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: lightColors.danger,
    borderWidth: borders.thick,
    borderColor: lightColors.surfacePrimary,
  },
  primaryBadgeCount: {
    position: 'absolute',
    top: spacing[1],
    end: spacing[1],
    minWidth: 18,
    height: 18,
    paddingHorizontal: spacing[1],
    borderRadius: radius.full,
    backgroundColor: lightColors.danger,
    borderWidth: borders.thick,
    borderColor: lightColors.surfacePrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBadgeDot: {
    position: 'absolute',
    top: spacing[1],
    end: spacing[1],
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: lightColors.danger,
    borderWidth: borders.thick,
    borderColor: lightColors.surfacePrimary,
  },
});
