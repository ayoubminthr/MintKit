/**
 * ProfileHeader — centered entity-profile hero.
 *
 * Mobile contact-card pattern: avatar centered up top, identity stack
 * (name + status + subtitle + extras) centered below, quick actions on
 * a dedicated row, optional tabs anchored to the bottom edge.
 *
 * Usage:
 *   <ProfileHeader
 *     avatar={<Avatar name="Sara Boudia" size="xl" />}
 *     name="Sara Boudia"
 *     subtitle="Software Engineer · Engineering"
 *     status={<Badge label="Active" variant="success" dot />}
 *     quickActions={<>…</>}
 *     onOverflowPress={() => {}}
 *     tabs={<Tabs … />}
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { type ReactNode, useMemo } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontWeight } from './tokens/typography';

export type ProfileHeaderDensity = 'default' | 'compact';

export interface ProfileHeaderProps extends ViewProps {
  /** Avatar slot — render an <Avatar /> here. Centered above the name. */
  avatar?: ReactNode;
  /** Display name. */
  name: string;
  /** Subtitle text — role, department, etc. */
  subtitle?: string;
  /** Status badge slot — rendered next to the name. */
  status?: ReactNode;
  /** Extra identity content rendered below the subtitle (e.g. badges). */
  identityExtra?: ReactNode;
  /** Quick-action buttons on a dedicated row below the identity stack. */
  quickActions?: ReactNode;
  /** Overflow menu trigger — appends a '…' button to the actions row. */
  onOverflowPress?: () => void;
  /** Tab navigation slot — rendered at the bottom edge of the header. */
  tabs?: ReactNode;
  /** Layout density — controls vertical spacing only. */
  density?: ProfileHeaderDensity;
  /** Children rendered below the actions row, above the tabs. */
  children?: ReactNode;
}

const OVERFLOW_TARGET = 44;

export function ProfileHeader({
  avatar,
  name,
  subtitle,
  status,
  identityExtra,
  quickActions,
  onOverflowPress,
  tabs,
  density = 'default',
  children,
  style,
  ...rest
}: ProfileHeaderProps) {
  const { colors } = useTheme();
  const isCompact = density === 'compact';
  const hasActionsRow = Boolean(quickActions) || Boolean(onOverflowPress);

  const dynamicStyles = useMemo(
    () => ({
      root: { backgroundColor: colors.surfacePrimary, borderBottomColor: colors.border },
      overflowPressed: { backgroundColor: colors.surfaceSubtle },
    }),
    [colors]
  );

  return (
    <View
      {...rest}
      style={[
        styles.root,
        dynamicStyles.root,
        isCompact ? styles.rootCompact : styles.rootDefault,
        style,
      ]}>
      {avatar ? (
        <View style={[styles.avatarSlot, isCompact && styles.avatarSlotCompact]}>
          {avatar}
        </View>
      ) : null}

      <View style={styles.identity}>
        <View style={styles.nameRow}>
          <Text
            variant={isCompact ? 'subtitle' : 'title'}
            numberOfLines={2}
            style={[styles.nameText, { fontWeight: fontWeight.medium }]}>
            {name}
          </Text>
          {status ? <View style={styles.statusSlot}>{status}</View> : null}
        </View>

        {subtitle ? (
          <Text
            variant="body"
            tone="secondary"
            numberOfLines={2}
            style={styles.subtitleText}>
            {subtitle}
          </Text>
        ) : null}

        {identityExtra ? (
          <View style={styles.identityExtra}>{identityExtra}</View>
        ) : null}
      </View>

      {hasActionsRow ? (
        <View style={styles.actionsRow}>
          {quickActions}
          {onOverflowPress ? (
            <Pressable
              onPress={onOverflowPress}
              accessibilityRole="button"
              accessibilityLabel="More actions"
              hitSlop={spacing[2]}
              android_ripple={{ color: colors.surfaceSubtle, borderless: true }}
              style={({ pressed }) => [
                styles.overflowButton,
                pressed && dynamicStyles.overflowPressed,
              ]}>
              <Feather
                name="more-horizontal"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {children ? <View style={styles.extension}>{children}</View> : null}

      {tabs ? <View style={styles.tabsRow}>{tabs}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderBottomWidth: borders.hair,
    alignItems: 'center',
  },
  rootDefault: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[5],
    paddingBottom: spacing[2],
    gap: spacing[3],
  },
  rootCompact: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
    gap: spacing[2],
  },
  avatarSlot: {
    flexShrink: 0,
  },
  avatarSlotCompact: {
    marginBottom: spacing[1],
  },
  identity: {
    alignItems: 'center',
    gap: spacing[1],
    alignSelf: 'stretch',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    flexWrap: 'wrap',
  },
  nameText: {
    textAlign: 'center',
    flexShrink: 1,
  },
  statusSlot: {
    flexShrink: 0,
  },
  subtitleText: {
    textAlign: 'center',
  },
  identityExtra: {
    marginTop: spacing[1],
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[1],
    alignSelf: 'stretch',
  },
  overflowButton: {
    width: OVERFLOW_TARGET,
    height: OVERFLOW_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  extension: {
    alignSelf: 'stretch',
    marginTop: spacing[2],
  },
  tabsRow: {
    alignSelf: 'stretch',
    marginTop: spacing[3],
    marginHorizontal: -spacing[4],
  },
});
