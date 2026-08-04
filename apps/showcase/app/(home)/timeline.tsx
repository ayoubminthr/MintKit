import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';

import { Timeline, type TimelineItem, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

const approvalItems: TimelineItem[] = [
  {
    title: 'Request submitted',
    subtitle: 'March 3, 2025 · 10:24 AM',
    description: 'Leave request submitted by Sarah Chen.',
    status: 'done',
  },
  {
    title: 'Manager review',
    subtitle: 'March 3, 2025 · 2:10 PM',
    description: 'Approved by Marcus Webb.',
    status: 'done',
  },
  {
    title: 'HR review',
    subtitle: 'Awaiting action',
    description: 'Pending confirmation of remaining balance.',
    status: 'active',
  },
  {
    title: 'Final approval',
    status: 'pending',
  },
];

const rejectedItems: TimelineItem[] = [
  {
    title: 'Request submitted',
    subtitle: 'February 18, 2025 · 9:02 AM',
    status: 'done',
  },
  {
    title: 'Manager review',
    subtitle: 'February 18, 2025 · 4:45 PM',
    description: 'Rejected — insufficient notice period.',
    status: 'danger',
  },
  {
    title: 'HR review',
    status: 'pending',
  },
];

export default function TimelineDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Timeline' }} />
      <TimelineBody />
    </ScrollView>
  );
}

export function TimelineBody() {
  return (
    <>
      <Text variant="body" tone="secondary">
        Vertical connected list of events or steps for approval chains and audit trails. Each
        entry can carry a title, a timestamp, and a description, with a status dot for
        `done` / `active` / `pending` / `danger`.
      </Text>

      <Section label="Approval chain in progress">
        <Timeline items={approvalItems} />
      </Section>

      <Section label="Rejected step" description="`danger` marks a rejected or failed step.">
        <Timeline items={rejectedItems} />
      </Section>
    </>
  );
}
