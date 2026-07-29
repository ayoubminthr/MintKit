import { Stack } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  IconButton,
  List,
  ListItem,
  PageShell,
  spacing
} from '@minthr-saas/mobile-ui-kit';

const REQUESTS = [
  { name: 'Sara Boudia', detail: 'Annual leave · May 12–16' },
  { name: 'Yassine Amrani', detail: 'Sick leave · May 9' },
  { name: 'Lina Idrissi', detail: 'Remote day · May 14' },
  { name: 'Mehdi Tazi', detail: 'Annual leave · May 20–24' },
];

export default function PageShellDemo() {
  return (
    <>
      <Stack.Screen options={{ title: 'PageShell', headerShown: false }} />
      <PageShellBody />
    </>
  );
}

export function PageShellBody() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 900));
    setRefreshing(false);
  }, []);

  return (
    <PageShell
      icon="users"
      title="Leave requests"
      headerActions={
        <>
          <IconButton
            icon="filter"
            variant="ghost"
            size="sm"
            accessibilityLabel="Filter"
            onPress={() => {}}
          />
        </>
      }
      refreshing={refreshing}
      onRefresh={onRefresh}
      primaryAction={{ label: 'New request', icon: 'plus', onPress: () => {} }}>

      <List bordered style={{ marginTop: spacing[4] }}>
        {REQUESTS.map((r) => (
          <ListItem key={r.name} title={r.name} subtitle={r.detail} onPress={() => {}} />
        ))}
      </List>

    </PageShell>
  );
}
