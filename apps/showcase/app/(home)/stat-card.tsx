import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { StatCard, Text, spacing, useTheme } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function StatCardDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'StatCard' }} />
      <StatCardBody />
    </ScrollView>
  );
}

export function StatCardBody() {
  const { colors } = useTheme();

  return (
    <>
      <Text variant="body" tone="secondary">
        Dashboard metric tile. Leading icon bubble + muted label, a large value, and an optional
        up/down trend indicator. Built on `Card` and `Text` — no shadows.
      </Text>

      <Section label="Value only">
        <StatCard label="Open requests" value={12} />
      </Section>

      <Section label="With icon bubble">
        <View style={{ gap: spacing[3] }}>
          <StatCard
            label="Team members"
            value={48}
            tone="brand"
            icon={<Feather name="users" size={18} color={colors.brand} />}
          />
          <StatCard
            label="Documents"
            value={120}
            tone="neutral"
            icon={<Feather name="file-text" size={18} color={colors.textSecondary} />}
          />
        </View>
      </Section>

      <Section label="With trend">
        <View style={{ gap: spacing[3] }}>
          <StatCard
            label="Monthly revenue"
            value="$48,200"
            tone="brand"
            icon={<Feather name="trending-up" size={18} color={colors.brand} />}
            trend={{ direction: 'up', value: '+12% vs last month' }}
          />
          <StatCard
            label="Churn rate"
            value="3.2%"
            icon={<Feather name="user-minus" size={18} color={colors.textSecondary} />}
            trend={{ direction: 'down', value: '-0.4% vs last month' }}
          />
        </View>
      </Section>

      <Section label="Dashboard grid">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
          <View style={{ flexBasis: '47%', flexGrow: 1 }}>
            <StatCard
              label="Pending"
              value={7}
              tone="brand"
              icon={<Feather name="clock" size={18} color={colors.brand} />}
            />
          </View>
          <View style={{ flexBasis: '47%', flexGrow: 1 }}>
            <StatCard
              label="Approved"
              value={33}
              icon={<Feather name="check-circle" size={18} color={colors.success} />}
              trend={{ direction: 'up', value: '+5% this week' }}
            />
          </View>
          <View style={{ flexBasis: '47%', flexGrow: 1 }}>
            <StatCard
              label="Rejected"
              value={2}
              icon={<Feather name="x-circle" size={18} color={colors.danger} />}
              trend={{ direction: 'down', value: '-1% this week' }}
            />
          </View>
          <View style={{ flexBasis: '47%', flexGrow: 1 }}>
            <StatCard
              label="Avg. response"
              value="1.4d"
              icon={<Feather name="activity" size={18} color={colors.textSecondary} />}
            />
          </View>
        </View>
      </Section>
    </>
  );
}
