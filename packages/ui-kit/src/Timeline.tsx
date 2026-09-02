/**
 * Timeline — vertical connected list of events/steps for approval chains and
 * audit trails. Richer sibling of `Stepper`: each entry can carry a title,
 * a subtitle (e.g. a timestamp), and a longer description, and the status
 * set adds `danger` for a rejected/failed step alongside `done` / `active` /
 * `pending`.
 *
 * Each step's marker is a soft tinted disc with a Feather glyph. The glyph
 * defaults to the one for `status`; pass `icon` on an item to override it.
 */
import { Feather } from '@expo/vector-icons';
import { useMemo, type ComponentProps, type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { palette } from './tokens/colors';
import { spacing } from './tokens/spacing';

export type TimelineStatus = 'done' | 'active' | 'pending' | 'danger';

type FeatherName = ComponentProps<typeof Feather>['name'];

export interface TimelineItem {
  title: string;
  /** Short meta line under the title — typically a timestamp. */
  subtitle?: string;
  description?: string;
  status: TimelineStatus;
  /**
   * Feather glyph drawn inside this step's marker. Defaults to the glyph for
   * `status` (`check` / `x` / `refresh-cw` / `plus`). The marker's tint always
   * follows `status`, so an override changes the symbol, not the semantics.
   */
  icon?: FeatherName;
  /**
   * Custom content rendered in place of the title/subtitle/description text
   * block — e.g. a card with an avatar, name, and a status pill. The marker
   * and connector line still come from `status` as usual.
   */
  content?: ReactNode;
}

export interface TimelineProps extends ViewProps {
  items: readonly TimelineItem[];
}

const MARKER_SIZE = 22;
const ICON_SIZE = 12;

const STATUS_ICON: Record<TimelineStatus, FeatherName> = {
  done: 'check',
  active: 'refresh-cw',
  danger: 'x',
  pending: 'plus',
};

export function Timeline({ items, style, ...rest }: TimelineProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const markerStyles = useMemo<Record<TimelineStatus, { container: object; color: string }>>(
    () => ({
      done: {
        container: { backgroundColor: colors.successSubtle },
        color: isDark ? palette.success[100] : palette.success[700],
      },
      active: {
        container: { backgroundColor: colors.warningSubtle },
        color: isDark ? palette.warning[100] : palette.warning[700],
      },
      danger: {
        container: { backgroundColor: colors.dangerSubtle },
        color: isDark ? palette.danger[100] : palette.danger[700],
      },
      pending: {
        container: { backgroundColor: colors.surfaceSubtle },
        color: colors.textMuted,
      },
    }),
    [colors, isDark],
  );

  return (
    <View {...rest} style={[styles.container, style]}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const marker = markerStyles[item.status];

        return (
          <View key={`${idx}-${item.title}`} style={styles.item}>
            <View style={styles.markerColumn}>
              <View style={[styles.marker, marker.container]}>
                <Feather
                  name={item.icon ?? STATUS_ICON[item.status]}
                  size={ICON_SIZE}
                  color={marker.color}
                />
              </View>
              {!isLast ? <View style={[styles.line, { backgroundColor: colors.brandSubtle }]} /> : null}
            </View>

            <View style={[styles.textColumn, isLast && styles.textColumnLast]}>
              {item.content ? (
                item.content
              ) : (
                <>
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
                </>
              )}
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
  markerColumn: {
    width: MARKER_SIZE,
    alignItems: 'center',
  },
  marker: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    width: 1,
  },
  textColumn: {
    flex: 1,
    gap: 2,
    paddingStart: spacing[2],
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
