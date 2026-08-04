import { Feather } from '@expo/vector-icons';
import { type ReactNode, useMemo } from 'react';
import {
  Modal as RNModal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { shadows } from './tokens/shadows';
import { spacing } from './tokens/spacing';
import { Text } from './Text';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  /** Footer slot — typically Buttons, rendered at the bottom-end. */
  actions?: ReactNode;
  /** Tap on backdrop dismisses. Defaults to true. */
  dismissOnBackdrop?: boolean;
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  actions,
  dismissOnBackdrop = true,
}: ModalProps) {
  const { colors } = useTheme();

  const dynamicStyles = useMemo(
    () => ({
      card: {
        backgroundColor: colors.surfacePrimary,
        borderColor: colors.border,
      },
      header: {
        borderBottomColor: colors.border,
      },
      actions: {
        borderTopColor: colors.border,
      },
    }),
    [colors],
  );

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={dismissOnBackdrop ? onClose : undefined}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.card, dynamicStyles.card, shadows.lg]}>
              {title || true ? (
                <View style={[styles.header, dynamicStyles.header]}>
                  {title ? <Text variant="subtitle">{title}</Text> : <View />}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                    hitSlop={8}
                    onPress={onClose}>
                    <Feather name="x" size={18} color={colors.textSecondary} />
                  </Pressable>
                </View>
              ) : null}
              {children ? <View style={styles.body}>{children}</View> : null}
              {actions ? (
                <View style={[styles.actions, dynamicStyles.actions]}>{actions}</View>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 14, 11, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[5],
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: radius.lg,
    borderWidth: borders.hair,
    overflow: 'hidden',
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
    padding: spacing[4],
    gap: spacing[3],
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: borders.hair,
  },
});
