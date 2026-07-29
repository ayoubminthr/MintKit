import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { Card, IconButton, SheetHeader, Text, lightColors, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function SheetHeaderDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'SheetHeader' }} />
      <SheetHeaderBody />
    </ScrollView>
  );
}

export function SheetHeaderBody() {
  return (
    <>
      <Text variant="body" tone="secondary">
        The shared header rendered at the top of every BottomSheet — title, optional
        brand-colored count, and a close button. Pass it directly as a sheet's header
        component.
      </Text>

      <Section label="Title only">
        <Card padding="none">
          <SheetHeader title="Filters" onClose={() => {}} />
        </Card>
      </Section>

      <Section label="With count">
        <Card padding="none">
          <SheetHeader title="Requests" count={12} onClose={() => {}} />
        </Card>
      </Section>

      <Section label="With right action">
        <Card padding="none">
          <SheetHeader
            title="Task details"
            onClose={() => {}}
            rightActions={
              <IconButton icon="edit-2" accessibilityLabel="Edit" variant="ghost" size="sm" />
            }
          />
        </Card>
      </Section>

      <Section label="With left accessory">
        <Card padding="none">
          <SheetHeader
            title="Employee"
            onClose={() => {}}
            leftAccessory={
              <View style={{ marginEnd: spacing[1] }}>
                <Feather name="user" size={16} color={lightColors.brand} />
              </View>
            }
          />
        </Card>
      </Section>

      <Section label="With subtitle">
        <Card padding="none">
          <SheetHeader title="Version 3" subtitle="Effective 12/03/2026" onClose={() => {}} />
        </Card>
      </Section>

      <Section label="Close only, no title">
        <Card padding="none">
          <SheetHeader onClose={() => {}} />
        </Card>
      </Section>
    </>
  );
}
