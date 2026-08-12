import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Divider, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function DividerDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Divider' }} />
      <DividerBody />
    </ScrollView>
  );
}

export function DividerBody() {
  return (
    <>
      <Text variant="body" tone="secondary">
        Hair-line separator. Horizontal, vertical, or labelled. Optional spacing presets apply
        equal margins on both sides of the line.
      </Text>

      <Section label="Horizontal">
        <View>
          <Text variant="body">First section</Text>
          <Divider spacing="md" />
          <Text variant="body">Second section</Text>
          <Divider spacing="md" />
          <Text variant="body">Third section</Text>
        </View>
      </Section>

      <Section label="Labelled">
        <View>
          <Text variant="body">Active employees</Text>
          <Divider label="Or" spacing="md" />
          <Text variant="body">Active contractors</Text>
        </View>
      </Section>

      <Section label="Vertical">
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[3],
            height: 40,
          }}>
          <Text variant="body">12 invitations</Text>
          <Divider orientation="vertical" />
          <Text variant="body">3 pending</Text>
          <Divider orientation="vertical" />
          <Text variant="body">87 active</Text>
        </View>
      </Section>

      <Section label="Dashed">
        <View>
          <Text variant="body">Draft</Text>
          <Divider variant="dashed" spacing="md" />
          <Text variant="body">Submitted</Text>
        </View>
      </Section>
    </>
  );
}
