import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Input, Text, lightColors, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function InputDemo() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Input' }} />
      <InputBody />
    </ScrollView>
  );
}

export function InputBody() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');
  const [password, setPassword] = useState('');
  const [floatingValue, setFloatingValue] = useState('');
  const [stackedValue, setStackedValue] = useState('');

  return (
    <>
      <Text variant="body" tone="secondary">
        Single-line text field. Optional label, hint, error, and `leftIcon` / `rightIcon` slots.
        Border switches to brand on focus. `label` renders as a notch above the border; add
        `floating` to animate it between a resting placeholder-like position and the notch. Pass
        `labelPlacement="stacked"` to render it as a plain line of text above the field instead.
        `secureTextEntry` gets a built-in show/hide toggle for free.
      </Text>

      <Section label="Plain">
        <Input placeholder="Type something" />
      </Section>

      <Section label="With label and hint">
        <Input
          label="Full name"
          placeholder="Jane Doe"
          value={name}
          onChangeText={setName}
          hint="Used on your profile and HR documents."
        />
      </Section>

      <Section label="With error">
        <Input
          label="Email"
          placeholder="name@minthr.com"
          value={email}
          onChangeText={setEmail}
          error="Email is required."
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </Section>

      <Section label="With left icon">
        <Input
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Feather name="search" size={14} color={lightColors.textMuted} />}
        />
      </Section>

      <Section label="Password (built-in show/hide toggle)">
        <Input
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </Section>

      <Section label="Floating label">
        <Input
          label="Job title"
          value={floatingValue}
          onChangeText={setFloatingValue}
          floating
        />
      </Section>

      <Section label="Stacked label">
        <Input
          label="Identifier"
          labelPlacement="stacked"
          placeholder="your.name@company.com"
          value={stackedValue}
          onChangeText={setStackedValue}
        />
      </Section>

      <Section label="Both icons">
        <Input
          label="Workspace URL"
          placeholder="acme"
          leftIcon={<Feather name="link" size={14} color={lightColors.textMuted} />}
          rightIcon={
            <Text variant="caption" tone="muted">
              .minthr.com
            </Text>
          }
        />
      </Section>

      <Section label="Disabled">
        <View style={{ gap: spacing[2] }}>
          <Input label="Department" value="Operations" editable={false} />
        </View>
      </Section>

      <Section label="Multiline">
        <Input
          label="Notes"
          placeholder="Add any additional context..."
          multiline
          numberOfLines={4}
        />
      </Section>
    </>
  );
}
