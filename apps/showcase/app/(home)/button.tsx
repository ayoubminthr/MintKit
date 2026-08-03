import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function ButtonDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Button' }} />
      <ButtonBody />
    </ScrollView>
  );
}

export function ButtonBody() {
  return (
    <>
      <Text variant="body" tone="secondary">
        Pressable action. 6 variants × 3 sizes, with disabled, full-width, and loading states.
      </Text>

      <Section label="Variants">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
          <Button label="Primary" variant="primary" onPress={() => {}} />
          <Button label="Secondary" variant="secondary" onPress={() => {}} />
          <Button label="Ghost" variant="ghost" onPress={() => {}} />
          <Button label="Danger" variant="danger" onPress={() => {}} />
          <Button label="Danger ghost" variant="danger-ghost" onPress={() => {}} />
          <Button label="Link" variant="link" onPress={() => {}} />
        </View>
      </Section>

      <Section label="Sizes">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          <Button label="Small" size="sm" onPress={() => {}} />
          <Button label="Medium" size="md" onPress={() => {}} />
          <Button label="Large" size="lg" onPress={() => {}} />
        </View>
      </Section>

      <Section label="States">
        <View style={{ gap: spacing[3] }}>
          <Button label="Disabled primary" disabled onPress={() => {}} />
          <Button label="Disabled secondary" variant="secondary" disabled onPress={() => {}} />
          <Button label="Full width" fullWidth onPress={() => {}} />
        </View>
      </Section>

      <Section label="Loading">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
          <Button label="Primary" variant="primary" loading onPress={() => {}} />
          <Button label="Secondary" variant="secondary" loading onPress={() => {}} />
          <Button label="Danger" variant="danger" loading onPress={() => {}} />
        </View>
      </Section>
    </>
  );
}
