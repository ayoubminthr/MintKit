import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import {
  Avatar,
  Badge,
  List,
  ListItem,
  ListSection,
  Switch,
  Text,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function ListItemDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'ListItem' }} />
      <ListItemBody />
    </ScrollView>
  );
}

export function ListItemBody() {
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);

  return (
    <>
      <Text variant="body" tone="secondary">
        Mobile-staple row primitive. Compose into a List for hair-line separators
        between rows; group with ListSection for headers + footer captions.
      </Text>

      <Section label="Settings list (pressable + chevron)">
        <List bordered>
          <ListItem
            title="Profile"
            subtitle="Sara Boudia"
            leading={<Avatar name="Sara Boudia" size="md" />}
            onPress={() => {}}
          />
          <ListItem title="Notifications" onPress={() => {}} />
          <ListItem title="Privacy & security" onPress={() => {}} />
          <ListItem title="Help & support" onPress={() => {}} />
        </List>
      </Section>

      <Section label="Dense (tighter rows for sheets and long lists)">
        <List bordered>
          <ListItem title="Function" trailing={<Text variant="caption" tone="muted">All</Text>} dense onPress={() => {}} />
          <ListItem title="Site" trailing={<Text variant="caption" tone="brand">Casablanca +2</Text>} dense onPress={() => {}} />
          <ListItem title="Department" trailing={<Text variant="caption" tone="muted">All</Text>} dense onPress={() => {}} />
        </List>
      </Section>

      <Section label="With trailing slots">
        <List bordered>
          <ListItem
            title="Push notifications"
            subtitle="Get alerts for new messages and mentions"
            trailing={
              <Switch value={notifications} onValueChange={setNotifications} />
            }
          />
          <ListItem
            title="Biometric unlock"
            trailing={<Switch value={biometric} onValueChange={setBiometric} />}
          />
          <ListItem
            title="Sync status"
            trailing={<Badge label="Up to date" variant="success" dot />}
          />
        </List>
      </Section>

      <Section label="Grouped sections">
        <ListSection title="Account" caption="Manage your sign-in and personal details.">
          <List bordered>
            <ListItem title="Email" subtitle="sara@minthr.com" onPress={() => {}} />
            <ListItem title="Phone number" subtitle="+212 6 12 34 56 78" onPress={() => {}} />
            <ListItem title="Password" onPress={() => {}} />
          </List>
        </ListSection>
      </Section>

      <Section label="Destructive action">
        <List bordered>
          <ListItem title="Sign out" destructive onPress={() => {}} />
          <ListItem title="Delete account" destructive onPress={() => {}} />
        </List>
      </Section>
    </>
  );
}
