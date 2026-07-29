import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  BottomTabBar,
  type BottomTabBarItem,
  Card,
  lightColors,
  spacing,
  Text,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

type TabKey = 'home' | 'inbox' | 'add' | 'profile' | 'settings';

const ITEMS: readonly BottomTabBarItem<TabKey>[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'inbox', label: 'Inbox', icon: 'inbox', badge: 3 },
  { key: 'add', label: 'New', icon: 'plus', kind: 'primary' },
  { key: 'profile', label: 'Profile', icon: 'user', badge: true },
  { key: 'settings', label: 'Settings', icon: 'settings', disabled: true },
];

const COPY: Record<TabKey, { title: string; body: string }> = {
  home: { title: 'Home', body: 'Welcome back. Pulse survey closes Friday.' },
  inbox: { title: 'Inbox', body: '3 unread messages waiting.' },
  add: { title: 'New', body: 'Floating action — start something new.' },
  profile: { title: 'Profile', body: 'Your profile and preferences.' },
  settings: { title: 'Settings', body: '(Disabled — try the other tabs.)' },
};

export default function BottomTabBarDemo() {
  return (
    <>
      <Stack.Screen options={{ title: 'BottomTabBar' }} />
      <BottomTabBarBody />
    </>
  );
}

export function BottomTabBarBody() {
  const [active, setActive] = useState<TabKey>('home');

  return (
    <View style={styles.root}>

      <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
        <Text variant="body" tone="secondary">
          Persistent bottom navigation bar. Renders a row of icon + label tab items with
          numeric / dot badges and active-tint styling. The bar itself is flat chrome; mark
          one item `kind: &apos;primary&apos;` to dock a floating action button into the row —
          it lifts above the top edge and a page-colored ring carves it out of the bar. No
          shadow (Rule 1). Wire it up with local state, or pass it as `tabBar` to a
          @react-navigation/bottom-tabs Navigator.
        </Text>

        <Section label="Controlled demo">
          <Card>
            <Text variant="subtitle">{COPY[active].title}</Text>
            <Text variant="body" tone="secondary">
              {COPY[active].body}
            </Text>
          </Card>
          <Text variant="caption" tone="muted">
            Active key: {active}
          </Text>
        </Section>

        <Section label="Compact variant (icon-only)">
          <View style={styles.compactPreview}>
            <BottomTabBar
              variant="compact"
              items={[
                { key: 'home', label: 'Home', icon: 'home' },
                { key: 'search', label: 'Search', icon: 'search' },
                { key: 'inbox', label: 'Inbox', icon: 'inbox', badge: 12 },
                { key: 'profile', label: 'Profile', icon: 'user', badge: true },
              ]}
              active="home"
              onChange={() => {}}
            />
          </View>
        </Section>

        <Section label="Floating primary action (5-tab layout)">
          <View style={styles.floatingPreview}>
            <BottomTabBar
              items={[
                { key: 'home', label: 'Home', icon: 'home' },
                { key: 'team', label: 'Team', icon: 'users' },
                { key: 'add', label: 'New', icon: 'plus', kind: 'primary' },
                { key: 'inbox', label: 'Inbox', icon: 'message-square', badge: 2 },
                { key: 'help', label: 'Help', icon: 'help-circle' },
              ]}
              active="home"
              onChange={() => {}}
            />
          </View>
        </Section>

        <Section label="Compact — floating action, icon-only">
          <View style={styles.floatingPreview}>
            <BottomTabBar
              variant="compact"
              items={[
                { key: 'home', label: 'Home', icon: 'home' },
                { key: 'team', label: 'Team', icon: 'users' },
                { key: 'add', label: 'New', icon: 'plus', kind: 'primary' },
                { key: 'inbox', label: 'Inbox', icon: 'message-square', badge: 2 },
                { key: 'help', label: 'Help', icon: 'help-circle' },
              ]}
              active="home"
              onChange={() => {}}
            />
          </View>
        </Section>
      </ScrollView>

      <BottomTabBar items={ITEMS} active={active} onChange={setActive} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: lightColors.surfacePage,
  },
  compactPreview: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: lightColors.border,
  },
  // Extra top room + visible overflow so the lifted floating button isn't clipped.
  floatingPreview: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: lightColors.border,
    paddingTop: spacing[6],
  },
});
