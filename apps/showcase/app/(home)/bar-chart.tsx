import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { BarChart, Card, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function BarChartDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'BarChart' }} />
      <BarChartBody />
    </ScrollView>
  );
}

const weeklyData = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 18 },
  { label: 'Wed', value: 9 },
  { label: 'Thu', value: 24 },
  { label: 'Fri', value: 16 },
  { label: 'Sat', value: 5 },
  { label: 'Sun', value: 3 },
];

const quarterlyData = [
  { label: 'Q1', value: 82 },
  { label: 'Q2', value: 95 },
  { label: 'Q3', value: 61 },
  { label: 'Q4', value: 108 },
];

const emptyData = [
  { label: 'A', value: 0 },
  { label: 'B', value: 0 },
  { label: 'C', value: 0 },
];

export function BarChartBody() {
  return (
    <>
      <Text variant="body" tone="secondary">
        Plain-View bar chart, no SVG. Each bar is a flex-sized View whose height is a percentage
        of the tallest value in the data (or an explicit maxValue), following the same
        no-extra-dependency approach as ProgressBar and Skeleton.
      </Text>

      <Section label="Weekly activity">
        <BarChart data={weeklyData} />
      </Section>

      <Section
        label="Custom max value"
        description="maxValue caps the scale against a target above the tallest bar.">
        <BarChart data={quarterlyData} maxValue={150} />
      </Section>

      <Section
        label="Compact / sparkline"
        description="No axis or labels, just the bars — for embedding inside a stat card.">
        <Card>
          <View style={{ gap: spacing[1] }}>
            <Text variant="caption" tone="muted">
              Signups this week
            </Text>
            <Text variant="subtitle">87</Text>
            <BarChart data={weeklyData} compact />
          </View>
        </Card>
      </Section>

      <Section label="All-zero values">
        <BarChart data={emptyData} />
      </Section>
    </>
  );
}
