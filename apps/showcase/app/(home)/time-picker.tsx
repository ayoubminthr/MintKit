import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

import { TimePicker, type TimeRange, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function TimePickerScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'TimePicker' }} />
      <TimePickerBody />
    </ScrollView>
  );
}

const fmt = (d: Date | null) => (d ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—');

export function TimePickerBody() {
  const [time, setTime] = useState<Date | null>(null);
  const [range, setRange] = useState<TimeRange>({ start: null, end: null });

  return (
    <>
      <Section label="Single — floating label" description={fmt(time)}>
        <TimePicker mode="single" value={time} onChange={setTime} label="Meeting time" floating />
      </Section>

      <Section
        label="Range — start and end"
        description={`${fmt(range.start)} → ${fmt(range.end)}`}>
        <TimePicker mode="range" value={range} onChange={setRange} label="Working hours" floating title="Select hours" />
      </Section>

      <Section label="States">
        <TimePicker mode="single" value={null} onChange={() => {}} label="Disabled" floating disabled placeholder="Cannot pick" />
        <TimePicker mode="single" value={null} onChange={() => {}} label="With error" floating error="Time is required" />
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: spacing[4],
    gap: spacing[6],
  },
});
