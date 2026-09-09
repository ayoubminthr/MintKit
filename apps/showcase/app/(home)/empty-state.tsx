import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import {
  Button,
  Card,
  EmptyState,
  Text,
  spacing,
  useTheme,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function EmptyStateDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'EmptyState' }} />
      <EmptyStateBody />
    </ScrollView>
  );
}

export function EmptyStateBody() {
  const { colors } = useTheme();
  return (
    <>
      <Text variant="body" tone="secondary">
        Centered icon + title + description with an optional action. Use it where a list, page, or
        section has no content to display.
      </Text>

      <Section label="Title only">
        <Card padding="none">
          <EmptyState title="No surveys yet" />
        </Card>
      </Section>

      <Section label="With description">
        <Card padding="none">
          <EmptyState
            icon="users"
            title="No teammates yet"
            description="Invite your first colleague to start collaborating on surveys and reviews."
          />
        </Card>
      </Section>

      <Section label="With action">
        <Card padding="none">
          <EmptyState
            icon="inbox"
            title="Inbox zero"
            description="You've cleared every notification. Take a breath — or start something new."
            action={
              <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                <Button label="Browse templates" variant="ghost" onPress={() => {}} />
                <Button label="Create survey" onPress={() => {}} />
              </View>
            }
          />
        </Card>
      </Section>

      <Section label="Custom illustration">
        <Card padding="none">
          <EmptyState
            illustration={<Feather name="file-text" size={40} color={colors.brand} />}
            illustrationSize={104}
            illustrationTint={colors.brandSubtle}
            title="No contracts yet"
            description="Add a contract to start tracking salary, dates and amendments."
            action={<Button label="Add contract" variant="link" onPress={() => {}} />}
          />
        </Card>
      </Section>

      <Section
        label="Bare illustration"
        description="illustrationFit='bare' drops the circle, so wide artwork isn't clipped.">
        <Card padding="none">
          <EmptyState
            illustration={
              <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                {(['image', 'film', 'music'] as const).map((icon) => (
                  <Feather key={icon} name={icon} size={28} color={colors.textMuted} />
                ))}
              </View>
            }
            illustrationFit="bare"
            title="Nothing in this album"
            description="Photos and clips you upload will show up here."
          />
        </Card>
      </Section>

      <Section label="Different icons">
        <View style={{ gap: spacing[3] }}>
          <Card padding="none">
            <EmptyState icon="search" title="No matches" description="Try a different filter." />
          </Card>
          <Card padding="none">
            <EmptyState
              icon="alert-circle"
              title="Connection lost"
              description="Check your network and try again."
            />
          </Card>
        </View>
      </Section>
    </>
  );
}
