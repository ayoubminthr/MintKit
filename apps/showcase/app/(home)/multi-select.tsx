import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

import { MultiSelect, Text, spacing } from '@minthr-saas/mobile-ui-kit';

const OPTIONS = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Nuxt.js', value: 'nuxtjs' },
  { label: 'Remix', value: 'remix' },
];

export default function MultiSelectScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'MultiSelect' }} />
      <MultiSelectBody />
    </ScrollView>
  );
}

export function MultiSelectBody() {
  const [values, setValues] = useState<string[]>([]);
  const [limitedValues, setLimitedValues] = useState<string[]>([]);
  const [chipValues, setChipValues] = useState<string[]>(['react', 'vue']);

  return (
    <>
      <View style={styles.section}>
        <Text variant="subtitle">Chips trigger</Text>
        <Text variant="body" tone="secondary">
          Renders selected values as removable chips instead of a summary count.
        </Text>
        <MultiSelect
          placeholder="Select technologies"
          options={OPTIONS}
          values={chipValues}
          onChange={setChipValues}
          allowSelectAll
          chips
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Basic MultiSelect</Text>
        <Text variant="body" tone="secondary">
          Searchable multi-select list with select all.
        </Text>
        <MultiSelect
          placeholder="Select technologies"
          options={OPTIONS}
          values={values}
          onChange={setValues}
          allowSelectAll
        />
        {values.length > 0 && (
          <Text variant="caption" tone="brand">
            Selected: {values.join(', ')}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Max Selections</Text>
        <Text variant="body" tone="secondary">
          Limited to 3 selections.
        </Text>
        <MultiSelect
          placeholder="Pick up to 3"
          options={OPTIONS}
          values={limitedValues}
          onChange={setLimitedValues}
          maxSelections={3}
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Custom Summary Label</Text>
        <MultiSelect
          placeholder="Custom label"
          options={OPTIONS}
          values={values}
          onChange={setValues}
          summaryLabel={(n) => `${n} items picked`}
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Disabled & Error</Text>
        <MultiSelect
          placeholder="Disabled"
          options={OPTIONS}
          disabled
        />
        <MultiSelect
          placeholder="With Error"
          options={OPTIONS}
          error="Selection required"
        />
      </View>
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
  section: {
    gap: spacing[2],
  },
});
