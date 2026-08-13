import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { SegmentedControl, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function SegmentedControlDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'SegmentedControl' }} />
      <SegmentedControlBody />
    </ScrollView>
  );
}

export function SegmentedControlBody() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [tab, setTab] = useState<'all' | 'mine' | 'archived'>('all');

  return (
    <>
      <Text variant="body" tone="secondary">
        Pick-one selector with a pill-style track. Up to ~4 short labels — beyond that, prefer
        Tabs or a Select.
      </Text>

      <Section label="Time range (full width — default)">
        <SegmentedControl
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]}
          value={period}
          onChange={setPeriod}
        />
        <Text variant="caption" tone="muted">
          Selected: {period}
        </Text>
      </Section>

      <Section label="Two options (auto width)">
        <SegmentedControl
          options={[
            { value: 'list', label: 'List' },
            { value: 'grid', label: 'Grid' },
          ]}
          value={view}
          onChange={setView}
          fullWidth={false}
        />
      </Section>

      <Section label="Icon-only (view switcher)">
        <SegmentedControl
          options={[
            { value: 'list', icon: 'list' },
            { value: 'grid', icon: 'grid' },
          ]}
          value={view}
          onChange={setView}
          fullWidth={false}
        />
        <Text variant="caption" tone="muted">
          A segment with an icon and no label renders icon-only. Segments also take their own
          disabled flag.
        </Text>
      </Section>

      <Section label="Disabled">
        <SegmentedControl
          options={[
            { value: 'all', label: 'All' },
            { value: 'mine', label: 'Mine' },
            { value: 'archived', label: 'Archived' },
          ]}
          value={tab}
          onChange={setTab}
          disabled
        />
      </Section>
    </>
  );
}
