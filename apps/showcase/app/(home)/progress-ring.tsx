import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ProgressRing, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function ProgressRingDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'ProgressRing' }} />
      <ProgressRingBody />
    </ScrollView>
  );
}

export function ProgressRingBody() {
  const [v, setV] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setV((prev) => (prev >= 1 ? 0 : Math.min(1, prev + 0.05)));
    }, 250);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Text variant="body" tone="secondary">
        Circular value indicator (0–1). Draws with two concentric SVG rings — a background track
        and a brand-colored sweep — starting at 12 o'clock. Use for compact completion states
        where a linear `ProgressBar` would take up too much space.
      </Text>

      <Section label="Static values">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[5] }}>
          <Block value={0} />
          <Block value={0.25} />
          <Block value={0.5} />
          <Block value={0.75} />
          <Block value={1} />
        </View>
      </Section>

      <Section label="With label">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[5] }}>
          <ProgressRing value={0.32} label="32%" />
          <ProgressRing value={0.68} label="68%" />
          <ProgressRing value={1} label="Done" />
        </View>
      </Section>

      <Section label="Sizes">
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing[5] }}>
          <ProgressRing value={0.6} size={32} strokeWidth={4} />
          <ProgressRing value={0.6} size={48} strokeWidth={5} />
          <ProgressRing value={0.6} size={64} label="60%" />
          <ProgressRing value={0.6} size={96} strokeWidth={8} label="60%" />
        </View>
      </Section>

      <Section label="Stroke width">
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing[5] }}>
          <ProgressRing value={0.45} strokeWidth={2} />
          <ProgressRing value={0.45} strokeWidth={6} />
          <ProgressRing value={0.45} strokeWidth={10} />
          <ProgressRing value={0.45} strokeWidth={14} />
        </View>
      </Section>

      <Section label="Animated (auto-incrementing)">
        <ProgressRing value={v} size={96} strokeWidth={8} label={`${Math.round(v * 100)}%`} />
      </Section>
    </>
  );
}

function Block({ value }: { value: number }) {
  return (
    <View style={{ alignItems: 'center', gap: spacing[1] }}>
      <ProgressRing value={value} label={`${Math.round(value * 100)}%`} />
      <Text variant="caption" tone="muted">
        {Math.round(value * 100)}%
      </Text>
    </View>
  );
}
