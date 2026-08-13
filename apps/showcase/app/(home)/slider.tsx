import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Slider, type SliderRange, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function SliderDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Slider' }} />
      <SliderBody />
    </ScrollView>
  );
}

export function SliderBody() {
  const [volume, setVolume] = useState(0.4);
  const [brightness, setBrightness] = useState(70);
  const [seniority, setSeniority] = useState(5);
  const [fillRate, setFillRate] = useState<SliderRange>({ start: 20, end: 80 });

  return (
    <>
      <Text variant="body" tone="secondary">
        Draggable value control. Normalized 0-1 by default, or pass a custom min/max range. Add
        `step` to snap, or `mode="range"` for two thumbs.
      </Text>

      <Section label="Default (0-1)">
        <View style={{ gap: spacing[2] }}>
          <Text variant="caption" tone="muted">
            {Math.round(volume * 100)}%
          </Text>
          <Slider value={volume} onChange={setVolume} accessibilityLabel="Volume" />
        </View>
      </Section>

      <Section label="Custom range">
        <View style={{ gap: spacing[2] }}>
          <Text variant="caption" tone="muted">
            {Math.round(brightness)}
          </Text>
          <Slider
            value={brightness}
            min={0}
            max={100}
            onChange={setBrightness}
            accessibilityLabel="Brightness"
          />
        </View>
      </Section>

      <Section label="Stepped (0-20, step 1)">
        <View style={{ gap: spacing[2] }}>
          <Text variant="caption" tone="muted">
            {seniority} years
          </Text>
          <Slider
            value={seniority}
            min={0}
            max={20}
            step={1}
            onChange={setSeniority}
            accessibilityLabel="Seniority"
          />
        </View>
      </Section>

      <Section label="Range">
        <View style={{ gap: spacing[2] }}>
          <Text variant="caption" tone="muted">
            {fillRate.start}% – {fillRate.end}%
          </Text>
          <Slider
            mode="range"
            value={fillRate}
            min={0}
            max={100}
            step={1}
            onChange={setFillRate}
            accessibilityLabel="Profile completion"
          />
        </View>
      </Section>

      <Section label="Disabled">
        <Slider value={0.6} onChange={() => {}} disabled />
      </Section>

      <Section label="Range, disabled">
        <Slider mode="range" value={{ start: 0.25, end: 0.75 }} onChange={() => {}} disabled />
      </Section>
    </>
  );
}
