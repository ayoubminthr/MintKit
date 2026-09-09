import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  Avatar,
  borders,
  Card,
  lightColors,
  radius,
  spacing,
  SwipeableRow,
  Text,
  useToast,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

interface Person {
  id: string;
  name: string;
  role: string;
}

const SEED: Person[] = [
  { id: '1', name: 'Sara Boudia', role: 'Engineering Manager' },
  { id: '2', name: 'Yassine Amrani', role: 'Product Designer' },
  { id: '3', name: 'Lina Idrissi', role: 'HR Business Partner' },
  { id: '4', name: 'Mehdi Tazi', role: 'Senior Engineer' },
];

export default function SwipeableRowDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'SwipeableRow' }} />
      <SwipeableRowBody />
    </ScrollView>
  );
}

export function SwipeableRowBody() {
  const toast = useToast();
  const [people, setPeople] = useState<Person[]>(SEED);

  function handleArchive(person: Person) {
    toast.success(`${person.name} archived`);
  }

  function handleDelete(person: Person) {
    setPeople((prev) => prev.filter((p) => p.id !== person.id));
    toast.danger(`${person.name} removed`);
  }

  function handlePin(person: Person) {
    toast.info(`Pinned ${person.name}`);
  }

  return (
    <>
      <Text variant="body" tone="secondary">
        Swipe each row left to delete, right to pin. Uses react-native-gesture-handler. There
        is no real web equivalent — touchscreens make this gesture natural.
      </Text>

      <Section label="People">
        {people.length === 0 ? (
          <Text variant="caption" tone="muted">
            All rows removed. Re-open this screen to reset.
          </Text>
        ) : (
          <View style={styles.list}>
            {people.map((person) => (
              <SwipeableRow
                key={person.id}
                leftActions={[
                  { icon: 'star', color: 'brand', label: 'Pin', onPress: () => handlePin(person) },
                ]}
                rightActions={[
                  {
                    icon: 'archive',
                    color: 'warning',
                    label: 'Archive',
                    onPress: () => handleArchive(person),
                  },
                  {
                    icon: 'trash-2',
                    color: 'danger',
                    label: 'Delete',
                    onPress: () => handleDelete(person),
                  },
                ]}>
                <View style={styles.row}>
                  <Avatar name={person.name} size="md" />
                  <View style={{ flex: 1 }}>
                    <Text variant="body">{person.name}</Text>
                    <Text variant="caption" tone="muted">
                      {person.role}
                    </Text>
                  </View>
                </View>
              </SwipeableRow>
            ))}
          </View>
        )}
      </Section>

      <Section
        label="One open at a time"
        description="Rows sharing a `group` close each other. Open one, then swipe another.">
        <View style={styles.list}>
          {SEED.slice(0, 3).map((person) => (
            <SwipeableRow
              key={person.id}
              group="demo-inbox"
              rightActions={[
                {
                  icon: 'trash-2',
                  color: 'danger',
                  label: 'Delete',
                  onPress: () => toast.danger(`${person.name} removed`),
                },
              ]}>
              <View style={styles.row}>
                <Avatar name={person.name} size="md" />
                <Text variant="body" style={{ flex: 1 }}>
                  {person.name}
                </Text>
              </View>
            </SwipeableRow>
          ))}
        </View>
      </Section>

      <Section label="Single-action (delete only)">
        <SwipeableRow
          rightActions={[
            {
              icon: 'trash-2',
              color: 'danger',
              onPress: () => toast.danger('Deleted'),
            },
          ]}>
          <Card>
            <Text variant="body">Swipe me left ←</Text>
          </Card>
        </SwipeableRow>
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    borderWidth: borders.hair,
    borderColor: lightColors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: lightColors.surfacePrimary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: lightColors.surfacePrimary,
    borderBottomWidth: borders.hair,
    borderBottomColor: lightColors.border,
  },
});
