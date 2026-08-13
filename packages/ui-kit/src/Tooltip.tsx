import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useState,
} from 'react';
import {
  Modal as RNModal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type ViewProps,
} from 'react-native';

import { Text } from './Text';
import { borders } from './tokens/borders';
import { palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { shadows } from './tokens/shadows';
import { spacing } from './tokens/spacing';

export interface TooltipProps {
  label: string;
  /**
   * The trigger element. Receives an injected `onLongPress` handler that
   * opens the tooltip. Must be a single Pressable-like element.
   */
  children: ReactElement<{ onLongPress?: (...args: unknown[]) => void }>;
}

/**
 * Mobile-idiomatic tooltip: long-press to open, tap-anywhere to dismiss.
 * Hover doesn't exist on touch devices, so we use long-press as the
 * canonical disclosure gesture.
 */
export function Tooltip({ label, children }: TooltipProps) {
  const [open, setOpen] = useState(false);

  const trigger = isValidElement(children)
    ? cloneElement(children, {
        onLongPress: () => setOpen(true),
      })
    : children;

  return (
    <>
      {trigger as ReactNode}
      <RNModal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.backdrop}>
            <View style={[styles.bubble, shadows.md]}>
              <Text variant="caption" tone="inverse">
                {label}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </RNModal>
    </>
  );
}

/**
 * Wrap any plain (non-Pressable) content with this if you want long-press
 * tooltip behavior without writing your own `<Pressable>`. Adds a hairline
 * dotted underline to suggest discoverability.
 */
export function TooltipTrigger({
  children,
  style,
  ...rest
}: ViewProps & { children: ReactNode }) {
  return (
    <Pressable {...(rest as object)} style={style as ViewProps['style']}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 14, 11, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[5],
  },
  bubble: {
    maxWidth: 320,
    backgroundColor: palette.gray[800],
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderWidth: borders.hair,
    borderColor: palette.gray[700],
  },
});
