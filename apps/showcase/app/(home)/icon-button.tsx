import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { IconButton, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function IconButtonDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'IconButton' }} />
      <IconButtonBody />
    </ScrollView>
  );
}

export function IconButtonBody() {
  return (
    <>
      <Text variant="body" tone="secondary">
        Icon-only pressable. Must always carry an `accessibilityLabel` describing the action — the
        icon alone is not enough for screen readers.
      </Text>

      <Section label="Variants">
        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
          <IconButton icon="check" accessibilityLabel="Save" variant="primary" onPress={() => {}} />
          <IconButton
            icon="edit-2"
            accessibilityLabel="Edit"
            variant="secondary"
            onPress={() => {}}
          />
          <IconButton
            icon="more-horizontal"
            accessibilityLabel="More actions"
            variant="ghost"
            onPress={() => {}}
          />
          <IconButton
            icon="trash-2"
            accessibilityLabel="Delete"
            variant="danger"
            onPress={() => {}}
          />
          <IconButton
            icon="arrow-left"
            accessibilityLabel="Go back"
            variant="tint"
            onPress={() => {}}
          />
        </View>
      </Section>

      <Section label="Sizes">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          <IconButton icon="bell" accessibilityLabel="Notifications" size="sm" onPress={() => {}} />
          <IconButton icon="bell" accessibilityLabel="Notifications" size="md" onPress={() => {}} />
          <IconButton icon="bell" accessibilityLabel="Notifications" size="lg" onPress={() => {}} />
        </View>
      </Section>

      <Section label="Disabled">
        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
          <IconButton icon="check" accessibilityLabel="Save" variant="primary" disabled />
          <IconButton icon="edit-2" accessibilityLabel="Edit" variant="secondary" disabled />
          <IconButton icon="trash-2" accessibilityLabel="Delete" variant="danger" disabled />
        </View>
      </Section>
    </>
  );
}
