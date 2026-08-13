import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Tabs, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function TabsDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Tabs' }} />
      <TabsBody />
    </ScrollView>
  );
}

export function TabsBody() {
  const [tab, setTab] = useState<'overview' | 'reviews' | 'compensation' | 'documents'>(
    'overview',
  );
  const [filter, setFilter] = useState<'all' | 'mine' | 'archived'>('all');
  const [step, setStep] = useState<'summary' | 'people' | 'payroll'>('summary');

  return (
    <>
      <Text variant="body" tone="secondary">
        Underline-style tabs for in-page sub-navigation. Different from the bottom tab bar — use
        these inside a screen to switch between related views.
      </Text>

      <Section label="Profile sections">
        <Tabs
          options={[
            { value: 'overview', label: 'Overview' },
            { value: 'reviews', label: 'Reviews' },
            { value: 'compensation', label: 'Compensation' },
            { value: 'documents', label: 'Documents' },
          ]}
          value={tab}
          onChange={setTab}
        />
        <View style={{ paddingTop: spacing[3] }}>
          <Text variant="caption" tone="muted">
            Selected: {tab}
          </Text>
        </View>
      </Section>

      <Section label="Two tabs (horizontal scroll disabled)">
        <Tabs
          scrollable={false}
          options={[
            { value: 'all', label: 'All' },
            { value: 'mine', label: 'Mine' },
            { value: 'archived', label: 'Archived' },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </Section>

      <Section label="Icons and locked tabs">
        <Tabs
          scrollable={false}
          options={[
            { value: 'summary', icon: 'home' },
            { value: 'people', label: 'People', icon: 'users' },
            { value: 'payroll', label: 'Payroll', disabled: true },
          ]}
          value={step}
          onChange={setStep}
        />
        <Text variant="caption" tone="muted">
          A tab with an icon and no label renders icon-only; disabled dims it and blocks selection —
          use it for steps the user has not unlocked yet.
        </Text>
      </Section>
    </>
  );
}
