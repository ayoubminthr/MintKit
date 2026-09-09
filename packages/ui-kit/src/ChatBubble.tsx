/**
 * ChatBubble — one message in a conversation thread.
 *
 * Two sides, expressed logically so they flip under RTL: `outgoing` hugs the
 * end edge, `incoming` hugs the start edge. Each carries an optional avatar
 * gutter, an attachment slot above the text, and a meta row (time + delivery
 * status) tucked inside the bubble's bottom-end corner.
 *
 * Usage:
 *   <ChatBubble side="outgoing" text="On my way" time="14:02" status="seen" />
 *   <ChatBubble
 *     side="incoming"
 *     author="Sara Boudia"
 *     text="See the attached brief"
 *     time="13:58"
 *     avatar={<Avatar name="Sara Boudia" size="sm" />}
 *     attachments={<FileChip … />}
 *   />
 *
 * Group consecutive bubbles under a `<Divider label="Today" />` for date
 * separators — there's no date affordance baked in here.
 */
import { Feather } from '@expo/vector-icons';
import { type ReactNode, useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewProps,
} from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

export type ChatBubbleSide = 'outgoing' | 'incoming';
export type ChatBubbleStatus = 'pending' | 'sent' | 'seen';

export interface ChatBubbleProps extends Omit<ViewProps, 'children'> {
  /** Which end of the thread the message belongs to. Flips under RTL. */
  side: ChatBubbleSide;
  text?: string;
  /** Short timestamp rendered in the meta row, e.g. "14:02". */
  time?: string;
  /** Delivery state — outgoing messages only. */
  status?: ChatBubbleStatus;
  /** Author name, shown above the text. For group threads; incoming only. */
  author?: string;
  /** Avatar slot rendered in the gutter beside the bubble. */
  avatar?: ReactNode;
  /** Rendered inside the bubble, above the text — images, file chips, quotes. */
  attachments?: ReactNode;
  /** Highlight the row, e.g. while bulk-selecting messages. */
  selected?: boolean;
  /** Slot in the outer gutter before the bubble — typically a selection Checkbox. */
  leading?: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  /** Fraction of the window width the bubble may occupy. Defaults to 0.78. */
  maxWidthRatio?: number;
  /**
   * Mirror the text block for right-to-left scripts (Arabic, Hebrew) even when
   * the app itself runs LTR, so a mixed-language thread reads correctly.
   * On by default.
   */
  autoDirection?: boolean;
}

const RTL_SCRIPT = /[֐-׿؀-ۿ܀-ݏ]/;

const STATUS_GLYPH = 12;
/** Optical overlap between the two read ticks — not a spacing value. */
const TICK_OVERLAP = 5;

/**
 * Queued → clock, delivered → one tick, read → two overlapping ticks, the
 * convention every messaging app shares. Feather has no double-check glyph,
 * so the second tick is a second `check` pulled back over the first.
 */
function DeliveryStatus({
  status,
  color,
}: {
  status: ChatBubbleStatus;
  color: string;
}) {
  if (status !== 'seen') {
    return (
      <Feather
        name={status === 'pending' ? 'clock' : 'check'}
        size={STATUS_GLYPH}
        color={color}
      />
    );
  }

  return (
    <View style={styles.ticks}>
      <Feather name="check" size={STATUS_GLYPH} color={color} />
      <Feather name="check" size={STATUS_GLYPH} color={color} style={styles.tickTrailing} />
    </View>
  );
}

export function ChatBubble({
  side,
  text,
  time,
  status,
  author,
  avatar,
  attachments,
  selected,
  leading,
  onPress,
  onLongPress,
  maxWidthRatio = 0.78,
  autoDirection = true,
  style,
  ...rest
}: ChatBubbleProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const outgoing = side === 'outgoing';

  const dynamicStyles = useMemo(
    () => ({
      row: selected ? { backgroundColor: colors.brandSubtle } : null,
      bubble: {
        backgroundColor: outgoing ? colors.brandSubtle : colors.surfaceSubtle,
        borderColor: colors.border,
        maxWidth: width * maxWidthRatio,
      },
      pressed: { opacity: 0.85 },
    }),
    [colors, outgoing, selected, width, maxWidthRatio],
  );

  const rtlText = autoDirection && text ? RTL_SCRIPT.test(text) : false;

  const meta =
    time || (outgoing && status) ? (
      <View style={styles.meta}>
        {time ? (
          <Text variant="caption" tone="muted" scaled={false}>
            {time}
          </Text>
        ) : null}
        {outgoing && status ? (
          <DeliveryStatus
            status={status}
            color={status === 'seen' ? colors.brand : colors.textMuted}
          />
        ) : null}
      </View>
    ) : null;

  const bubble = (
    <View
      style={[
        styles.bubble,
        dynamicStyles.bubble,
        outgoing ? styles.bubbleOutgoing : styles.bubbleIncoming,
      ]}>
      {author && !outgoing ? (
        <Text variant="caption" tone="brand" numberOfLines={1}>
          {author}
        </Text>
      ) : null}
      {attachments ? <View style={styles.attachments}>{attachments}</View> : null}
      {text ? (
        <Text
          variant="body"
          style={[
            styles.text,
            rtlText && { textAlign: 'right', writingDirection: 'rtl' },
          ]}>
          {text}
        </Text>
      ) : null}
      {meta}
    </View>
  );

  return (
    <View
      {...rest}
      style={[
        styles.row,
        outgoing ? styles.rowOutgoing : styles.rowIncoming,
        dynamicStyles.row,
        style,
      ]}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      {avatar && !outgoing ? <View style={styles.gutter}>{avatar}</View> : null}
      {onPress || onLongPress ? (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          onLongPress={onLongPress}
          delayLongPress={400}
          style={({ pressed }) => [pressed && dynamicStyles.pressed]}>
          {bubble}
        </Pressable>
      ) : (
        bubble
      )}
      {avatar && outgoing ? <View style={styles.gutter}>{avatar}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1],
  },
  rowOutgoing: {
    justifyContent: 'flex-end',
  },
  rowIncoming: {
    justifyContent: 'flex-start',
  },
  leading: {
    alignSelf: 'center',
  },
  gutter: {
    alignSelf: 'flex-end',
  },
  bubble: {
    borderWidth: borders.hair,
    borderRadius: radius.xl,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    gap: spacing[1],
    minWidth: 72,
  },
  bubbleOutgoing: {
    borderTopEndRadius: radius.sm,
  },
  bubbleIncoming: {
    borderTopStartRadius: radius.sm,
  },
  attachments: {
    gap: spacing[2],
  },
  text: {
    flexShrink: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: spacing[1],
  },
  ticks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickTrailing: {
    marginStart: -TICK_OVERLAP,
  },
});
