import { Feather } from '@expo/vector-icons';
import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { spacing } from './tokens/spacing';
import { Text } from './Text';
import { useTheme } from './Theme';

export interface EmptyStateProps extends ViewProps {
  icon?: React.ComponentProps<typeof Feather>['name'];
  illustration?: ReactNode;
  illustrationSize?: number;
  illustrationTint?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon = 'inbox',
  illustration,
  illustrationSize = 48,
  illustrationTint,
  title,
  description,
  action,
  style,
  ...rest
}: EmptyStateProps) {
  const { colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      iconBubble: {
        backgroundColor: illustrationTint ?? colors.surfaceSubtle,
        width: illustrationSize,
        height: illustrationSize,
        borderRadius: illustrationSize / 2,
      },
    }),
    [colors, illustrationTint, illustrationSize]
  );

  return (
    <View {...rest} style={[styles.container, style]}>
      <View style={[styles.iconBubble, dynamicStyles.iconBubble]}>
        {illustration ?? <Feather name={icon} size={20} color={colors.textMuted} />}
      </View>
      <View style={styles.text}>
        <Text variant="subtitle">{title}</Text>
        {description ? (
          <Text variant="body" tone="secondary" style={styles.description}>
            {description}
          </Text>
        ) : null}
      </View>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing[10],
    paddingHorizontal: spacing[5],
    gap: spacing[4],
  },
  iconBubble: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    alignItems: 'center',
    gap: spacing[1],
    maxWidth: 320,
  },
  description: {
    textAlign: 'center',
  },
  action: {
    marginTop: spacing[2],
  },
});
