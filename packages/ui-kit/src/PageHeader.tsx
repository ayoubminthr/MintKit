import { Feather } from '@expo/vector-icons';
import { type ComponentProps, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { backChevron } from './utils/rtl';

export interface PageHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  /** Feather icon shown in a brand-tinted bubble beside the title. */
  icon?: ComponentProps<typeof Feather>['name'];
  /** Show a back chevron above the title. Provide `onBack` to handle taps. */
  onBack?: () => void;
  /** Action slot rendered at the end of the title row (icon → title → gap → actions). */
  actions?: ReactNode;
}

const BACK_TARGET = 44;
const ICON_BUBBLE = 32;

export function PageHeader({
  title,
  subtitle,
  icon,
  onBack,
  actions,
  style,
  ...rest
}: PageHeaderProps) {
  return (
    <View {...rest} style={[styles.container, style]}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={spacing[2]}
          onPress={onBack}
          android_ripple={{ color: lightColors.surfaceSubtle, borderless: true }}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}>
          <Feather name={backChevron()} size={24} color={lightColors.textPrimary} />
        </Pressable>
      ) : null}

      <View style={styles.titleRow}>
        {icon ? (
          <View style={styles.iconBubble}>
            <Feather name={icon} size={16} color={lightColors.brand} />
          </View>
        ) : null}
        <View style={styles.titleStack}>
          <Text variant="subtitle" numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="body" tone="secondary" numberOfLines={3}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {actions ? <View style={styles.actions}>{actions}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[3],
    paddingVertical: spacing[4],
  },
  backButton: {
    width: BACK_TARGET,
    height: BACK_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: -spacing[2],
    borderRadius: radius.full,
  },
  backButtonPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  iconBubble: {
    width: ICON_BUBBLE,
    height: ICON_BUBBLE,
    borderRadius: radius.lg,
    backgroundColor: lightColors.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStack: {
    flex: 1,
    gap: spacing[1],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[2],
    alignItems: 'center',
    flexShrink: 0,
  },
});
