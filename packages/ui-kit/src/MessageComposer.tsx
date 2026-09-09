/**
 * MessageComposer — the bar pinned to the bottom of a conversation thread.
 *
 * A growing multiline field flanked by an optional attach button and a send
 * button, over a hair top border. Staged attachments render in the
 * `attachments` slot above the field, so the preview strip scrolls with the
 * composer rather than the thread.
 *
 * Usage:
 *   <MessageComposer
 *     value={draft}
 *     onChangeText={setDraft}
 *     onSend={send}
 *     placeholder="Write a message"
 *     onAttachPress={pickFile}
 *     attachActive={files.length > 0}
 *     sending={isSending}
 *     canSend={draft.trim().length > 0 || files.length > 0}
 *     attachments={<FilePreviewStrip files={files} … />}
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { type ReactNode, useMemo } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type ViewProps,
} from 'react-native';

import { Spinner } from './Spinner';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, scaleFont } from './tokens/typography';

export interface MessageComposerProps extends Omit<ViewProps, 'children'> {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  /** Swaps the send glyph for a spinner and blocks further input. */
  sending?: boolean;
  disabled?: boolean;
  /**
   * Overrides the built-in "field is non-empty" rule — pass `true` to allow
   * sending an attachment with no text.
   */
  canSend?: boolean;
  onAttachPress?: () => void;
  /** Tints the attach button to signal that something is staged. */
  attachActive?: boolean;
  /** Rendered above the field — typically a staged-attachment strip. */
  attachments?: ReactNode;
  maxLength?: number;
  sendAccessibilityLabel?: string;
  attachAccessibilityLabel?: string;
}

const FIELD_MIN_HEIGHT = 40;
const FIELD_MAX_HEIGHT = 104;
const SEND_BOX = 40;

export function MessageComposer({
  value,
  onChangeText,
  onSend,
  placeholder = 'Write a message',
  sending = false,
  disabled = false,
  canSend,
  onAttachPress,
  attachActive = false,
  attachments,
  maxLength,
  sendAccessibilityLabel = 'Send message',
  attachAccessibilityLabel = 'Attach a file',
  style,
  ...rest
}: MessageComposerProps) {
  const { colors } = useTheme();
  const inert = disabled || sending;
  const sendable = (canSend ?? value.trim().length > 0) && !inert;

  const dynamicStyles = useMemo(
    () => ({
      root: {
        backgroundColor: colors.surfacePrimary,
        borderTopColor: colors.border,
      },
      field: {
        backgroundColor: colors.surfaceSubtle,
        borderColor: colors.border,
      },
      input: { color: colors.textPrimary },
      send: { backgroundColor: colors.brand },
      sendIdle: { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
    }),
    [colors],
  );

  return (
    <View {...rest} style={[styles.root, dynamicStyles.root, style]}>
      {attachments ? <View style={styles.attachments}>{attachments}</View> : null}
      <View style={styles.row}>
        <View style={[styles.field, dynamicStyles.field]}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            editable={!inert}
            multiline
            maxLength={maxLength}
            textAlignVertical="center"
            style={[styles.input, dynamicStyles.input]}
          />
          {onAttachPress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={attachAccessibilityLabel}
              onPress={onAttachPress}
              disabled={inert}
              hitSlop={spacing[2]}
              style={({ pressed }) => [
                styles.attachButton,
                (pressed || inert) && styles.dimmed,
              ]}>
              <Feather
                name="paperclip"
                size={18}
                color={attachActive ? colors.brand : colors.textMuted}
              />
            </Pressable>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={sendAccessibilityLabel}
          onPress={onSend}
          disabled={!sendable}
          android_ripple={{ color: colors.brandStrong, borderless: false }}
          style={({ pressed }) => [
            styles.send,
            sendable ? dynamicStyles.send : dynamicStyles.sendIdle,
            !sendable && styles.sendIdle,
            pressed && styles.dimmed,
          ]}>
          {sending ? (
            <Spinner size="sm" tone="neutral" />
          ) : (
            <Feather
              name="send"
              size={18}
              color={sendable ? colors.onBrand : colors.textMuted}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderTopWidth: borders.hair,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[3],
    gap: spacing[2],
  },
  attachments: {
    maxHeight: 132,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing[2],
  },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    minHeight: FIELD_MIN_HEIGHT,
    borderWidth: borders.hair,
    borderRadius: radius.xl,
    paddingHorizontal: spacing[3],
    paddingVertical: Platform.OS === 'ios' ? spacing[2] : 0,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.sans,
    fontSize: scaleFont(fontSize.md),
    maxHeight: FIELD_MAX_HEIGHT,
    paddingVertical: 0,
  },
  attachButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  send: {
    width: SEND_BOX,
    height: SEND_BOX,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIdle: {
    borderWidth: borders.hair,
  },
  dimmed: {
    opacity: 0.6,
  },
});
