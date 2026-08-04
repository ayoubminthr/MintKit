/**
 * Menu — anchored popover with an action list.
 *
 * Replaces desktop dropdown-menu patterns on mobile. Position-aware:
 * appears below the anchor, flips above when too close to the bottom
 * of the viewport. Backdrop press dismisses.
 *
 * Usage:
 *   const triggerRef = useRef<View>(null);
 *   const [open, setOpen] = useState(false);
 *   …
 *   <View ref={triggerRef}>
 *     <IconButton icon="more-vertical" onPress={() => setOpen(true)} … />
 *   </View>
 *   <Menu
 *     visible={open}
 *     onClose={() => setOpen(false)}
 *     anchorRef={triggerRef}
 *     items={[
 *       { label: 'Edit', icon: 'edit-2', onPress: handleEdit },
 *       { label: 'Delete', icon: 'trash-2', destructive: true, onPress: handleDelete },
 *     ]}
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { type ComponentProps, type RefObject, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Modal as RNModal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { shadows } from './tokens/shadows';
import { spacing } from './tokens/spacing';
import { isRTL } from './utils/rtl';

export interface MenuItem {
  label: string;
  icon?: ComponentProps<typeof Feather>['name'];
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export interface MenuProps {
  visible: boolean;
  onClose: () => void;
  /** Ref of the View that anchors the menu — usually wraps the trigger. */
  anchorRef: RefObject<View | null>;
  items: readonly MenuItem[];
  /** Min width of the menu surface. Defaults to 200. */
  minWidth?: number;
}

interface AnchorBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const GAP = 4;
const ESTIMATED_ROW_HEIGHT = 44;
const SCREEN_PADDING = spacing[3];

export function Menu({
  visible,
  onClose,
  anchorRef,
  items,
  minWidth = 200,
}: MenuProps) {
  const { colors } = useTheme();
  const [anchor, setAnchor] = useState<AnchorBox | null>(null);

  useEffect(() => {
    if (!visible) return;
    const node = anchorRef.current;
    if (!node) return;
    node.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
    });
  }, [visible, anchorRef]);

  const dynamicStyles = useMemo(
    () => ({
      menu: {
        backgroundColor: colors.surfacePrimary,
        borderColor: colors.border,
      },
    }),
    [colors],
  );

  const screen = Dimensions.get('window');
  const estimatedHeight = items.length * ESTIMATED_ROW_HEIGHT + spacing[1] * 2;
  const flipAbove = anchor
    ? anchor.y + anchor.height + GAP + estimatedHeight > screen.height - SCREEN_PADDING
    : false;

  let menuStyle = {};
  if (anchor) {
    const top = flipAbove
      ? Math.max(SCREEN_PADDING, anchor.y - GAP - estimatedHeight)
      : anchor.y + anchor.height + GAP;
    // Align the menu's leading edge with the anchor's leading edge. In RTL,
    // both edges are on the right, so derive the logical `start` inset
    // (distance from the right edge in RTL) from the anchor's physical right.
    const desiredStart = isRTL()
      ? screen.width - (anchor.x + anchor.width)
      : anchor.x;
    const start = Math.max(
      SCREEN_PADDING,
      Math.min(desiredStart, screen.width - SCREEN_PADDING - minWidth),
    );
    menuStyle = { top, start, minWidth };
  }

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close menu" />
      {anchor ? (
        <View
          style={[styles.menu, dynamicStyles.menu, shadows.md, menuStyle]}
          pointerEvents="box-none">
          <View style={styles.menuInner}>
            {items.map((item, idx) => (
              <MenuRow
                key={`${item.label}-${idx}`}
                item={item}
                onPress={() => {
                  onClose();
                  item.onPress();
                }}
              />
            ))}
          </View>
        </View>
      ) : null}
    </RNModal>
  );
}

function MenuRow({ item, onPress }: { item: MenuItem; onPress: () => void }) {
  const { colors } = useTheme();
  const tone = item.destructive ? colors.danger : colors.textPrimary;

  const dynamicStyles = useMemo(
    () => ({
      rowPressed: { backgroundColor: colors.surfaceSubtle },
    }),
    [colors],
  );

  return (
    <Pressable
      accessibilityRole="menuitem"
      disabled={item.disabled}
      onPress={onPress}
      android_ripple={{ color: colors.surfaceSubtle, borderless: false }}
      style={({ pressed }) => [
        styles.row,
        pressed && dynamicStyles.rowPressed,
        item.disabled && styles.rowDisabled,
      ]}>
      {item.icon ? <Feather name={item.icon} size={16} color={tone} /> : null}
      <Text variant="body" style={{ color: tone, flex: 1 }} numberOfLines={1}>
        {item.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  menu: {
    position: 'absolute',
    borderRadius: radius.lg,
    borderWidth: borders.hair,
    overflow: 'hidden',
  },
  menuInner: {
    paddingVertical: spacing[1],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    minHeight: ESTIMATED_ROW_HEIGHT,
  },
  rowDisabled: {
    opacity: 0.5,
  },
});
