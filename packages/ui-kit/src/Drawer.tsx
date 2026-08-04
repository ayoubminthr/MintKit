/**
 * Drawer — side-sliding panel.
 * Mobile counterpart of the web kit's Drawer.
 *
 * Slides in from the right (respects RTL) edge. Use for detail views,
 * settings panels, or form sidebars that don't warrant a full screen push.
 *
 * Usage:
 *   <Drawer visible={open} onClose={close} title="Employee details">
 *     <Text>…content…</Text>
 *   </Drawer>
 */
import { Feather } from '@expo/vector-icons';
import { type ReactNode, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal as RNModal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { shadows } from './tokens/shadows';
import { spacing } from './tokens/spacing';
import { rtlSign } from './utils/rtl';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DrawerSide = 'start' | 'end';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  /** Header title — string renders as subtitle Text, or pass a node for custom content. */
  title?: string | ReactNode;
  children?: ReactNode;
  /** Footer slot — typically action buttons. */
  footer?: ReactNode;
  /** Which edge the drawer slides from. Defaults to 'end' (right in LTR). */
  side?: DrawerSide;
  /** Width preset. Defaults to 'md'. */
  size?: DrawerSize;
  /** Tap on backdrop dismisses. Defaults to true. */
  dismissOnBackdrop?: boolean;
  /** Suppress the default title + close-button header. Consumer renders its own top row. */
  hideDefaultHeader?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const sizeWidths: Record<DrawerSize, number> = {
  sm: Math.min(280, SCREEN_WIDTH * 0.7),
  md: Math.min(340, SCREEN_WIDTH * 0.82),
  lg: Math.min(420, SCREEN_WIDTH * 0.92),
  full: SCREEN_WIDTH,
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Drawer({
  visible,
  onClose,
  title,
  children,
  footer,
  side = 'end',
  size = 'md',
  dismissOnBackdrop = true,
  hideDefaultHeader = false,
}: DrawerProps) {
  const { colors } = useTheme();
  const drawerWidth = sizeWidths[size];
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(drawerWidth)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const dynamicStyles = useMemo(
    () => ({
      drawer: { backgroundColor: colors.surfacePrimary },
      drawerStart: { borderEndColor: colors.border },
      drawerEnd: { borderStartColor: colors.border },
      header: { borderBottomColor: colors.border },
      footer: { borderTopColor: colors.border },
    }),
    [colors],
  );

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 220,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: drawerWidth,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, drawerWidth]);

  // translateX is in physical pixel space — multiply by rtlSign() so the panel
  // slides in from its logical edge regardless of writing direction.
  const directionSign = (side === 'start' ? -1 : 1) * rtlSign();
  const translateX = Animated.multiply(slideAnim, directionSign);

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backdropOpacity },
          ]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={dismissOnBackdrop ? onClose : undefined}
            accessibilityRole="button"
            accessibilityLabel="Dismiss drawer"
          />
        </Animated.View>

        {/* Drawer panel */}
        <Animated.View
          style={[
            styles.drawer,
            dynamicStyles.drawer,
            shadows.drawer,
            {
              width: drawerWidth,
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              transform: [{ translateX }],
            },
            side === 'start' ? styles.drawerStart : styles.drawerEnd,
            side === 'start' ? dynamicStyles.drawerStart : dynamicStyles.drawerEnd,
          ]}>
          {/* Header */}
          {hideDefaultHeader ? null : (
            <View style={[styles.header, dynamicStyles.header]}>
              {typeof title === 'string' ? (
                <Text variant="subtitle" style={{ flex: 1 }} numberOfLines={1}>
                  {title}
                </Text>
              ) : title ? (
                <View style={{ flex: 1 }}>{title}</View>
              ) : (
                <View style={{ flex: 1 }} />
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close drawer"
                hitSlop={8}
                onPress={onClose}>
                <Feather name="x" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>
          )}

          {/* Body */}
          <View style={styles.body}>{children}</View>

          {/* Footer */}
          {footer ? (
            <View style={[styles.footer, dynamicStyles.footer]}>{footer}</View>
          ) : null}
        </Animated.View>
      </View>
    </RNModal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 14, 11, 0.45)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  drawerStart: {
    start: 0,
    borderEndWidth: borders.hair,
  },
  drawerEnd: {
    end: 0,
    borderStartWidth: borders.hair,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: borders.hair,
  },
  body: {
    flex: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: borders.hair,
  },
});
