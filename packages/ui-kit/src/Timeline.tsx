/**
 * Timeline — vertical connected list of events/steps for approval chains and
 * audit trails. Richer sibling of `Stepper`: each entry can carry a title,
 * a subtitle (e.g. a timestamp), and a longer description, and the status
 * set adds `danger` for a rejected/failed step alongside `done` / `active` /
 * `pending`.
 */
import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { spacing } from './tokens/spacing';

export type TimelineStatus = 'done' | 'active' | 'pending' | 'danger';

export interface TimelineItem {
  title: string;
  /** Short meta line under the title — typically a timestamp. */
  subtitle?: string;
  description?: string;
  status: TimelineStatus;
}

export interface TimelineProps extends ViewProps {
  items: readonly TimelineItem[];
}

const CIRCLE_SIZE = 24;
const INNER_DOT_SIZE = 10;
const ICON_SIZE = 14;

export function Timeline({ items, style, ...rest }: TimelineProps) {
  const { colors } = useTheme();

  const dynamicStyles = useMemo(
    () => ({
      circleDone: { backgroundColor: colors.brand },
      circleActive: {
        backgroundColor: colors.surfacePrimary,
        borderColor: colors.brand,
      },
      circleDanger: { backgroundColor: colors.danger },
      circlePending: {
        backgroundColor: colors.surfacePrimary,
        borderColor: colors.border,
      },
      innerDotActive: { backgroundColor: colors.brand },
      lineDone: { backgroundColor: colors.brand },
      lineDanger: { backgroundColor: colors.danger },
      linePending: { backgroundColor: colors.border },
    }),
    [colors],
  );

  return (
    <View {...rest} style={[styles.container, style]}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const lineStyle =
          item.status === 'done'
            ? dynamicStyles.lineDone
            : item.status === 'danger'
              ? dynamicStyles.lineDanger
              : dynamicStyles.linePending;

        return (
          <View key={`${idx}-${item.title}`} style={styles.item}>
            <View style={styles.dotColumn}>
              {item.status === 'done' ? (
                <View style={[styles.circle, dynamicStyles.circleDone]}>
                  <Feather name="check" size={ICON_SIZE} color={colors.onBrand} />
                </View>
              ) : item.status === 'danger' ? (
                <View style={[styles.circle, dynamicStyles.circleDanger]}>
                  <Feather name="x" size={ICON_SIZE} color={colors.onBrand} />
                </View>
              ) : item.status === 'active' ? (
                <View style={[styles.circle, styles.circleOutlined, dynamicStyles.circleActive]}>
                  <View style={[styles.innerDot, dynamicStyles.innerDotActive]} />
                </View>
              ) : (
                <View style={[styles.circle, styles.circleOutlined, dynamicStyles.circlePending]} />
              )}
              {!isLast ? <View style={[styles.line, lineStyle]} /> : null}
            </View>

            <View style={[styles.textColumn, isLast && styles.textColumnLast]}>
              <Text
                variant="body"
                tone={item.status === 'pending' ? 'muted' : item.status === 'danger' ? 'danger' : 'primary'}
                style={item.status !== 'pending' ? styles.titleStrong : undefined}>
                {item.title}
              </Text>
              {item.subtitle ? (
                <Text variant="caption" tone="muted">
                  {item.subtitle}
                </Text>
              ) : null}
              {item.description ? (
                <Text variant="caption" tone="secondary">
                  {item.description}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  item: {
    flexDirection: 'row',
  },
  dotColumn: {
    width: CIRCLE_SIZE,
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOutlined: {
    borderWidth: borders.thin,
  },
  innerDot: {
    width: INNER_DOT_SIZE,
    height: INNER_DOT_SIZE,
    borderRadius: INNER_DOT_SIZE / 2,
  },
  line: {
    flex: 1,
    width: 1,
    marginVertical: spacing[1],
  },
  textColumn: {
    flex: 1,
    gap: 2,
    paddingStart: spacing[3],
    paddingTop: 2,
    paddingBottom: spacing[4],
    minWidth: 0,
  },
  textColumnLast: {
    paddingBottom: 0,
  },
  titleStrong: {
    fontWeight: '500',
  },
});
