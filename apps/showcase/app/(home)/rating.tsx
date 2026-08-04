import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Rating, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function RatingDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Rating' }} />
      <RatingBody />
    </ScrollView>
  );
}

export function RatingBody() {
  const [value, setValue] = useState(3);

  return (
    <>
      <Text variant="body" tone="secondary">
        A row of stars representing a 0–5 score. Fractional values (e.g. 3.7) partially fill the
        next star. Read-only by default — pass `onChange` to make it tappable.
      </Text>

      <Section label="Fractional values">
        <View style={{ gap: spacing[3] }}>
          <Block label="0" value={0} />
          <Block label="2.5" value={2.5} />
          <Block label="3.7" value={3.7} />
          <Block label="4.2" value={4.2} />
          <Block label="5" value={5} />
        </View>
      </Section>

      <Section label="Sizes">
        <View style={{ gap: spacing[3] }}>
          <Rating value={3.5} size="sm" />
          <Rating value={3.5} size="md" />
          <Rating value={3.5} size="lg" />
        </View>
      </Section>

      <Section label="Interactive">
        <View style={{ gap: spacing[2] }}>
          <Rating value={value} onChange={setValue} size="lg" />
          <Text variant="caption" tone="muted">
            Current rating: {value} out of 5
          </Text>
        </View>
      </Section>

      <Section label="Read-only, larger scale (0–10)">
        <Rating value={7.5} max={10} readonly />
      </Section>
    </>
  );
}

function Block({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
      <Text variant="caption" tone="muted" style={{ width: 24 }}>
        {label}
      </Text>
      <Rating value={value} />
    </View>
  );
}
