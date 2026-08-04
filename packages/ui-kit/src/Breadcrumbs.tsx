import { Feather } from '@expo/vector-icons';
import { Fragment } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ViewProps } from 'react-native';

import { spacing } from './tokens/spacing';
import { Text } from './Text';
import { useTheme } from './Theme';
import { forwardChevron } from './utils/rtl';

export interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

export interface BreadcrumbsProps extends ViewProps {
  items: readonly BreadcrumbItem[];
}

export function Breadcrumbs({ items, style, ...rest }: BreadcrumbsProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      style={style as ViewProps['style']}
      {...(rest as ViewProps)}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const content = (
          <Text
            variant="caption"
            tone={isLast ? 'primary' : 'secondary'}
            style={isLast ? styles.current : undefined}
            numberOfLines={1}>
            {item.label}
          </Text>
        );
        return (
          <Fragment key={`${idx}-${item.label}`}>
            {item.onPress && !isLast ? (
              <Pressable onPress={item.onPress} hitSlop={6}>
                {content}
              </Pressable>
            ) : (
              <View>{content}</View>
            )}
            {!isLast ? (
              <Feather
                name={forwardChevron()}
                size={12}
                color={colors.textMuted}
                style={styles.separator}
              />
            ) : null}
          </Fragment>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  separator: {
    marginHorizontal: 2,
  },
  current: {
    fontWeight: '500',
  },
});
