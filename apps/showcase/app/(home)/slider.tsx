import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Slider, Text, spacing } from '@minthr-saas/mobile-ui-kit';

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

  return (
    <>
      <Text variant="body" tone="secondary">
        Draggable continuous value control. Normalized 0-1 by default, or pass a custom min/max
        range.
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

      <Section label="Disabled">
        <Slider value={0.6} onChange={() => {}} disabled />
      </Section>
    </>
  );
}
