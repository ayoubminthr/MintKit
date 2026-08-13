import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';

import { Card, StatGrid, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function StatGridDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'StatGrid' }} />
      <StatGridBody />
    </ScrollView>
  );
}

export function StatGridBody() {
  return (
    <>
      <Text variant="body" tone="secondary">
        Several related metrics inside one surface — the counterpart to `StatCard`, which is one
        metric per card. Tiles are tinted blocks with no border, wrap on a `columns` basis, and
        become drill-in targets when given `onPress`.
      </Text>

      <Section label="Two columns">
        <Card>
          <StatGrid
            items={[
              { label: 'Taken', value: 12, tone: 'neutral' },
              { label: 'Remaining', value: 6, tone: 'success' },
              { label: 'On hold', value: 3.5, tone: 'info' },
              { label: 'Refused', value: 1, tone: 'danger' },
            ]}
          />
        </Card>
      </Section>

      <Section label="Three columns, with icons and drill-in">
        <Card>
          <StatGrid
            columns={3}
            items={[
              { label: 'Leave requests', value: 8, tone: 'brand', icon: 'calendar', onPress: () => {} },
              { label: 'Documents', value: 120, tone: 'info', icon: 'file-text', onPress: () => {} },
              { label: 'Forms', value: 4, tone: 'neutral', icon: 'clipboard', onPress: () => {} },
              { label: 'Expense notes', value: 14, tone: 'warning', icon: 'credit-card', onPress: () => {} },
              { label: 'Absent today', value: 2, tone: 'danger', icon: 'user-x', onPress: () => {} },
              { label: 'Announcements', value: 6, tone: 'success', icon: 'bell', onPress: () => {} },
            ]}
          />
        </Card>
      </Section>

      <Section label="Compact — glanceable overview strip">
        <Card padding="sm">
          <StatGrid
            columns={3}
            density="compact"
            items={[
              { label: 'Leave requests', value: 8, tone: 'brand', icon: 'calendar', onPress: () => {} },
              { label: 'Documents', value: 120, tone: 'info', icon: 'file-text', onPress: () => {} },
              { label: 'Forms', value: 4, tone: 'neutral', icon: 'clipboard', onPress: () => {} },
              { label: 'Expense notes', value: 14, tone: 'warning', icon: 'credit-card', onPress: () => {} },
              { label: 'Absent today', value: 2, tone: 'danger', icon: 'user-x', onPress: () => {} },
              { label: 'Announcements', value: 6, tone: 'success', icon: 'bell', onPress: () => {} },
            ]}
          />
        </Card>
      </Section>

      <Section label="Loading">
        <Card>
          <StatGrid
            loading
            columns={3}
            items={[
              { label: 'Leave requests', value: 0, tone: 'brand', icon: 'calendar' },
              { label: 'Documents', value: 0, tone: 'info', icon: 'file-text' },
              { label: 'Forms', value: 0, tone: 'neutral', icon: 'clipboard' },
            ]}
          />
        </Card>
      </Section>
    </>
  );
}
