import { Feather } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from './Text';
import { lightColors } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { fontWeight } from './tokens/typography';

export interface SheetHeaderComponentProps {
  /** Sheet title, sentence case. Omit for a close-only header. */
  title?: string;
  /** Rendered under the title, e.g. an effective date. */
  subtitle?: string;
  /** Shown beside the title in brand color. Numbers are zero-padded to 2 digits. */
  count?: number | string;
  /** Renders the trailing close (X) button when provided. */
  onClose?: () => void;
  /** Extra controls rendered before the close button, e.g. an edit or filter icon. */
  rightActions?: ReactNode;
  /** Rendered at the start of the title row, before the title, e.g. a back button. */
  leftAccessory?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SheetHeader({
  title,
  subtitle,
  count,
  onClose,
  rightActions,
  leftAccessory,
  style,
}: SheetHeaderComponentProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.content}>
        {leftAccessory}
        {title || subtitle ? (
          <View style={styles.titleStack}>
            {title ? (
              <View style={styles.titleRow}>
                <Text variant="body" style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
                {count !== undefined ? (
                  <Text variant="body" tone="brand" style={styles.title}>
                    {typeof count === 'number' ? count.toString().padStart(2, '0') : count}
                  </Text>
                ) : null}
              </View>
            ) : null}
            {subtitle ? (
              <Text variant="caption" tone="secondary" numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
      {onClose || rightActions ? (
        <View style={styles.right}>
          {rightActions}
          {onClose ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={spacing[2]}
              onPress={onClose}>
              <Feather name="x" size={20} color={lightColors.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    flexShrink: 1,
  },
  titleStack: {
    flexShrink: 1,
    gap: spacing[1] / 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  title: {
    fontWeight: fontWeight.medium,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
});
