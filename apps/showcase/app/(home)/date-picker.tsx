import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

import { DatePicker, type CalendarRange, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function DatePickerScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'DatePicker' }} />
      <DatePickerBody />
    </ScrollView>
  );
}

const fmt = (d: Date | null) => (d ? d.toLocaleDateString() : '—');

export function DatePickerBody() {
  const [single, setSingle] = useState<Date | null>(null);
  const [range, setRange] = useState<CalendarRange>({ start: null, end: null });
  const [week, setWeek] = useState<CalendarRange>({ start: null, end: null });
  const [month, setMonth] = useState<{ month: number; year: number } | null>(null);

  return (
    <>
      <Section label="Single — floating label" description={fmt(single)}>
        <DatePicker mode="single" value={single} onChange={setSingle} label="Date of birth" floating />
      </Section>

      <Section
        label="Range — start and end"
        description={`${fmt(range.start)} → ${fmt(range.end)}`}>
        <DatePicker mode="range" value={range} onChange={setRange} label="Vacation period" floating title="Select period" />
      </Section>

      <Section label="Week" description={`${fmt(week.start)} → ${fmt(week.end)}`}>
        <DatePicker mode="week" value={week} onChange={setWeek} label="Shift week" floating title="Select week" />
      </Section>

      <Section label="Month" description={month ? `${month.month + 1}/${month.year}` : '—'}>
        <DatePicker mode="month" value={month} onChange={(m, y) => setMonth({ month: m, year: y })} label="Reporting month" floating title="Select month" />
      </Section>

      <Section label="With limits" description="Future dates only">
        <DatePicker mode="single" value={single} onChange={setSingle} label="Future only" floating minDate={new Date()} />
      </Section>

      <Section label="States">
        <DatePicker mode="single" value={null} onChange={() => {}} label="Disabled" floating disabled placeholder="Cannot pick" />
        <DatePicker mode="single" value={null} onChange={() => {}} label="With error" floating error="Date is required" />
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
