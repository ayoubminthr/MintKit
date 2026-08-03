import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';

import {
  Calendar,
  type CalendarRange,
  Text,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function CalendarDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Calendar' }} />
      <CalendarBody />
    </ScrollView>
  );
}

export function CalendarBody() {
  const [single, setSingle] = useState<Date | null>(null);
  const [range, setRange] = useState<CalendarRange>({ start: null, end: null });
  const [week, setWeek] = useState<CalendarRange>({ start: null, end: null });
  const [multi, setMulti] = useState<readonly Date[]>([]);

  const fmt = (d: Date | null) => (d ? d.toLocaleDateString() : '—');

  // Block weekends in the third demo to show disabled dates
  const blockedWeekends = useMemo(() => {
    const out: Date[] = [];
    const now = new Date();
    for (let i = -15; i < 30; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      if (d.getDay() === 0 || d.getDay() === 6) out.push(d);
    }
    return out;
  }, []);

  return (
    <>
      <Text variant="body" tone="secondary">
        Inline month-view date picker — single, range, week, or multi selection.
        Use for scheduling, leave requests, and time-off bookings.
      </Text>

      <Section
        label="Single — picked date"
        description={fmt(single)}>
        <Calendar value={single} onChange={setSingle} />
      </Section>

      <Section
        label="Range — start and end"
        description={`${fmt(range.start)} → ${fmt(range.end)}`}>
        <Calendar mode="range" value={range} onChange={setRange} />
      </Section>

      <Section
        label="Week — tap any day to select its week"
        description={`${fmt(week.start)} → ${fmt(week.end)}`}>
        <Calendar mode="week" value={week} onChange={setWeek} />
      </Section>

      <Section
        label="Multi — pick several days"
        description={`${multi.length} selected`}>
        <Calendar mode="multi" value={multi} onChange={setMulti} />
      </Section>

      <Section
        label="Disabled weekends"
        description="Mon–Fri only">
        <Calendar
          value={single}
          onChange={setSingle}
          disabledDates={blockedWeekends}
        />
      </Section>
    </>
  );
}
