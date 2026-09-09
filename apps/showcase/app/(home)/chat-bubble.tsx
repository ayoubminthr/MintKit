import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import {
  Avatar,
  ChatBubble,
  Checkbox,
  Divider,
  Text,
  lightColors,
  radius,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

const SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=60';

export default function ChatBubbleDemo() {
  return (
    <>
      <Stack.Screen options={{ title: 'ChatBubble' }} />
      <ChatBubbleBody />
    </>
  );
}

export function ChatBubbleBody() {
  const [selected, setSelected] = useState<number[]>([]);

  function toggle(id: number) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id],
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Text variant="body" tone="secondary">
        One message in a conversation thread. Sides are logical — `outgoing` hugs the
        end edge, `incoming` the start edge — so both flip under RTL.
      </Text>

      <Section label="A thread" flush>
        <Divider label="Today" spacing="md" />
        <ChatBubble
          side="incoming"
          text="Morning — did the payroll export land?"
          time="09:12"
          avatar={<Avatar name="Sara Boudia" size="sm" />}
        />
        <ChatBubble side="outgoing" text="Yes, ran it at 8." time="09:14" status="seen" />
        <ChatBubble
          side="outgoing"
          text="Numbers match the draft you sent Friday."
          time="09:14"
          status="sent"
        />
        <ChatBubble
          side="incoming"
          text="Perfect. I'll close the period then."
          time="09:20"
          avatar={<Avatar name="Sara Boudia" size="sm" />}
        />
      </Section>

      <Section label="Delivery status" description="Outgoing only." flush>
        <ChatBubble side="outgoing" text="Queued while offline" time="11:02" status="pending" />
        <ChatBubble side="outgoing" text="Delivered" time="11:03" status="sent" />
        <ChatBubble side="outgoing" text="Read" time="11:04" status="seen" />
      </Section>

      <Section label="Group thread" description="Author name on incoming messages." flush>
        <ChatBubble
          side="incoming"
          author="Karim Elbouazri"
          text="Standup moved to 10:30."
          time="08:41"
          avatar={<Avatar name="Karim Elbouazri" size="sm" />}
        />
        <ChatBubble
          side="incoming"
          author="Amina Chaoui"
          text="Works for me."
          time="08:43"
          avatar={<Avatar name="Amina Chaoui" size="sm" />}
        />
      </Section>

      <Section label="Attachments" description="Any node, rendered above the text." flush>
        <ChatBubble
          side="outgoing"
          text="Here's the site photo."
          time="14:20"
          status="seen"
          attachments={
            <Image source={{ uri: SAMPLE_IMAGE }} style={styles.attachedImage} />
          }
        />
        <ChatBubble
          side="incoming"
          text="And the signed contract."
          time="14:25"
          avatar={<Avatar name="Sara Boudia" size="sm" />}
          attachments={
            <View style={styles.fileChip}>
              <Feather name="file-text" size={16} color={lightColors.warning} />
              <Text variant="caption" tone="secondary" numberOfLines={1}>
                contract-2026-signed.pdf
              </Text>
            </View>
          }
        />
      </Section>

      <Section
        label="Selection mode"
        description="Tap a bubble to select it. `leading` holds the checkbox."
        flush>
        {[1, 2, 3].map((id) => (
          <ChatBubble
            key={id}
            side="outgoing"
            text={`Selectable message ${id}`}
            time={`16:0${id}`}
            status="sent"
            selected={selected.includes(id)}
            onPress={() => toggle(id)}
            leading={
              <Checkbox checked={selected.includes(id)} onChange={() => toggle(id)} />
            }
          />
        ))}
      </Section>

      <Section
        label="Script direction"
        description="RTL text mirrors itself even in an LTR app."
        flush>
        <ChatBubble side="incoming" text="مرحبا، كيف يمكنني مساعدتك؟" time="17:30" />
        <ChatBubble side="outgoing" text="Thanks, all set." time="17:31" status="seen" />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  attachedImage: {
    width: 180,
    height: 120,
    borderRadius: radius.lg,
  },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
});
