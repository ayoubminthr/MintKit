import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { FormField, Select, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

const departments = [
  { value: 'engineering', label: 'Engineering', description: 'Builds and maintains the platform.' },
  { value: 'people', label: 'People', description: 'HR, talent, and culture.' },
  { value: 'sales', label: 'Sales' },
  { value: 'success', label: 'Customer success' },
  { value: 'finance', label: 'Finance' },
  { value: 'design', label: 'Design' },
];

const tz = [
  { value: 'casablanca', label: 'Africa / Casablanca (GMT+1)' },
  { value: 'paris', label: 'Europe / Paris (GMT+2)' },
  { value: 'london', label: 'Europe / London (GMT+1)' },
  { value: 'utc', label: 'UTC' },
  { value: 'newyork', label: 'America / New York (GMT-4)' },
];

export default function SelectDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Select' }} />
      <SelectBody />
    </ScrollView>
  );
}

export function SelectBody() {
  const [dept, setDept] = useState<string | null>(null);
  const [tzValue, setTzValue] = useState<string | null>('casablanca');

  return (
    <>
      <Text variant="body" tone="secondary">
        Tap to open a BottomSheet of options — idiomatic on mobile, far more accessible than a
        native picker for descriptive labels.
      </Text>

      <Section label="Empty state with FormField">
        <FormField label="Department" required hint="Used to scope your invitations.">
          <Select
            options={departments}
            value={dept}
            onChange={setDept}
            title="Choose department"
            placeholder="Pick one..."
          />
        </FormField>
      </Section>

      <Section label="Pre-selected">
        <FormField label="Time zone">
          <Select
            options={tz}
            value={tzValue}
            onChange={setTzValue}
            title="Choose time zone"
          />
        </FormField>
      </Section>

      <Section label="Error state">
        <FormField label="Department" error="Pick a department to continue.">
          <Select
            options={departments}
            value={null}
            onChange={() => {}}
            title="Choose department"
            error="required"
          />
        </FormField>
      </Section>

      <Section label="Disabled">
        <Select
          options={departments}
          value="people"
          onChange={() => {}}
          title="Choose department"
          disabled
        />
      </Section>

      <Section label="Floating label (matches Input)">
        <Select
          options={departments}
          value={dept}
          onChange={setDept}
          title="Choose department"
          label="Department"
          floating
        />
      </Section>
    </>
  );
}
