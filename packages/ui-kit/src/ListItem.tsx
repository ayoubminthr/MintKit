/**
 * ListItem — mobile-staple row primitive.
 *
 * Shape: leading slot → title + optional subtitle → trailing slot
 * (with auto chevron when pressable). Compose into a `<List>` to get
 * hair-line separators between rows. Group with `<ListSection>` for
 * section headers + footer captions.
 */
import { Feather } from '@expo/vector-icons';
import { Children, Fragment, type ReactNode, useMemo } from 'react';
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  View,
  type ViewProps,
} from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { forwardChevron } from './utils/rtl';

export interface ListItemProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  subtitle?: string;
  /** Leading slot — icon, Avatar, Checkbox, etc. */
  leading?: ReactNode;
  /** Trailing slot — Badge, Switch, secondary text, etc. */
  trailing?: ReactNode;
  /** Force-show chevron. Defaults to true when `onPress` is set and no trailing slot. */
  showChevron?: boolean;
  /** Render the title in the danger tone. */
  destructive?: boolean;
}

const ROW_MIN_HEIGHT = 56;

export function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  showChevron,
  destructive,
  onPress,
  disabled,
  ...rest
}: ListItemProps) {
  const { colors } = useTheme();
  const pressable = Boolean(onPress);
  const shouldShowChevron =
    showChevron !== undefined ? showChevron : pressable && !trailing;

  const titleTone = destructive ? 'danger' : 'primary';

  const dynamicStyles = useMemo(
    () => ({
      container: { backgroundColor: colors.surfacePrimary },
      pressed: { backgroundColor: colors.surfaceSubtle },
    }),
    [colors],
  );

  const content = (
    <View style={styles.row}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.text}>
        <Text variant="body" tone={titleTone} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" tone="secondary" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      {shouldShowChevron ? (
        <Feather
          name={forwardChevron()}
          size={18}
          color={colors.textMuted}
          style={styles.chevron}
        />
      ) : null}
    </View>
  );

  if (!pressable) {
    return (
      <View style={[dynamicStyles.container, disabled && styles.disabled]}>{content}</View>
    );
  }

  return (
    <Pressable
      {...rest}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      android_ripple={{ color: colors.surfaceSubtle, borderless: false }}
      style={({ pressed }) => [
        dynamicStyles.container,
        pressed && dynamicStyles.pressed,
        disabled && styles.disabled,
      ]}>
      {content}
    </Pressable>
  );
}

export interface ListProps extends ViewProps {
  /** Wrap with a hair-bordered container, like a Card. */
  bordered?: boolean;
  children: ReactNode;
}

export function List({ bordered = false, children, style, ...rest }: ListProps) {
  const { colors } = useTheme();
  const items = Children.toArray(children).filter(Boolean);
  const total = items.length;

  const dynamicStyles = useMemo(
    () => ({
      bordered: {
        borderColor: colors.border,
        backgroundColor: colors.surfacePrimary,
      },
      separator: {
        backgroundColor: colors.border,
      },
    }),
    [colors],
  );

  return (
    <View
      {...rest}
      style={[bordered && styles.bordered, bordered && dynamicStyles.bordered, style]}>
      {items.map((child, idx) => (
        <Fragment key={idx}>
          {child}
          {idx < total - 1 ? (
            <View style={[styles.separator, dynamicStyles.separator]} />
          ) : null}
        </Fragment>
      ))}
    </View>
  );
}

export interface ListSectionProps extends ViewProps {
  /** Section heading rendered above the list. */
  title?: string;
  /** Footer caption rendered below the list. */
  caption?: string;
  children: ReactNode;
}

export function ListSection({
  title,
  caption,
  children,
  style,
  ...rest
}: ListSectionProps) {
  return (
    <View {...rest} style={[sectionStyles.root, style]}>
      {title ? (
        <Text
          variant="caption"
          tone="muted"
          style={sectionStyles.title}>
          {title}
        </Text>
      ) : null}
      {children}
      {caption ? (
        <Text variant="caption" tone="muted" style={sectionStyles.caption}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  row: {
    minHeight: ROW_MIN_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  leading: {
    flexShrink: 0,
  },
  text: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  trailing: {
    flexShrink: 0,
  },
  chevron: {
    marginStart: -spacing[1],
  },
  bordered: {
    borderWidth: borders.hair,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  separator: {
    height: borders.hair,
    marginStart: spacing[4],
  },
});

const sectionStyles = StyleSheet.create({
  root: {
    gap: spacing[2],
  },
  title: {
    paddingHorizontal: spacing[4],
  },
  caption: {
    paddingHorizontal: spacing[4],
  },
});
