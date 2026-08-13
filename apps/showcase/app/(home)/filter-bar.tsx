import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Card, FilterBar, IconButton, Text, spacing, useToast } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

interface AppliedFilter {
  key: string;
  label: string;
}

export default function FilterBarDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'FilterBar' }} />
      <FilterBarBody />
    </ScrollView>
  );
}

export function FilterBarBody() {
  const [filters, setFilters] = useState<AppliedFilter[]>([
    { key: 'dept', label: 'Engineering' },
    { key: 'role', label: 'Senior' },
    { key: 'tenure', label: '2+ years' },
  ]);
  const [query, setQuery] = useState('');
  const [sortActive, setSortActive] = useState(false);
  const toast = useToast();

  const chips = filters.map((f) => ({
    key: f.key,
    label: f.label,
    onRemove: () => setFilters((prev) => prev.filter((p) => p.key !== f.key)),
  }));

  return (
    <>
      <Text variant="body" tone="secondary">
        A flat layout, not a surface — the SearchBar pill carries the only border, triggers are
        borderless, and chips sit directly on the page. Pair with a BottomSheet (or Select) to
        pick new filters; the filter trigger tints brand once at least one chip is active.
      </Text>

      <Section label="With active filters">
        <FilterBar
          filters={chips}
          onClearAll={() => setFilters([])}
          onAdd={() => toast.info('Hook up a BottomSheet here to pick filter values.')}
        />
      </Section>

      <Section label="Search + filter + sort (the mobile 'SearchFilterBar' pattern)">
        <FilterBar
          search={{ value: query, onChange: setQuery, placeholder: 'Rechercher…' }}
          filters={chips}
          onClearAll={() => setFilters([])}
          onAdd={() => toast.info('Hook up a BottomSheet here to pick filter values.')}
          trigger={
            <IconButton
              icon="sliders"
              variant={sortActive ? 'tint' : 'ghost'}
              size="sm"
              accessibilityLabel="Sort"
              onPress={() => setSortActive((v) => !v)}
            />
          }
        />
      </Section>

      <Section label="Empty state (search only, no filters yet)">
        <FilterBar
          search={{ value: '', onChange: () => {}, placeholder: 'Rechercher un document…' }}
          filters={[]}
          onAdd={() => toast.info('Open picker')}
        />
      </Section>

      <Section label="With a count (rendered inside the search pill)">
        <FilterBar
          search={{ value: query, onChange: setQuery, placeholder: 'Rechercher…' }}
          filters={chips}
          onClearAll={() => setFilters([])}
          onAdd={() => toast.info('Hook up a BottomSheet here to pick filter values.')}
          count={filters.length === 0 ? 1243 : 342}
          countLabel="résultats"
          trigger={
            <IconButton
              icon="sliders"
              variant={sortActive ? 'tint' : 'ghost'}
              size="sm"
              accessibilityLabel="Sort"
              onPress={() => setSortActive((v) => !v)}
            />
          }
        />
      </Section>

      <Section label="Localised labels (filterLabel / clearAllLabel / search.clearLabel)">
        <FilterBar
          search={{
            value: query,
            onChange: setQuery,
            placeholder: 'Rechercher…',
            clearLabel: 'Effacer la recherche',
          }}
          filters={chips}
          onClearAll={() => setFilters([])}
          onAdd={() => toast.info('Ouvrir le sélecteur')}
          count={filters.length === 0 ? 1243 : 342}
          countLabel="résultats"
          clearAllLabel="Effacer tout"
        />
      </Section>

      <Section label="Count with no search (spacer pushes the trigger to the end)">
        <FilterBar
          filters={[]}
          count={1243}
          countLabel="employees"
          onAdd={() => toast.info('Open picker')}
        />
      </Section>

      <Section label="Inside a card (the card is the surface, the bar stays flat)">
        <Card padding="none">
          <View style={{ padding: spacing[3] }}>
            <FilterBar
              search={{ value: query, onChange: setQuery }}
              filters={chips}
              onClearAll={() => setFilters([])}
              onAdd={() => toast.info('Open picker')}
              count={filters.length === 0 ? 1243 : 342}
              countLabel="employees"
            />
          </View>
        </Card>
      </Section>
    </>
  );
}
