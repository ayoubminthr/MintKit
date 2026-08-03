import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { MonthPicker, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function MonthPickerDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'MonthPicker' }} />
      <MonthPickerBody />
    </ScrollView>
  );
}

export function MonthPickerBody() {
  const [value, setValue] = useState<{ month: number; year: number } | null>(null);

  return (
    <>
      <Text variant="body" tone="secondary">
        Month + year grid picker for reporting periods and monthly filters. Pair with
        DatePicker mode=&quot;month&quot; for a ready-made field + sheet, or embed inline as below.
      </Text>

      <Section
        label="Picked month"
        description={value ? `${value.month + 1}/${value.year}` : 'None selected'}>
        <MonthPicker value={value} onChange={(month, year) => setValue({ month, year })} />
      </Section>

      <Section label="Bounded years" description="2020–2026 only">
        <MonthPicker
          value={value}
          onChange={(month, year) => setValue({ month, year })}
          minYear={2020}
          maxYear={2026}
        />
      </Section>
    </>
  );
}
