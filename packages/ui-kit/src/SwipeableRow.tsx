/**
 * SwipeableRow — list row that reveals action buttons on horizontal swipe.
 * No real web equivalent. Uses react-native-gesture-handler.
 *
 * Usage:
 *   <SwipeableRow
 *     rightActions={[{ icon: 'trash-2', color: 'danger', onPress: handleDelete }]}
 *     leftActions={[{ icon: 'archive', color: 'brand', onPress: handleArchive }]}>
 *     <ListRowContent />
 *   </SwipeableRow>
 *
 * Mount a GestureHandlerRootView ancestor (mintkit wires one in app/_layout.tsx).
 */
import { Feather } from '@expo/vector-icons';
import { type ComponentProps, type ReactNode, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { Text } from './Text';
import { useTheme } from './Theme';
import { spacing } from './tokens/spacing';

export type SwipeActionColor = 'default' | 'brand' | 'success' | 'danger' | 'warning';

export interface SwipeAction {
  label?: string;
  icon?: ComponentProps<typeof Feather>['name'];
  color?: SwipeActionColor;
  onPress: () => void;
}

export interface SwipeableRowProps {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  /** Width allotted to each action button. Defaults to 72. */
  actionWidth?: number;
  /** Called after the row closes on its own (e.g. after an action fires). */
  onClose?: () => void;
}

const DEFAULT_ACTION_WIDTH = 72;

export function SwipeableRow({
  children,
  leftActions,
  rightActions,
  actionWidth = DEFAULT_ACTION_WIDTH,
  onClose,
}: SwipeableRowProps) {
  const { colors } = useTheme();
  const swipeRef = useRef<Swipeable>(null);

  const backgroundByColor = useMemo<Record<SwipeActionColor, string>>(
    () => ({
      brand: colors.brand,
      success: colors.success,
      danger: colors.danger,
      warning: colors.warning,
      default: colors.surfaceSubtle,
    }),
    [colors]
  );

  const foregroundByColor = useMemo<Record<SwipeActionColor, string>>(
    () => ({
      default: colors.textPrimary,
      brand: colors.onBrand,
      success: colors.onBrand,
      danger: colors.onBrand,
      warning: colors.onBrand,
    }),
    [colors]
  );

  function renderActions(actions: SwipeAction[], side: 'left' | 'right') {
    return (
      <View
        style={[
          styles.actionsContainer,
          { width: actions.length * actionWidth },
          side === 'left' ? styles.actionsLeft : styles.actionsRight,
        ]}>
        {actions.map((action, idx) => {
          const color = action.color ?? 'default';
          return (
            <Pressable
              key={idx}
              accessibilityRole="button"
              accessibilityLabel={action.label ?? action.icon}
              onPress={() => {
                action.onPress();
                swipeRef.current?.close();
              }}
              android_ripple={{ color: colors.surfacePrimary }}
              style={({ pressed }) => [
                styles.action,
                { width: actionWidth, backgroundColor: backgroundByColor[color] },
                pressed && styles.actionPressed,
              ]}>
              {action.icon ? (
                <Feather
                  name={action.icon}
                  size={18}
                  color={foregroundByColor[color]}
                />
              ) : null}
              {action.label ? (
                <Text
                  variant="caption"
                  style={[styles.actionLabel, { color: foregroundByColor[color] }]}
                  numberOfLines={1}>
                  {action.label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <Swipeable
      ref={swipeRef}
      friction={2}
      overshootLeft={false}
      overshootRight={false}
      onSwipeableClose={onClose}
      renderLeftActions={
        leftActions && leftActions.length > 0
          ? () => renderActions(leftActions, 'left')
          : undefined
      }
      renderRightActions={
        rightActions && rightActions.length > 0
          ? () => renderActions(rightActions, 'right')
          : undefined
      }>
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  actionsLeft: {
    justifyContent: 'flex-start',
  },
  actionsRight: {
    justifyContent: 'flex-end',
  },
  action: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionLabel: {
    fontWeight: '500',
  },
});
