import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import {
  PickerField,
  Text,
  lightColors,
  spacing,
  useToast,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function PickerFieldDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'PickerField' }} />
      <PickerFieldBody />
    </ScrollView>
  );
}

export function PickerFieldBody() {
  const toast = useToast();
  const [site, setSite] = useState<string | null>(null);
  const open = () => toast.info('Open any sheet here — options, calendar, slider.');

  return (
    <>
      <Text variant="body" tone="secondary">
        The read-only field that fronts a picker the kit does not own: remotely-fetched options, a
        date range, a numeric range. Same box, floating label and chevron as Select, so a filter
        sheet and a form read alike. Reach for Select, MultiSelect or DatePicker first — this is for
        the cases they cannot cover.
      </Text>

      <Section label="Empty and filled">
        <PickerField label="Site" value={site} onPress={() => setSite('Casablanca')} />
        <PickerField label="Function" value="Developer + 2" onPress={open} />
      </Section>

      <Section
        label="Active"
        description="Highlights a filter that is currently narrowing results.">
        <PickerField label="Seniority" value="2 - 8 years" active onPress={open} />
      </Section>

      <Section label="With a leading icon">
        <PickerField
          label="Department"
          value="People"
          leading={<Feather name="users" size={16} color={lightColors.brand} />}
          onPress={open}
        />
      </Section>

      <Section label="Placeholder instead of a label">
        <PickerField placeholder="Any date" onPress={open} />
      </Section>

      <Section label="Error and disabled">
        <PickerField label="Contract" value="" error="Pick a contract type" onPress={open} />
        <PickerField label="Society" value="MintHR" disabled onPress={open} />
      </Section>
    </>
  );
}
