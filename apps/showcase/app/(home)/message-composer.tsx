import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  ChatBubble,
  Divider,
  IconButton,
  MessageComposer,
  Text,
  borders,
  lightColors,
  radius,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

interface Sent {
  id: number;
  text: string;
  time: string;
}

export default function MessageComposerDemo() {
  return (
    <>
      <Stack.Screen options={{ title: 'MessageComposer' }} />
      <MessageComposerBody />
    </>
  );
}

export function MessageComposerBody() {
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<Sent[]>([
    { id: 1, text: 'Type below and hit send.', time: '10:00' },
  ]);
  const [staged, setStaged] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  function send() {
    if (!draft.trim() && staged.length === 0) return;
    setSending(true);
    const text = [draft.trim(), ...staged].filter(Boolean).join(' · ');
    setTimeout(() => {
      setSent((prev) => [
        ...prev,
        {
          id: Date.now(),
          text,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
      setDraft('');
      setStaged([]);
      setSending(false);
    }, 600);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Text variant="body" tone="secondary">
        The bar pinned to the bottom of a conversation thread: a growing multiline
        field, an optional attach button, and a send button that stays inert until
        there is something to send.
      </Text>

      <Section label="Live" description="Sends into the thread above it." flush>
        <View style={styles.thread}>
          <Divider label="Today" spacing="sm" />
          {sent.map((message) => (
            <ChatBubble
              key={message.id}
              side="outgoing"
              text={message.text}
              time={message.time}
              status="sent"
            />
          ))}
        </View>
        <MessageComposer
          value={draft}
          onChangeText={setDraft}
          onSend={send}
          sending={sending}
          placeholder="Write a message"
          onAttachPress={() => setStaged((prev) => [...prev, `file-${prev.length + 1}.pdf`])}
          attachActive={staged.length > 0}
          canSend={draft.trim().length > 0 || staged.length > 0}
          attachments={
            staged.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.stagedRow}>
                  {staged.map((name, idx) => (
                    <View key={name} style={styles.stagedChip}>
                      <Feather name="file-text" size={14} color={lightColors.brand} />
                      <Text variant="caption" tone="secondary" numberOfLines={1}>
                        {name}
                      </Text>
                      <IconButton
                        icon="x"
                        size="sm"
                        variant="ghost"
                        accessibilityLabel={`Remove ${name}`}
                        onPress={() => setStaged((prev) => prev.filter((_, i) => i !== idx))}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : null
          }
        />
      </Section>

      <Section label="No attach button" description="Omit onAttachPress." flush>
        <MessageComposer value="" onChangeText={() => {}} onSend={() => {}} />
      </Section>

      <Section label="Sending" flush>
        <MessageComposer
          value="On my way"
          onChangeText={() => {}}
          onSend={() => {}}
          onAttachPress={() => {}}
          sending
        />
      </Section>

      <Section label="Disabled" description="Read-only or archived conversation." flush>
        <MessageComposer
          value=""
          onChangeText={() => {}}
          onSend={() => {}}
          onAttachPress={() => {}}
          placeholder="This conversation is closed"
          disabled
        />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  thread: {
    gap: spacing[1],
    paddingBottom: spacing[3],
  },
  stagedRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  stagedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    borderWidth: borders.hair,
    borderColor: lightColors.border,
    borderRadius: radius.lg,
    paddingStart: spacing[3],
    paddingEnd: spacing[1],
    paddingVertical: spacing[1],
    maxWidth: 200,
  },
});
