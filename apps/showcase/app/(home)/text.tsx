import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Text, lightColors, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function TextDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Text' }} />
      <TextBody />
    </ScrollView>
  );
}

export function TextBody() {
  return (
    <>
      <Text variant="body" tone="secondary">
        Five variants × six tones. Sentence case only — never ALL CAPS.
      </Text>

      <Section label="Variants">
        <View style={{ gap: spacing[2] }}>
          <Text variant="title">Title — 18 / medium</Text>
          <Text variant="subtitle">Subtitle — 16 / medium</Text>
          <Text variant="body">Body — 14 / regular</Text>
          <Text variant="caption">Caption — 12 / regular</Text>
          <Text variant="mono">mono.font.example()</Text>
        </View>
      </Section>

      <Section label="Tones">
        <View style={{ gap: spacing[2] }}>
          <Text tone="primary">Primary — strongest reading text</Text>
          <Text tone="secondary">Secondary — supporting copy</Text>
          <Text tone="muted">Muted — labels, captions</Text>
          <View style={{ backgroundColor: lightColors.brand, padding: spacing[2] }}>
            <Text tone="inverse">Inverse — on brand surface</Text>
          </View>
          <Text tone="brand">Brand — links, emphasis</Text>
          <Text tone="danger">Danger — error messages</Text>
        </View>
      </Section>

      <Section label="Composition">
        <View style={{ gap: spacing[1] }}>
          <Text variant="title">Quarterly review</Text>
          <Text variant="subtitle" tone="secondary">
            Nine pulse questions
          </Text>
          <Text variant="body" tone="secondary">
            Covering team health, leadership, and the rollout of the new onboarding flow.
          </Text>
        </View>
      </Section>

      <Section label="Scaling">
        <View style={{ gap: spacing[2] }}>
          <Text variant="caption" tone="muted">
            Every size is scaled to the device (mirrors the app's RFValue), relative to a
            680dp guideline height. Pass scaled={'{false}'} to pin a fixed size.
          </Text>
          <Text>Responsive — scales with screen height (default)</Text>
          <Text scaled={false}>Fixed — never scales</Text>
        </View>
      </Section>
    </>
  );
}
